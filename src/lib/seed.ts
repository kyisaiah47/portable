import { PrismaClient } from '@prisma/client';
import { hashPassword } from './auth';

const prisma = new PrismaClient();

export async function seedDatabase() {
  try {
    const passwordHash = await hashPassword('demo123');

    const demoUser = await prisma.user.upsert({
      where: { email: 'sarah.driver@email.com' },
      update: {},
      create: {
        email: 'sarah.driver@email.com',
        passwordHash,
        firstName: 'Sarah',
        lastName: 'Johnson',
        phone: '555-0123',
      },
    });

    const platforms = await Promise.all([
      prisma.gigPlatform.upsert({
        where: { name: 'Uber' },
        update: {},
        create: { name: 'Uber', logoUrl: '/logos/uber.png' },
      }),
      prisma.gigPlatform.upsert({
        where: { name: 'DoorDash' },
        update: {},
        create: { name: 'DoorDash', logoUrl: '/logos/doordash.png' },
      }),
      prisma.gigPlatform.upsert({
        where: { name: 'Upwork' },
        update: {},
        create: { name: 'Upwork', logoUrl: '/logos/upwork.png' },
      }),
      prisma.gigPlatform.upsert({
        where: { name: 'Lyft' },
        update: {},
        create: { name: 'Lyft', logoUrl: '/logos/lyft.png' },
      }),
    ]);

    const benefitTypes = await Promise.all([
      prisma.benefitType.upsert({
        where: { name: 'Health Insurance' },
        update: {},
        create: {
          name: 'Health Insurance',
          description: 'Medical, dental, and vision coverage',
          category: 'health',
        },
      }),
      prisma.benefitType.upsert({
        where: { name: 'Retirement Savings' },
        update: {},
        create: {
          name: 'Retirement Savings',
          description: 'IRA and 401k options',
          category: 'retirement',
        },
      }),
      prisma.benefitType.upsert({
        where: { name: 'Emergency Fund' },
        update: {},
        create: {
          name: 'Emergency Fund',
          description: 'Automated emergency savings',
          category: 'emergency',
        },
      }),
    ]);

    const benefits = await Promise.all([
      prisma.benefit.create({
        data: {
          typeId: benefitTypes[0].id,
          name: 'Basic Health Plan',
          description: 'Essential health coverage for gig workers',
          provider: 'Stride Health',
          monthlyCost: 89,
          coverageDetails: 'Doctor visits, prescription coverage, emergency care',
        },
      }),
      prisma.benefit.create({
        data: {
          typeId: benefitTypes[1].id,
          name: 'Retirement IRA',
          description: 'Tax-advantaged retirement savings',
          provider: 'Guideline',
          monthlyCost: 0,
          coverageDetails: 'Automatic contributions, investment options',
        },
      }),
    ]);

    const sampleEarnings = [
      { platformId: platforms[0].id, amount: 89.50, description: '6 rides', date: '2024-09-18' },
      { platformId: platforms[1].id, amount: 45.25, description: '3 deliveries', date: '2024-09-18' },
      { platformId: platforms[2].id, amount: 150.00, description: 'Logo design project', date: '2024-09-17' },
      { platformId: platforms[0].id, amount: 67.80, description: '4 rides', date: '2024-09-17' },
      { platformId: platforms[1].id, amount: 78.30, description: '5 deliveries', date: '2024-09-16' },
    ];

    for (const earning of sampleEarnings) {
      await prisma.earning.create({
        data: {
          userId: demoUser.id,
          platformId: earning.platformId,
          amount: earning.amount,
          date: new Date(earning.date),
          description: earning.description,
        },
      });

      await prisma.contribution.create({
        data: {
          userId: demoUser.id,
          amount: Math.round(earning.amount * 0.04 * 100) / 100,
          type: 'retirement',
          date: new Date(earning.date),
        },
      });
    }

    console.log('Database seeded successfully!');
    console.log('Demo user credentials:');
    console.log('Email: sarah.driver@email.com');
    console.log('Password: demo123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedDatabase();
}