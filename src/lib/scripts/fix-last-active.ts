import prisma from "../prisma";

async function main() {
  await prisma.admin.updateMany({
    where: {
      lastActiveAt: null,
    },
    data: {
      lastActiveAt: new Date(),
    },
  });

  console.log("✅ lastActiveAt fixed");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
