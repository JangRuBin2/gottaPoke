import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // userId가 null인 포켓몬 찾기
  const pokemonsWithoutUser = await prisma.pokemon.findMany({
    where: {
      userId: null,
    },
  });

  console.log(`Found ${pokemonsWithoutUser.length} pokemons without userId`);

  if (pokemonsWithoutUser.length === 0) {
    console.log('No pokemons to migrate');
    return;
  }

  // 첫 번째 사용자 찾기 (보통 가입한 사용자)
  const firstUser = await prisma.user.findFirst({
    orderBy: {
      createdAt: 'asc',
    },
  });

  if (!firstUser) {
    console.log('No user found');
    return;
  }

  console.log(`Assigning pokemons to user: ${firstUser.email}`);

  // 모든 포켓몬을 첫 번째 사용자에게 할당
  const result = await prisma.pokemon.updateMany({
    where: {
      userId: null,
    },
    data: {
      userId: firstUser.id,
    },
  });

  console.log(`Updated ${result.count} pokemons`);
}

main()
  .then(() => {
    console.log('Migration completed successfully');
  })
  .catch((e) => {
    console.error('Migration failed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
