import { PrismaClient } from '@prisma/client'

declare global {
  // Permet de stocker la variable globale pour éviter la recréation en hot reload
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma
