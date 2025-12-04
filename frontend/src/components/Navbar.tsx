import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  MapPin, 
  LogOut, 
  User, 
  Settings, 
  FileText,
  BarChart3,
  Users,
  Map,
  UserIcon,
  Menu
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: { [key: string]: string } = {
      citizen: 'Ciudadano',
      admin: 'Administrador',
      department_head: 'Jefe de Departamento',
      department_staff: 'Personal de Departamento'
    };
    return roleLabels[role] || role;
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">GAD Paján</span>
          </Link>

          {/* Mobile Menu Button */}
          {user && (
            <div className="flex lg:hidden items-center">
              <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center space-x-2 px-4 py-4 border-b">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <span className="font-bold text-xl">GAD Paján</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-1 p-4">
                      <Link to="/dashboard" onClick={() => setDrawerOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start mb-1">
                          <BarChart3 className="w-4 h-4 mr-2" /> Dashboard
                        </Button>
                      </Link>
                      <Link to="/new-report" onClick={() => setDrawerOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start mb-1">
                          <FileText className="w-4 h-4 mr-2" /> Nuevo Reporte
                        </Button>
                      </Link>
                      {profile?.role === 'admin' ? (
                        <Link to="/admin/all-reports" onClick={() => setDrawerOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start mb-1">
                            <FileText className="w-4 h-4 mr-2" /> Todos los Reportes
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/reports" onClick={() => setDrawerOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start mb-1">
                            <FileText className="w-4 h-4 mr-2" /> Mis Reportes
                          </Button>
                        </Link>
                      )}
                      <Link to="/map" onClick={() => setDrawerOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start mb-1">
                          <Map className="w-4 h-4 mr-2" /> Mapa de Incidentes
                        </Button>
                      </Link>
                      <Link to="/participation" onClick={() => setDrawerOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start mb-1">
                          <UserIcon className="w-4 h-4 mr-2" /> Participación Ciudadana
                        </Button>
                      </Link>
                      {profile?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setDrawerOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start mb-1">
                            <Users className="w-4 h-4 mr-2" /> Administración
                          </Button>
                        </Link>
                      )}
                      {(profile?.role === 'department_head' || profile?.role === 'department_staff') && (
                        <Link to="/department" onClick={() => setDrawerOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start mb-1">
                            <Users className="w-4 h-4 mr-2" /> Departamento
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}

          {/* Navigation Links Desktop */}
          {user && (
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              
              <Link to="/new-report">
                <Button variant="ghost" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Nuevo Reporte
                </Button>
              </Link>
              
              {profile?.role === 'admin' ? (
                <Link to="/admin/all-reports">
                  <Button variant="ghost" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Todos los Reportes
                  </Button>
                </Link>
              ) : (
                <Link to="/reports">
                  <Button variant="ghost" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Mis Reportes
                  </Button>
                </Link>
              )}

              <Link to="/map">
                <Button variant="ghost" size="sm">
                  <Map className="w-4 h-4 mr-2" />
                  Mapa de Incidentes
                </Button>
              </Link>

              <Link to="/participation">
                <Button variant="ghost" size="sm">
                  <UserIcon className="w-4 h-4 mr-2" />
                  Participación Ciudadana
                </Button>
              </Link>

              {profile?.role === 'admin' && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Administración
                  </Button>
                </Link>
              )}

              {(profile?.role === 'department_head' || profile?.role === 'department_staff') && (
                <Link to="/department">
                  <Button variant="ghost" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Departamento
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {profile?.full_name || 'Usuario'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile?.role && getRoleLabel(profile.role)}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="ghost">Iniciar Sesión</Button>
                </Link>
                <Link to="/auth">
                  <Button>Registrarse</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}