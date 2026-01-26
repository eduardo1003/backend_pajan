import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2] || 'admin@gadpajan.gob.ec';
  const password = process.argv[3] || 'admin123';
  const fullName = process.argv[4] || 'Administrador';

  try {
    // Check if admin already exists
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
            role: 'admin',
          },
        },
      },
      include: {
        profile: true,
      },
    });

    console.log('✅ Usuario administrador creado exitosamente!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Nombre:', fullName);
    console.log('🔐 Role: admin');
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión!');
  } catch (error: any) {
    console.error('❌ Error creando administrador:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

