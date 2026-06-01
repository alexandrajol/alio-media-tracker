const prisma = require('./config/prismaClient');

async function seedDatabase() {
  try {
    // Check if categories already exist
    const existingCategories = await prisma.category.count();

    if (existingCategories === 0) {
      console.log('🌱 Seeding database with initial categories...');

      await prisma.category.createMany({
        data: [
          { name: 'Movie' },
          { name: 'Book' },
          { name: 'TV Show' }
        ],
        skipDuplicates: true
      });

      console.log('✅ Database seeded successfully!');
    } else {
      console.log('✓ Database already seeded, skipping...');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    // Don't throw - let the app start even if seeding fails
  }
}

module.exports = seedDatabase;
