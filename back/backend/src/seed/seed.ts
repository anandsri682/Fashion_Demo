import { connectDatabase, disconnectDatabase } from '../config/database';
import { env } from '../config/env';
import { User } from '../models/User';
import { Product } from '../models/Product';

/**
 * Optional development seed data — a small number of sample fashion products.
 * This is NOT required for the app to function; products created via the
 * admin panel work identically to seeded ones.
 * Run with: npm run seed
 */
const sampleProducts = [
  {
    title: 'Classic Oxford Shirt',
    description: 'A timeless slim-fit Oxford shirt made from breathable cotton, perfect for both casual and formal wear.',
    category: 'shirts',
    subcategory: 'formal',
    gender: 'men' as const,
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    stock: 40,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Black'],
    images: [{ url: '/uploads/seed/oxford-shirt.jpg', alt: 'Classic Oxford Shirt' }],
    featured: true,
    newArrival: false,
  },
  {
    title: 'Relaxed Fit Denim Jeans',
    description: 'Premium stretch denim jeans with a relaxed fit and a durable, fade-resistant finish.',
    category: 'jeans',
    subcategory: 'casual',
    gender: 'men' as const,
    price: 2299,
    originalPrice: 2799,
    discount: 18,
    stock: 25,
    sizes: ['30', '32', '34', '36'],
    colors: ['Indigo', 'Black'],
    images: [{ url: '/uploads/seed/denim-jeans.jpg', alt: 'Relaxed Fit Denim Jeans' }],
    featured: false,
    newArrival: true,
  },
  {
    title: 'Floral Wrap Dress',
    description: 'A flowy floral wrap dress with a flattering silhouette, ideal for summer occasions.',
    category: 'dresses',
    subcategory: 'casual',
    gender: 'women' as const,
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    stock: 15,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral Pink', 'Floral Blue'],
    images: [{ url: '/uploads/seed/wrap-dress.jpg', alt: 'Floral Wrap Dress' }],
    featured: true,
    newArrival: true,
  },
  {
    title: 'Everyday Canvas Sneakers',
    description: 'Lightweight canvas sneakers with a cushioned insole, built for all-day comfort.',
    category: 'footwear',
    subcategory: 'sneakers',
    gender: 'unisex' as const,
    price: 1699,
    stock: 60,
    sizes: ['6', '7', '8', '9', '10'],
    colors: ['White', 'Grey', 'Navy'],
    images: [{ url: '/uploads/seed/canvas-sneakers.jpg', alt: 'Everyday Canvas Sneakers' }],
    featured: false,
    newArrival: false,
  },
];

function slugify(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function seed(): Promise<void> {
  await connectDatabase();

  const admin = await User.findOne({ email: env.ADMIN_EMAIL.toLowerCase() });
  if (!admin) {
    // eslint-disable-next-line no-console
    console.log('[seed] No admin account found. Run `npm run seed:admin` first.');
    await disconnectDatabase();
    process.exit(1);
  }

  for (const product of sampleProducts) {
    const slug = slugify(product.title);
    // eslint-disable-next-line no-await-in-loop
    const exists = await Product.findOne({ slug });
    if (exists) {
      // eslint-disable-next-line no-console
      console.log(`[seed] Product '${product.title}' already exists. Skipping.`);
      // eslint-disable-next-line no-continue
      continue;
    }
    // eslint-disable-next-line no-await-in-loop
    await Product.create({ ...product, slug, createdBy: admin!._id });
    // eslint-disable-next-line no-console
    console.log(`[seed] Created product: ${product.title}`);
  }

  // eslint-disable-next-line no-console
  console.log('[seed] Development seed complete.');
  await disconnectDatabase();
  process.exit(0);
}

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('[seed] Failed:', error);
  process.exit(1);
});
