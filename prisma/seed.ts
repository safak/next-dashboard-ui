import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // 1. Create a default User
  const user1 = await prisma.user.create({
    data: {
      email: 'admin@mahidol.ac.th',
      name: 'VZA Admin',
      role: 'admin',
    },
  });
  console.log(`Created user: ${user1.name}`);

  // 2. Create the default Keywords
  await prisma.keyword.create({
    data: {
      name: 'Mahidol University',
      type: 'Main',
      //userId: user1.id, // Link to the user we just created
    },
  });
  await prisma.keyword.create({
    data: {
      name: 'MUIC',
      type: 'Main',
      //userId: user1.id,
    },
  });
  await prisma.keyword.create({
    data: {
      name: 'Salaya',
      type: 'Sub',
      //userId: user1.id,
    },
  });
  console.log('Created keywords.');

  console.log('Seeding finished.');
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
