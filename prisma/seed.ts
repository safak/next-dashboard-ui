import { PrismaClient, Role } from '@prisma/client'; // Import Role
import bcrypt from 'bcryptjs'; // Import bcryptjs

const prisma = new PrismaClient();

// Define status strings based on the schema enum
const statusStrings = ['NEW', 'WAITING', 'NOT_SEND', 'SEND', 'DONE'];

async function main() {
  console.log('Start seeding...');

  // --- Create User with Hashed Password ---
  const username = 'seed_user';
  const plainPassword = 'password123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10); // Hash the password

  const user = await prisma.user.upsert({
    where: { username: username },
    update: {
      // Optionally update fields if user exists, e.g., password hash
      password: hashedPassword,
      name: 'Seed',
      email: `${username}@example.com`, // Ensure email is unique or handle conflicts
      role: Role.EMPLOYEE, // Assign a role
    },
    create: {
      username: username,
      password: hashedPassword,
      name: 'Seed',
      email: `${username}@example.com`,
      role: Role.EMPLOYEE, // Assign a role
      // Optionally create and link Employee profile here if needed
      // employeeProfile: {
      //   create: {
      //     username: username, // Can reuse username or have a different employee identifier
      //     name: 'Seed',
      //     surname: 'User',
      //     // Add other Employee fields as needed
      //   }
      // }
    },
  });
  console.log(`Upserted user: ${user.username} with role ${user.role}`);

  // --- Create Companies ---
  // Note: The original seed script linked designs to an Employee ID.
  // If you still need the Employee model separate from User for other reasons,
  // you would create/find the Employee and link it to the User via userId.
  // For simplicity now, we focus on the User model for authentication.
  // Designs will be linked to the User ID later in the script.

  // Using manual IDs as 'id' is unique but not auto-incrementing in the schema.
  const company1 = await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Tech Solutions Seed Inc.',
    },
  });

  const company2 = await prisma.company.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Creative Designs Seed Co.',
    },
  });
  console.log(`Upserted companies: ${company1.name}, ${company2.name}`);

  // --- Create Designs ---
  // Link designs to the User ID
  const designData = [];
  const companies = [company1, company2];

  for (let i = 1; i <= 25; i++) {
    const companyIndex = i % companies.length;
    const statusIndex = i % statusStrings.length; // Use the defined strings array

    designData.push({
      companyId: companies[companyIndex].id, // Use company.id
      templateName: `Seed Template ${i}`, // Provide templateName
      status: statusStrings[statusIndex], // Assign the string status
      userId: user.id, // Assign to the created User ID
      // partners: null, // Optional field
      // noteId: null,   // Optional field
    });
  }

  // Delete existing designs potentially created by this seed before to avoid conflicts
  // Be cautious with this in production environments
  // A more robust approach might involve checking existing records
  // For simplicity here, we clear previous seed designs assuming they follow the naming pattern
  await prisma.design.deleteMany({
    where: {
      templateName: {
        startsWith: 'Seed Template',
      },
    },
  });
  console.log('Deleted previous seed designs (if any).');

  // Use createMany for efficiency
  const createdDesigns = await prisma.design.createMany({
    data: designData,
    skipDuplicates: true, // Should not be needed after deleteMany, but safe to keep
  });

  console.log(`Created ${createdDesigns.count} designs.`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
