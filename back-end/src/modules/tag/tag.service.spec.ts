import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { TagRepository } from './tag.repository';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { NotFoundException } from '@nestjs/common';

describe('TagService', () => {
  let service: TagService;
  let repository: TagRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: TagRepository,
          useValue: {
            findAllTags: jest.fn(),
            createTag: jest.fn(),
            getTagById: jest.fn(),
            updateTag: jest.fn(),
            deleteTag: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
    repository = module.get<TagRepository>(TagRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return tags', async () => {
      const page = 1;
      const size = 10;
      const tags = [{ id: 1, title: 'Tag 1' }, { id: 2, title: 'Tag 2' }];

      (repository.findAllTags as jest.Mock).mockResolvedValue(tags);

      const result = await service.findAll(page, size);

      expect(result).toEqual(tags);
      expect(repository.findAllTags).toHaveBeenCalledWith(page, size);
    });
  });

  describe('create', () => {
    it('should create a tag', async () => {
      const createTagDto: CreateTagDto = { title: 'Test Tag' };
      const createdTag = { id: 1, ...createTagDto };

      (repository.createTag as jest.Mock).mockResolvedValue(createdTag);

      const result = await service.create(createTagDto);

      expect(result).toEqual(createdTag);
      expect(repository.createTag).toHaveBeenCalledWith(createTagDto);
    });
  });

  describe('findOne', () => {
    it('should return a tag when found', async () => {
      const id = 1;
      const tag = { id: 1, title: 'Tag 1' };

      (repository.getTagById as jest.Mock).mockResolvedValue(tag);

      const result = await service.findOne(id);

      expect(result).toEqual(tag);
      expect(repository.getTagById).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when tag is not found', async () => {
      const id = 999;

      (repository.getTagById as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      expect(repository.getTagById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const id = 1;
      const updateTagDto: UpdateTagDto = { title: 'Updated Tag' };
      const updatedTag = { id, ...updateTagDto };

     (repository.getTagById as jest.Mock).mockResolvedValue(updatedTag);
     (repository.updateTag as jest.Mock).mockResolvedValue(updatedTag);

      const result = await service.update(id, updateTagDto);

      expect(result).toEqual(updatedTag);
      expect(repository.getTagById).toHaveBeenCalledWith(id);
      expect(repository.updateTag).toHaveBeenCalledWith(id, updateTagDto);
    });

    it('should throw NotFoundException when tag is not found', async () => {
      const id = 999;
      const updateTagDto: UpdateTagDto = { title: 'Updated Tag' };

      (repository.getTagById as jest.Mock).mockResolvedValue(null);

      await expect(service.update(id, updateTagDto)).rejects.toThrow(NotFoundException);
      expect(repository.getTagById).toHaveBeenCalledWith(id);
    });
  });

  describe('remove', () => {
    it('should delete a tag', async () => {
      const id = 1;

     (repository.getTagById as jest.Mock).mockResolvedValue({ id });

      const result = await service.remove(id);

      expect(result).toBeUndefined();
      expect(repository.getTagById).toHaveBeenCalledWith(id);
      expect(repository.deleteTag).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when tag is not found', async () => {
      const id = 999;

      (repository.getTagById as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      expect(repository.getTagById).toHaveBeenCalledWith(id);
    });
  });
});
