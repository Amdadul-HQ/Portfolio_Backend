// Seeds/updates the single ADMIN account from ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD in .env.
// The /auth/create endpoint always creates USER-role accounts, so this is the
// only way to get an ADMIN account, which the dashboard's middleware requires.
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      'ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before seeding.'
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { name, password: hashedPassword, role: 'ADMIN' },
    create: { name, email, password: hashedPassword, role: 'ADMIN' },
  });

  console.log(`ADMIN user ready: ${admin.email} (id: ${admin.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
