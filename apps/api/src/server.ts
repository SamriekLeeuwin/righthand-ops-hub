import 'dotenv/config';
import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb';

const app = Fastify();
const prisma = new PrismaClient();

app.get('/healthz', async () => {
  let mysqlOk = false;
  let mongoOk = false;

  try {
    await prisma.$queryRaw`SELECT 1`;
    mysqlOk = true;
  } catch (e) {
    console.error('MySQL check failed', e);
  }

  try {
    const mongo = new MongoClient(process.env.MONGO_URL || '');
    await mongo.connect();
    await mongo.db(process.env.MONGO_DB).command({ ping: 1 });
    mongoOk = true;
    await mongo.close();
  } catch (e) {
    console.error('Mongo check failed', e);
  }

  return {
    status: mysqlOk && mongoOk ? 'ok' : 'degraded',
    mysql: mysqlOk ? 'ok' : 'error',
    mongo: mongoOk ? 'ok' : 'error',
    time: new Date().toISOString()
  };
});

app.listen({ port: Number(process.env.PORT) || 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at ${address}`);
});
