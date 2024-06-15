import { PrismaClient, TaskStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create some users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
    },
  });

  // Create some tags
  const tag1 = await prisma.tag.create({
    data: {
      title: 'Urgent',
    },
  });

  const tag2 = await prisma.tag.create({
    data: {
      title: 'Bug',
    },
  });

  // Create a project with user1 as creator and add user2 as a member
  const project = await prisma.project.create({
    data: {
      name: 'Sample Project',
      description: 'This is a sample project',
      creatorId: user1.id,
      members: {
        connect: [{ id: user1.id }, { id: user2.id }],
      },
    },
  });

  // Create some tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Sample Task 1',
      description: 'This is a sample task 1',
      status: TaskStatus.PENDING,
      projectId: project.id,
      tags: {
        connect: [{ id: tag1.id }, { id: tag2.id }],
      },
      assignees: {
        connect: [{ id: user1.id }],
      },
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Sample Task 2',
      description: 'This is a sample task 2',
      status: TaskStatus.IN_PROGRESS,
      projectId: project.id,
      tags: {
        connect: [{ id: tag1.id }],
      },
      assignees: {
        connect: [{ id: user2.id }],
      },
    },
  });

  console.log({ user1, user2, project, task1, task2, tag1, tag2 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
