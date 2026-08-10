import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const plans = [
    {
      slug: 'free',
      name: 'Free',
      priceUsd: 0,
      interval: 'month',
      maxTasksPerMonth: 100,
      maxMembers: 1,
      features: { tasks: 100, analytics: false },
    },
    {
      slug: 'pro',
      name: 'Pro',
      priceUsd: 2900,
      interval: 'month',
      maxTasksPerMonth: 1000,
      maxMembers: 1,
      features: { tasks: 1000, analytics: true },
    },
    {
      slug: 'team',
      name: 'Team',
      priceUsd: 9900,
      interval: 'month',
      maxTasksPerMonth: 5000,
      maxMembers: 5,
      features: { tasks: 5000, analytics: true },
    },
    {
      slug: 'enterprise',
      name: 'Enterprise',
      priceUsd: 49900,
      interval: 'month',
      maxTasksPerMonth: 999999,
      maxMembers: 50,
      features: { tasks: 999999, analytics: true },
    },
    {
      slug: 'flex',
      name: 'Flex',
      priceUsd: 0,
      interval: 'month',
      maxTasksPerMonth: 100,
      maxMembers: 1,
      features: { tasks: 100, analytics: false },
    },
  ];
  for (const p of plans) {
    await prisma.plan.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        priceUsd: p.priceUsd,
        interval: p.interval,
        maxTasksPerMonth: p.maxTasksPerMonth,
        maxMembers: p.maxMembers,
        features: p.features,
        isActive: true,
      },
    });
  }
  console.log('Seeded', plans.length, 'plans');
}
main().catch(console.error);
