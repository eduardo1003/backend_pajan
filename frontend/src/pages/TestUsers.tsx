
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, UserPlus, CheckCircle } from 'lucide-react';

const testUsers = [
  {
    email: 'admin@gmail.com',
    password: '123456',
    full_name: 'Carlos Administrador',
    role: 'admin',
    department_id: null
  },
  {
    email: 'jefe.vialidad@gmail.com', 
    password: '123456',
    full_name: 'María Vialidad',
    role: 'department_head',
    department_id: '550e8400-e29b-41d4-a716-446655440001'
  },
  {
    email: 'jefe.salud@gmail.com',
    password: '123456', 
    full_name: 'José Salud',
    role: 'department_head',
    department_id: '550e8400-e29b-41d4-a716-446655440002'
  },
  {
    email: 'staff.ambiente@gmail.com',
    password: '123456',
    full_name: 'Luis Personal Ambiente', 
    role: 'department_staff',
    department_id: '550e8400-e29b-41d4-a716-446655440003'
  },
  {
    email: 'ciudadano@gmail.com',
    password: '123456',
    full_name: 'Pedro Ciudadano',
    role: 'citizen', 
    department_id: null
  },
  {
    email: 'ciudadana@gmail.com',
    password: '123456',
    full_name: 'Laura Ciudadana',
    role: 'citizen',
    department_id: null
  }
];

const TestUsers = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [createdUsers, setCreatedUsers] = useState<string[]>([]);

  const createAllUsers = async () => {
    setLoading(true);
    const successful: string[] = [];
    const failed: string[] = [];

    for (const userData of testUsers) {
      try {
        console.log(`Creando usuario: ${userData.email}`);
        
        // Usar la función admin_create_user para crear usuarios sin verificación de email
        const { data: result, error } = await supabase.rpc('admin_create_user', {
          user_email: userData.email,
          user_password: userData.password,
          user_full_name: userData.full_name,
          user_role: userData.role as any,
          user_department_id: userData.department_id
        });

        if (error) {
          console.error(`Error creating user ${userData.email}:`, error);
          if (error.message.includes('already registered') || 
              error.message.includes('User already registered') ||
              error.message.includes('duplicate key value')) {
            console.log(`Usuario ${userData.email} ya existe`);
            successful.push(userData.email);
          } else {
            failed.push(userData.email);
          }
        } else if (result && typeof result === 'object' && 'success' in result && result.success) {
          console.log(`Usuario creado: ${userData.email}`);
          successful.push(userData.email);
        } else {
          const errorMsg = result && typeof result === 'object' && 'error' in result ? String(result.error) : 'Unknown error';
          console.error(`Error creating user ${userData.email}:`, errorMsg);
          failed.push(userData.email);
        }
        
        // Pausa más larga para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error: any) {
        console.error(`Error creating user ${userData.email}:`, error);
        failed.push(userData.email);
      }
    }

    setCreatedUsers(successful);
    setLoading(false);

    if (successful.length > 0) {
      toast({
        title: "¡Usuarios creados exitosamente!",
        description: `Se crearon ${successful.length} usuarios de prueba. Ya puedes hacer login con ellos.`,
      });
    }

    if (failed.length > 0) {
      toast({
        title: "Algunos usuarios fallaron", 
        description: `${failed.length} usuarios no pudieron ser creados. Revisa la consola para más detalles.`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              Crear Usuarios de Prueba
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Esta página crea usuarios de prueba para todas las funcionalidades del sistema. 
                Los emails han sido cambiados para evitar problemas de validación.
              </p>
              
              <div className="grid gap-4">
                <h3 className="font-semibold">Usuarios que se crearán:</h3>
                {testUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.full_name}</span>
                        {createdUsers.includes(user.email) && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email} • {user.role}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Contraseña: {user.password}
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={createAllUsers}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Creando usuarios...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" />
                    Crear Todos los Usuarios
                  </>
                )}
              </Button>

              {createdUsers.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">
                    ✅ Usuarios creados exitosamente ({createdUsers.length}/6)
                  </h4>
                  <p className="text-sm text-green-700">
                    Ahora puedes usar estos usuarios para hacer login en la aplicación:
                  </p>
                  <ul className="text-sm text-green-700 mt-2">
                    <li>• Admin: admin@gmail.com / 123456</li>
                    <li>• Jefe Vialidad: jefe.vialidad@gmail.com / 123456</li>
                    <li>• Jefe Salud: jefe.salud@gmail.com / 123456</li>
                    <li>• Staff Ambiente: staff.ambiente@gmail.com / 123456</li>
                    <li>• Ciudadano 1: ciudadano@gmail.com / 123456</li>
                    <li>• Ciudadano 2: ciudadana@gmail.com / 123456</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestUsers;
