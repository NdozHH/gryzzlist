import { PrismaClient } from '@prisma/client'
import type { Prisma } from '@prisma/client'

interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient<Prisma.PrismaClientOptions, 'query'>
}

declare const global: CustomNodeJsGlobal

let prisma: PrismaClient<Prisma.PrismaClientOptions, 'query'>

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
  prisma.$connect()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
      errorFormat: 'pretty',
    })
    // eslint-disable-next-line no-console
    console.log('Development: Created DB connection.')
  }
  prisma = global.prisma
  prisma.$on('query', event => {
    const duration = `${event.duration}ms`
    // eslint-disable-next-line no-console
    console.log(
      `Duration: ${duration} Params: ${event.params} ---> ${event.query}`,
    )
  })
  prisma.$connect()
}

export * from '@prisma/client'
export default prisma
