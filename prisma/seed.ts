import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default user if it doesn't exist
  const user = await prisma.user.upsert({
    where: { id: 'user123' },
    update: {},
    create: {
      id: 'user123',
      email: 'default@example.com',
      name: 'Default User',
    },
  });

  console.log('Default user created or found:', user);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });