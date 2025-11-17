import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create demo users
  const user1 = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', // password: demo123
    },
  });

  const org1 = await prisma.organization.create({
    data: {
      name: 'Demo Organization',
      members: {
        create: {
          userId: user1.id,
          role: 'OWNER',
        },
      },
    },
  });

  // Generate 50k synthetic tasks for performance testing
  const tasks = [];
  for (let i = 0; i < 50000; i++) {
    tasks.push({
      title: `Task ${i + 1}`,
      description: `Description for task ${i + 1}`,
      status: ['todo', 'in_progress', 'done'][Math.floor(Math.random() * 3)],
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      organizationId: org1.id,
    });
  }

  // Insert in batches to avoid memory issues
  const batchSize = 1000;
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    await prisma.task.createMany({
      data: batch,
    });
    console.log(`Created ${i + batchSize} tasks...`);
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

