import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('\n📋 Usuarios en la base de datos:\n');
    console.log('Total:', users.length);
    console.log('─'.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.profile?.fullName || 'Sin nombre'}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🔐 Rol: ${user.profile?.role || 'N/A'}`);
      console.log(`   ✅ Email verificado: ${user.emailVerified ? 'Sí' : 'No'}`);
      console.log(`   📅 Creado: ${user.createdAt.toLocaleString()}`);
    });
    
    console.log('\n' + '─'.repeat(80));
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();

