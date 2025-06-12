import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Get username and new password from command line arguments
  const username = process.argv[2];
  const newPassword = process.argv[3];

  if (!username || !newPassword) {
    console.error('Error: Please provide both username and new password.');
    console.log('Usage: npx ts-node scripts/update-password.ts <username> <newPassword>');
    process.exit(1);
  }

  console.log(`Attempting to update password for user: ${username}`);

  try {
    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.error(`Error: User with username "${username}" not found.`);
      process.exit(1);
    }

    // Hash the new password
    const saltRounds = 10; // Standard salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    console.log(`New password hashed successfully.`);

    // Update the user's password in the database
    const updatedUser = await prisma.user.update({
      where: { username: user.username }, // Use the found username to be safe
      data: { password: hashedPassword },
    });

    console.log(`Password for user "${updatedUser.username}" has been updated successfully.`);
  } catch (error) {
    console.error('Error updating password:', error);
    process.exit(1);
  } finally {
    // Ensure Prisma client disconnects
    await prisma.$disconnect();
  }
}

main();
