import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUser() {
  const email = process.argv[2];
  const password = process.argv[3];
  const fullName = process.argv[4];
  const role = (process.argv[5] || 'citizen') as UserRole;

  if (!email || !password || !fullName) {
    console.log('❌ Uso: npm run create-user -- <email> <password> "<nombre>" [role]');
    console.log('   Roles disponibles: citizen, admin, department_head, department_staff');
    process.exit(1);
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('❌ Usuario ya existe con ese email:', email);
      process.exit(1);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        emailVerified: true,
        profile: {
          create: {
            fullName,
            role,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    console.log('✅ Usuario creado exitosamente!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Nombre:', fullName);
    console.log('🔐 Role:', role);
  } catch (error: any) {
    console.error('❌ Error creando usuario:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();

