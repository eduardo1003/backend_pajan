import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Building, 
  Settings, 
  Plus,
  Edit,
  UserPlus,
  Shield,
  FileText,
  Tag,
  BarChart3,
  Building2,
  Calendar
} from 'lucide-react';
import IncidentManagement from './IncidentManagement';
import CategoryManagement from './CategoryManagement';
import AdminStatistics from '@/components/AdminStatistics';
import BarrioPresidentsManagement from '@/components/BarrioPresidentsManagement';
import EventsManagement from '@/components/EventsManagement';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createAdminUser } from '@/integrations/adminApi';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({ 
    email: '', 
    password: '', 
    fullName: '', 
    role: 'citizen' as const,
    departmentId: '' 
  });
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '' });
  const { toast } = useToast();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // Load users
      const { data: usersData } = await supabase
        .from('profiles')
        .select(`
          *,
          departments(name)
        `)
        .order('created_at', { ascending: false });

      // Load departments
      const { data: departmentsData } = await supabase
        .from('departments')
        .select(`
          *,
          profiles!fk_profiles_department(id, full_name)
        `)
        .order('name');

      // Load incidents
      const { data: incidentsData } = await supabase
        .from('incidents')
        .select('id, title, description, category, status, address, created_at')
        .order('created_at', { ascending: false });

      setUsers(usersData || []);
      setDepartments(departmentsData || []);
      setIncidents(incidentsData || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: 'citizen' | 'admin' | 'department_head' | 'department_staff', departmentId?: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role,
          department_id: departmentId || null
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Usuario actualizado correctamente",
      });
      
      loadAdminData();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive",
      });
    }
  };

  // Cambiar createUser para usar signUp y flujo de confirmación
  const createUser = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            full_name: newUser.fullName,
            role: newUser.role,
            department_id: newUser.departmentId || null
          }
        }
      });
      if (error) throw new Error(error.message);
      toast({
        title: "Usuario creado",
        description: `Se ha enviado un correo de confirmación a ${newUser.email}. El usuario debe confirmar su email para poder acceder.`,
      });
      setNewUser({ 
        email: '', 
        password: '', 
        fullName: '', 
        role: 'citizen',
        departmentId: '' 
      });
      loadAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el usuario",
        variant: "destructive",
      });
    }
  };

  const createDepartment = async () => {
    try {
      const { error } = await supabase
        .from('departments')
        .insert([newDepartment]);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Departamento creado correctamente",
      });
      
      setNewDepartment({ name: '', description: '' });
      loadAdminData();
    } catch (error) {
      console.error('Error creating department:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el departamento",
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      citizen: { label: 'Ciudadano', variant: 'secondary' as const },
      admin: { label: 'Administrador', variant: 'destructive' as const },
      department_head: { label: 'Jefe', variant: 'default' as const },
      department_staff: { label: 'Personal', variant: 'outline' as const },
    };
    const config = roleConfig[role as keyof typeof roleConfig];
    return <Badge variant={config?.variant}>{config?.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Cargando panel de administración...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-pajan-blue to-blue-500 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-blue-100 text-sm sm:text-base">
            Gestiona usuarios, departamentos, incidentes y eventos del GAD Paján
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Usuarios</CardTitle>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-pajan-blue" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pajan-blue mb-1">{users.length}</div>
              <p className="text-xs text-gray-500">Usuarios registrados</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Administradores</CardTitle>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-1">
                {users.filter(u => u.role === 'admin').length}
              </div>
              <p className="text-xs text-gray-500">Administradores</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Departamentos</CardTitle>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Building className="h-5 w-5 text-pajan-green" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pajan-green mb-1">{departments.length}</div>
              <p className="text-xs text-gray-500">Departamentos</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Personal GAD</CardTitle>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {users.filter(u => ['department_head', 'department_staff'].includes(u.role)).length}
              </div>
              <p className="text-xs text-gray-500">Personal municipal</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Incidentes</CardTitle>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 mb-1">{incidents.length}</div>
              <p className="text-xs text-gray-500">Reportes totales</p>
            </CardContent>
          </Card>
      </div>

        {/* Tabs for different admin sections */}
        <Tabs defaultValue="users" className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg border-0 p-2">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 bg-gray-100 rounded-lg p-1">
              <TabsTrigger 
                value="users" 
                className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-pajan-blue rounded-md"
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Usuarios</span>
                <span className="sm:hidden">Usr</span>
              </TabsTrigger>
              <TabsTrigger 
                value="departments" 
                className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-pajan-blue rounded-md"
              >
                <Building className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Departamentos</span>
                <span className="sm:hidden">Dept</span>
              </TabsTrigger>
              <TabsTrigger 
                value="incidents" 
                className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-pajan-blue rounded-md"
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Incidentes</span>
                <span className="sm:hidden">Inc</span>
              </TabsTrigger>
              <TabsTrigger 
                value="categories" 
                className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-pajan-blue rounded-md"
              >
                <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Categorías</span>
                <span className="sm:hidden">Cat</span>
              </TabsTrigger>
              <TabsTrigger 
                value="presidents" 
                className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-pajan-blue rounded-md"
              >
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Presidentes</span>
                <span className="sm:hidden">Pres</span>
              </TabsTrigger>
              <TabsTrigger 
                value="events" 
                className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-pajan-blue rounded-md"
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Eventos</span>
                <span className="sm:hidden">Evt</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="stats" className="space-y-4">
            <AdminStatistics />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border-0 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
                  <p className="text-gray-600 text-sm sm:text-base">Administra los usuarios del sistema</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-pajan-blue to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Usuario
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                      <DialogDescription>
                        Crea un nuevo usuario en el sistema
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          className="mt-1"
                          placeholder="usuario@ejemplo.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          className="mt-1"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Nombre Completo</Label>
                        <Input
                          id="fullName"
                          value={newUser.fullName}
                          onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                          className="mt-1"
                          placeholder="Nombre completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="role" className="text-sm font-medium text-gray-700">Rol</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Seleccionar rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="citizen">Ciudadano</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="department_head">Jefe de Departamento</SelectItem>
                            <SelectItem value="department_staff">Personal de Departamento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {(newUser.role !== 'citizen' && newUser.role !== 'admin') && (
                        <div>
                          <Label htmlFor="department" className="text-sm font-medium text-gray-700">Departamento</Label>
                          <Select
                            value={newUser.departmentId}
                            onValueChange={(value) => setNewUser({ ...newUser, departmentId: value })}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Seleccionar departamento" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <Button 
                        onClick={createUser} 
                        className="w-full bg-gradient-to-r from-pajan-green to-green-500 hover:from-green-600 hover:to-green-600 text-white"
                      >
                        Crear Usuario
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all duration-300 border border-gray-100 hover:border-blue-200"
                  >
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{user.full_name}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">{user.phone}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge 
                            variant={user.is_active ? 'default' : 'destructive'}
                            className={`text-xs ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {user.is_active ? 'Activo' : 'Pendiente'}
                          </Badge>
                          {user.departments && (
                            <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                              {user.departments.name}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {getRoleBadge(user.role)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedUser(user)}
                            className="text-pajan-blue hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Usuario</DialogTitle>
                          <DialogDescription>
                            Cambiar rol y departamento del usuario
                          </DialogDescription>
                        </DialogHeader>
                        {selectedUser && (
                          <div className="space-y-4">
                            <div>
                              <Label>Nombre: {selectedUser.full_name}</Label>
                            </div>
                            <div>
                              <Label htmlFor="role">Rol</Label>
                              <Select
                                defaultValue={selectedUser.role}
                                onValueChange={(value: 'citizen' | 'admin' | 'department_head' | 'department_staff') => {
                                  const departmentId = value === 'citizen' ? null : selectedUser.department_id;
                                  updateUserRole(selectedUser.id, value, departmentId);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar rol" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="citizen">Ciudadano</SelectItem>
                                  <SelectItem value="admin">Administrador</SelectItem>
                                  <SelectItem value="department_head">Jefe de Departamento</SelectItem>
                                  <SelectItem value="department_staff">Personal de Departamento</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {selectedUser.role !== 'citizen' && selectedUser.role !== 'admin' && (
                              <div>
                                <Label htmlFor="department">Departamento</Label>
                                <Select
                                  defaultValue={selectedUser.department_id || ''}
                                  onValueChange={(value) => updateUserRole(selectedUser.id, selectedUser.role, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar departamento" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {departments.map((dept) => (
                                      <SelectItem key={dept.id} value={dept.id}>
                                        {dept.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg border-0 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Gestión de Departamentos</h2>
                <p className="text-gray-600 text-sm sm:text-base">Administra los departamentos municipales</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-pajan-green to-green-500 hover:from-green-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Departamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Departamento</DialogTitle>
                    <DialogDescription>
                      Crea un nuevo departamento municipal
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre del Departamento</Label>
                      <Input
                        id="name"
                        value={newDepartment.name}
                        onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                        className="mt-1"
                        placeholder="Ej: Obras Públicas"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">Descripción</Label>
                      <Input
                        id="description"
                        value={newDepartment.description}
                        onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                        className="mt-1"
                        placeholder="Descripción del departamento"
                      />
                    </div>
                    <Button 
                      onClick={createDepartment} 
                      className="w-full bg-gradient-to-r from-pajan-blue to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white"
                    >
                      Crear Departamento
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <Card key={dept.id} className="bg-white shadow-md border-0 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-800">{dept.name}</CardTitle>
                    <CardDescription className="text-gray-600">{dept.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{dept.profiles?.length || 0} miembros</p>
                        <p className="text-xs text-gray-500">Personal asignado</p>
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Building className="h-4 w-4 text-pajan-green" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="incidents">
          <IncidentManagement />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement />
        </TabsContent>

        <TabsContent value="presidents">
          <BarrioPresidentsManagement />
        </TabsContent>

        <TabsContent value="events">
          <EventsManagement />
        </TabsContent>
      </Tabs>

      {/* Recent Reports Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Reportes Recientes</CardTitle>
          <CardDescription>
            Los últimos reportes ingresados al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incidents.slice(0, 5).map((incident: any) => (
              <div key={incident.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{incident.title || 'Sin título'}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{incident.category}</Badge>
                    <span>•</span>
                    <span>{new Date(incident.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{incident.title || 'Reporte sin título'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Descripción</h4>
                        <p className="text-muted-foreground">{incident.description || 'Sin descripción'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Categoría</h4>
                          <Badge variant="outline">
                            {incident.category}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Estado</h4>
                          <Badge 
                            className={
                              incident.status === 'pending' ? 'bg-yellow-500 text-white' :
                              incident.status === 'in_progress' ? 'bg-blue-500 text-white' :
                              incident.status === 'resolved' ? 'bg-green-500 text-white' :
                              'bg-red-500 text-white'
                            }
                          >
                            {incident.status === 'pending' ? 'Pendiente' :
                             incident.status === 'in_progress' ? 'En Proceso' :
                             incident.status === 'resolved' ? 'Resuelto' : 'Rechazado'}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Fecha</h4>
                        <p className="text-muted-foreground">{new Date(incident.created_at).toLocaleDateString()}</p>
                      </div>
                      {incident.address && (
                        <div>
                          <h4 className="font-semibold mb-2">Dirección</h4>
                          <p className="text-muted-foreground">{incident.address}</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
            {incidents.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No hay reportes disponibles
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}