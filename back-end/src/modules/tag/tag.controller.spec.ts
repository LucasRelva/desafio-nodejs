import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { PrismaService } from '../../prisma.service';

describe('TagController', () => {
  let controller: TagController;
  let service: TagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        TagService,
        TagRepository,
        PrismaService,
      ],
    }).compile();

    controller = module.get<TagController>(TagController);
    service = module.get<TagService>(TagService);
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a tag', async () => {
      const createTagDto: CreateTagDto = { title: 'Test Tag' };
      const createdTag = { id: 1, title: 'Test Tag' };

      jest.spyOn(service, 'create').mockResolvedValue(createdTag);

      const result = await controller.create(createTagDto);

      expect(result).toEqual(createdTag);
      expect(service.create).toHaveBeenCalledWith(createTagDto);
    });

    it('should throw BadRequestException when invalid data is provided', async () => {
      const createTagDto: CreateTagDto = { title: '' };

      jest.spyOn(service, 'create').mockRejectedValue(new BadRequestException());

      await expect(controller.create(createTagDto)).rejects.toThrow(BadRequestException);
      expect(service.create).toHaveBeenCalledWith(createTagDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of tags', async () => {
      const page = 1;
      const size = 10;
      const tags = [{ id: 1, title: 'Tag 1' }, { id: 2, title: 'Tag 2' }];

      jest.spyOn(service, 'findAll').mockResolvedValue(tags);

      const result = await controller.findAll(page, size);

      expect(result).toEqual(tags);
      expect(service.findAll).toHaveBeenCalledWith(page, size);
    });

    it('should throw BadRequestException when invalid page number is provided', async () => {
      const page = 0;
      const size = 10;

      jest.spyOn(service, 'findAll').mockRejectedValue(new BadRequestException());

      await expect(controller.findAll(page, size)).rejects.toThrow(BadRequestException);
      expect(service.findAll).toHaveBeenCalledWith(page, size);
    });
  });

  describe('findOne', () => {
    it('should return a tag when found', async () => {
      const id = 1;
      const tag = { id: 1, title: 'Tag 1' };

      jest.spyOn(service, 'findOne').mockResolvedValue(tag);

      const result = await controller.findOne(id);

      expect(result).toEqual(tag);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when tag is not found', async () => {
      const id = 999;

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const id = 1;
      const updateTagDto: UpdateTagDto = { title: 'Updated Tag' };
      const updatedTag = { id: 1, title: 'Updated Tag' };

      jest.spyOn(service, 'update').mockResolvedValue(updatedTag);

      const result = await controller.update(id, updateTagDto);

      expect(result).toEqual(updatedTag);
      expect(service.update).toHaveBeenCalledWith(id, updateTagDto);
    });

    it('should throw NotFoundException when tag is not found', async () => {
      const id = 999;
      const updateTagDto: UpdateTagDto = { title: 'Updated Tag' };

      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update(id, updateTagDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(id, updateTagDto);
    });

    it('should throw BadRequestException when invalid data is provided', async () => {
      const id = 1;
      const updateTagDto: UpdateTagDto = { title: '' };

      jest.spyOn(service, 'update').mockRejectedValue(new BadRequestException());

      await expect(controller.update(id, updateTagDto)).rejects.toThrow(BadRequestException);
      expect(service.update).toHaveBeenCalledWith(id, updateTagDto);
    });
  });

  describe('remove', () => {
    it('should delete a tag', async () => {
      const id = 1;

      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove(id);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when tag is not found', async () => {
      const id = 999;

      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
