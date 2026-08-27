import { connectDatabase, disconnectDatabase } from '../config/database';
import { env } from '../config/env';
import { User } from '../models/User';

/**
 * Safe admin seed: checks whether an admin with ADMIN_EMAIL already exists
 * before creating one, so this can be run repeatedly without duplicates.
 * Run with: npm run seed:admin
 */
async function seedAdmin(): Promise<void> {
  await connectDatabase();

  const existingAdmin = await User.findOne({ email: env.ADMIN_EMAIL.toLowerCase() });

  if (existingAdmin) {
    // eslint-disable-next-line no-console
    console.log(`[seed:admin] Admin already exists (${env.ADMIN_EMAIL}). Skipping.`);
  } else {
    await User.create({
      firstName: env.ADMIN_FIRST_NAME,
      lastName: env.ADMIN_LAST_NAME,
      email: env.ADMIN_EMAIL.toLowerCase(),
      phone: '0000000000',
      password: env.ADMIN_PASSWORD, // hashed automatically by the User pre-save hook
      role: 'ADMIN',
    });
    // eslint-disable-next-line no-console
    console.log(`[seed:admin] Admin account created: ${env.ADMIN_EMAIL}`);
  }

  await disconnectDatabase();
  process.exit(0);
}

seedAdmin().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('[seed:admin] Failed:', error);
  process.exit(1);
});
