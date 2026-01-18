import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Seed Academy
  const academy = await prisma.academy.create({
    data: {
      academyName: faker.company.name(),
      academyOwnerId: faker.string.uuid(),
      academyIsActive: true,
    },
  });

  // Seed Admins
  for (let i = 0; i < 2; i++) {
    await prisma.admin.create({
      data: {
        id: faker.string.uuid(),
        latest002: faker.lorem.word(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
      },
    });
  }

  // Seed Martial Arts Disciplines
  const disciplines = await Promise.all(
    ["Kickboxing", "Hwal Moo Do", "Tang Soo Do"].map(async (artName) => {
      return prisma.martialArtsDiscipline.create({
        data: {
          artName,
          artDescription: faker.lorem.sentence(),
        },
      });
    })
  );

  // Seed Members
  const memberIds: string[] = [];
  for (let i = 0; i < 80; i++) {
    const member = await prisma.member.create({
      data: {
        id: faker.string.uuid(),
        username: faker.internet.userName(),
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        bloodType: faker.helpers.arrayElement([
          "A_POSITIVE",
          "A_NEGATIVE",
          "B_POSITIVE",
          "B_NEGATIVE",
          "AB_POSITIVE",
          "AB_NEGATIVE",
          "O_POSITIVE",
          "O_NEGATIVE",
        ]),
        isBloodDonor: faker.datatype.boolean(),
        sex: faker.helpers.arrayElement(["MALE", "FEMALE"]),
      },
    });
    memberIds.push(member.id);
  }

  // Seed Parents
  for (let i = 0; i < 30; i++) {
    await prisma.parent.create({
      data: {
        id: faker.string.uuid(),
        username: faker.internet.userName(),
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        bloodType: faker.helpers.arrayElement([
          "A_POSITIVE",
          "A_NEGATIVE",
          "B_POSITIVE",
          "B_NEGATIVE",
          "AB_POSITIVE",
          "AB_NEGATIVE",
          "O_POSITIVE",
          "O_NEGATIVE",
        ]),
        isBloodDonor: faker.datatype.boolean(),
        sex: faker.helpers.arrayElement(["MALE", "FEMALE"]),
        memberId: faker.helpers.arrayElement(memberIds),
      },
    });
  }

  // Seed Instructors
  const instructorIds: string[] = [];
  for (let i = 0; i < 15; i++) {
    const instructor = await prisma.instructor.create({
      data: {
        id: faker.string.uuid(),
        username: faker.internet.userName(),
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        bloodType: faker.helpers.arrayElement([
          "A_POSITIVE",
          "A_NEGATIVE",
          "B_POSITIVE",
          "B_NEGATIVE",
          "AB_POSITIVE",
          "AB_NEGATIVE",
          "O_POSITIVE",
          "O_NEGATIVE",
        ]),
        isBloodDonor: faker.datatype.boolean(),
        sex: faker.helpers.arrayElement(["MALE", "FEMALE"]),
      },
    });
    instructorIds.push(instructor.id);
  }

  // Seed Belts for each discipline
  const beltNames = ["White", "Yellow", "Orange", "Green", "Blue", "Brown", "Red", "Black"];
  await Promise.all(
    disciplines.map(async (discipline) => {
      await Promise.all(
        beltNames.map(async (beltName, index) => {
          await prisma.belt.create({
            data: {
              beltName,
              martialArtsDisciplineId: discipline.id,
              instructorID: instructorIds[index % instructorIds.length], // Assign instructors in rotation
              memberId: memberIds[index % memberIds.length], // Assign members in rotation
            },
          });
        })
      );
    })
  );

  console.log("Database seeded successfully!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
