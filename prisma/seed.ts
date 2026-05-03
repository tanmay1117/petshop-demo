import 'dotenv/config';
import prisma from '../src/lib/prisma';

async function main() {
  await prisma.product.deleteMany();

  const products = [
    { name: 'Astronaut Pet Backpack', description: 'Stylish clear bubble backpack for cats and small dogs.', price: 2499, costPrice: 1200, stockQuantity: 15, minStock: 5, category: 'Carriers', brand: 'PetVoyage', imageUrl: 'https://images.unsplash.com/photo-1583337130417-13104dec14a1?q=80&w=600&auto=format&fit=crop', sku: 'SKU-ASTRO-001', barcode: '8901234567890' },
    { name: 'Premium Leather Collar', description: 'Genuine leather collar with polished metal buckle.', price: 899, costPrice: 400, stockQuantity: 30, minStock: 10, category: 'Accessories', brand: 'PetLux', imageUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=600&auto=format&fit=crop', sku: 'SKU-COLL-002', barcode: '8901234567891' },
    { name: 'Interactive Puzzle Feeder', description: 'Multi-level treat dispensing puzzle toy.', price: 1299, costPrice: 600, stockQuantity: 0, minStock: 5, category: 'Toys', brand: 'BrainPaws', imageUrl: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?q=80&w=600&auto=format&fit=crop', sku: 'SKU-PUZZL-003', barcode: '8901234567892' },
    { name: 'Cozy Orthopedic Pet Bed', description: 'Memory foam bed for joint support.', price: 3499, costPrice: 1800, stockQuantity: 8, minStock: 3, category: 'Accessories', brand: 'ComfyPet', imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=600&auto=format&fit=crop', sku: 'SKU-BED-004', barcode: '8901234567893' },
    { name: 'Automatic Water Fountain', description: 'Ultra-quiet with 3-stage filtration. 2.5L capacity.', price: 1899, costPrice: 900, stockQuantity: 12, minStock: 5, category: 'Health', brand: 'AquaPaws', imageUrl: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?q=80&w=600&auto=format&fit=crop', sku: 'SKU-FOUNT-005', barcode: '8901234567894' },
    { name: 'Retractable Dog Leash', description: 'Heavy-duty with ergonomic grip. 5m extend.', price: 749, costPrice: 350, stockQuantity: 25, minStock: 10, category: 'Accessories', brand: 'WalkPro', imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=600&auto=format&fit=crop', sku: 'SKU-LEASH-006', barcode: '8901234567895' },
    { name: 'Stainless Steel Bowl Set', description: 'Non-slip bowls with silicone base. Set of 2.', price: 599, costPrice: 250, stockQuantity: 40, minStock: 15, category: 'Accessories', brand: 'PetEat', imageUrl: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?q=80&w=600&auto=format&fit=crop', sku: 'SKU-BOWL-007', barcode: '8901234567896' },
    { name: 'Grooming Brush Kit', description: '5-piece professional grooming kit.', price: 1499, costPrice: 700, stockQuantity: 0, minStock: 5, category: 'Grooming', brand: 'GroomPlus', imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=600&auto=format&fit=crop', sku: 'SKU-GROOM-008', barcode: '8901234567897' },
    { name: 'Pet GPS Tracker Collar', description: 'Real-time GPS with 30-day battery. iOS & Android.', price: 4999, costPrice: 2500, stockQuantity: 6, minStock: 3, category: 'Health', brand: 'TrackPet', imageUrl: 'https://images.unsplash.com/photo-1587463277881-de038e8f5aa6?q=80&w=600&auto=format&fit=crop', sku: 'SKU-GPS-009', barcode: '8901234567898' },
    { name: 'Cat Scratching Tower', description: '120cm tall with hammock and dangling toy.', price: 3999, costPrice: 2000, stockQuantity: 4, minStock: 2, category: 'Toys', brand: 'CatWorld', imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=600&auto=format&fit=crop', sku: 'SKU-TOWER-010', barcode: '8901234567899' },
    { name: 'Reflective Safety Harness', description: 'No-pull mesh harness with reflective strips.', price: 1199, costPrice: 550, stockQuantity: 20, minStock: 8, category: 'Accessories', brand: 'SafeWalk', imageUrl: 'https://images.unsplash.com/photo-1601758003122-53c40e686a19?q=80&w=600&auto=format&fit=crop', sku: 'SKU-HARN-011', barcode: '8901234567900' },
    { name: 'Plush Squeaky Toy Bundle', description: 'Set of 6 plush toys. Non-toxic materials.', price: 699, costPrice: 300, stockQuantity: 35, minStock: 10, category: 'Toys', brand: 'PlayPaws', imageUrl: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=600&auto=format&fit=crop', sku: 'SKU-PLUSH-012', barcode: '8901234567901' },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log(`✅ Seeded ${products.length} products!`);
}

main()
  .then(async () => { await prisma.$disconnect(); process.exit(0); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
