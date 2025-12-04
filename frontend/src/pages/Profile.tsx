import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Settings, Phone, Mail, Shield, Building } from 'lucide-react';

const Profile = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });
  const [department, setDepartment] = useState<any>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
      });
      
      // Fetch department info if user belongs to one
      if (profile.department_id) {
        fetchDepartment(profile.department_id);
      }
    }
  }, [profile]);

  const fetchDepartment = async (departmentId: string) => {
    const { data } = await supabase
      .from('departments')
      .select('*')
      .eq('id', departmentId)
      .single();
    
    setDepartment(data);
  };

  const handleSave = async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado correctamente",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      admin: 'Administrador',
      department_head: 'Jefe de Departamento',
      department_staff: 'Personal de Departamento',
      citizen: 'Ciudadano'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!user || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p>Cargando perfil...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-lg">
              {getInitials(profile.full_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{profile.full_name}</h1>
            <Badge variant="outline" className="mt-2">
              {getRoleLabel(profile.role)}
            </Badge>
          </div>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Gestiona tu información de perfil
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  size="sm"
                >
                  Guardar
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      full_name: profile.full_name || '',
                      phone: profile.phone || '',
                    });
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="full_name">Nombre Completo</Label>
                {isEditing ? (
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{profile.full_name}</p>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Teléfono
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ingresa tu número de teléfono"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile.phone || 'No especificado'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role & Department Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Información del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rol en el Sistema</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {getRoleLabel(profile.role)}
              </p>
            </div>

            {department && (
              <>
                <Separator />
                <div>
                  <Label className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Departamento
                  </Label>
                  <div className="mt-2">
                    <p className="font-medium">{department.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {department.description}
                    </p>
                  </div>
                </div>
              </>
            )}

            <Separator />
            <div className="text-xs text-muted-foreground">
              <p>Usuario registrado: {new Date(profile.created_at).toLocaleDateString()}</p>
              <p>Estado: {profile.is_active ? 'Activo' : 'Inactivo'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;