import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ProjectModule } from './modules/project/project.module';
import { TaskModule } from './modules/task/task.module';
import { TagModule } from './modules/tag/tag.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    UserModule,
    ProjectModule,
    TaskModule,
    TagModule,
    AuthModule,
    PrismaModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
