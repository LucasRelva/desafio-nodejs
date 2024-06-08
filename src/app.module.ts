import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ProjectModule } from './modules/project/project.module';
import { TaskModule } from './modules/task/task.module';
import { TagModule } from './modules/tag/tag.module';

@Module({
  imports: [UserModule, ProjectModule, TaskModule, TagModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
