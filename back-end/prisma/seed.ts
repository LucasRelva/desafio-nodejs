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

  const tag3 = await prisma.tag.create({
    data: {
      title: 'Feature',
    },
  });

  // Create projects with user1 as creator and add user2 as a member
  const project1 = await prisma.project.create({
    data: {
      name: 'Sample Project 1',
      description: 'This is sample project 1',
      creatorId: user1.id,
      members: {
        connect: [{ id: user1.id }, { id: user2.id }],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Sample Project 2',
      description: 'This is sample project 2',
      creatorId: user1.id,
      members: {
        connect: [{ id: user1.id }, { id: user2.id }],
      },
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'Sample Project 3',
      description: 'This is sample project 3',
      creatorId: user1.id,
      members: {
        connect: [{ id: user1.id }, { id: user2.id }],
      },
    },
  });

  // Create tasks for each project
  const createTasksForProject = async (projectId: number) => {
    await prisma.task.create({
      data: {
        title: `Task for project ${projectId} - 1`,
        description: `This is task 1 for project ${projectId}`,
        status: TaskStatus.PENDING,
        projectId,
        tags: {
          connect: [{ id: tag1.id }, { id: tag2.id }],
        },
        assignees: {
          connect: [{ id: user1.id }],
        },
      },
    });

    await prisma.task.create({
      data: {
        title: `Task for project ${projectId} - 2`,
        description: `This is task 2 for project ${projectId}`,
        status: TaskStatus.IN_PROGRESS,
        projectId,
        tags: {
          connect: [{ id: tag1.id }],
        },
        assignees: {
          connect: [{ id: user2.id }],
        },
      },
    });

    await prisma.task.create({
      data: {
        title: `Task for project ${projectId} - 3`,
        description: `This is task 3 for project ${projectId}`,
        status: TaskStatus.COMPLETED,
        projectId,
        tags: {
          connect: [{ id: tag2.id }, { id: tag3.id }],
        },
        assignees: {
          connect: [{ id: user1.id }, { id: user2.id }],
        },
      },
    });

    await prisma.task.create({
      data: {
        title: `Task for project ${projectId} - 4`,
        description: `This is task 4 for project ${projectId}`,
        status: TaskStatus.PENDING,
        projectId,
        tags: {
          connect: [{ id: tag3.id }],
        },
        assignees: {
          connect: [{ id: user1.id }],
        },
      },
    });
  };

  await createTasksForProject(project1.id);
  await createTasksForProject(project2.id);
  await createTasksForProject(project3.id);

  console.log({ user1, user2, project1, project2, project3, tag1, tag2, tag3 });
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
