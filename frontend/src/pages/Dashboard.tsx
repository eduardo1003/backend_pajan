import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/integrations/api/client';
import { incidentsApi } from '@/integrations/api/incidents';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  MapPin,
  TrendingUp,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalIncidents: number;
  pendingIncidents: number;
  inProgressIncidents: number;
  resolvedIncidents: number;
  myIncidents?: number;
}

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalIncidents: 0,
    pendingIncidents: 0,
    inProgressIncidents: 0,
    resolvedIncidents: 0,
  });
  const [recentIncidents, setRecentIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [profile]);

  const loadDashboardData = async () => {
    try {
      // Load stats
      const stats = await apiClient.get('/stats/user');
      setStats({
        totalIncidents: stats.totalIncidents,
        pendingIncidents: stats.incidentsByStatus?.pending || 0,
        inProgressIncidents: stats.incidentsByStatus?.['in_progress'] || 0,
        resolvedIncidents: stats.incidentsByStatus?.resolved || 0,
        myIncidents: profile?.role === 'citizen' ? stats.totalIncidents : undefined,
      });

      // Load recent incidents
      const recent = await incidentsApi.getAll({ limit: 5 });
      setRecentIncidents(recent || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', variant: 'secondary' as const },
      in_progress: { label: 'En Proceso', variant: 'default' as const },
      resolved: { label: 'Resuelto', variant: 'outline' as const },
      rejected: { label: 'Rechazado', variant: 'destructive' as const },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config?.variant}>{config?.label}</Badge>;
  };

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      vialidad: 'Vialidad',
      salud: 'Salud',
      ambiente: 'Ambiente',
      seguridad: 'Seguridad',
      alumbrado: 'Alumbrado',
      agua_alcantarillado: 'Agua y Alcantarillado',
      transporte: 'Transporte',
      maltrato_animal: 'Maltrato Animal',
      basura: 'Gestión de Basura',
      otros: 'Otros'
    };
    return categories[category] || category;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-pajan-blue to-blue-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-blue-100 text-sm sm:text-base">
                Bienvenido, {profile?.full_name}
              </p>
            </div>
            {profile?.role === 'citizen' && (
              <Link to="/new-report">
                <Button className="bg-white text-pajan-blue hover:bg-blue-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Reporte
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {profile?.role === 'citizen' ? 'Mis Reportes' : 'Total de Incidentes'}
              </CardTitle>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-pajan-blue" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pajan-blue mb-1">{stats.totalIncidents}</div>
              <p className="text-xs text-gray-500">
                Total de reportes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pendientes</CardTitle>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.pendingIncidents}</div>
              <p className="text-xs text-gray-500">
                Sin asignar
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">En Proceso</CardTitle>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 mb-1">{stats.inProgressIncidents}</div>
              <p className="text-xs text-gray-500">
                En trabajo
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Resueltos</CardTitle>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-pajan-green" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pajan-green mb-1">{stats.resolvedIncidents}</div>
              <p className="text-xs text-gray-500">
                Completados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Incidents */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
            <CardTitle className="text-lg font-semibold text-gray-800">Reportes Recientes</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentIncidents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No hay reportes recientes</p>
                  <p className="text-gray-400 text-sm">Los reportes aparecerán aquí una vez que sean creados</p>
                </div>
              ) : (
                recentIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all duration-300 border border-gray-100 hover:border-blue-200"
                  >
                    <div className="flex-1 space-y-2 mb-3 sm:mb-0">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{incident.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{getCategoryLabel(incident.category)}</span>
                        {incident.departments && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{incident.departments.name}</span>
                        )}
                        {profile?.role !== 'citizen' && incident.profiles && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">{incident.profiles.full_name}</span>
                        )}
                        <span className="text-gray-500">{new Date(incident.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(incident.status)}
                      <Link to={`/reports/${incident.id}`}>
                        <Button variant="ghost" size="sm" className="text-pajan-blue hover:text-blue-700">
                          Ver
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0">
            <Link to="/reports" className="block">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-pajan-blue" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-800">Ver Todos los Reportes</h3>
                <p className="text-sm text-gray-600">
                  Administra y revisa todos los reportes
                </p>
              </CardContent>
            </Link>
          </Card>

          {profile?.role === 'citizen' && (
            <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0">
              <Link to="/new-report" className="block">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-pajan-green" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-800">Crear Nuevo Reporte</h3>
                  <p className="text-sm text-gray-600">
                    Reporta un nuevo incidente en tu comunidad
                  </p>
                </CardContent>
              </Link>
            </Card>
          )}

          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0">
            <Link to="/map" className="block">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-800">Ver Mapa</h3>
                <p className="text-sm text-gray-600">
                  Visualiza los reportes en el mapa de la ciudad
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0">
            <Link to="/participation" className="block">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-800">Participación Ciudadana</h3>
                <p className="text-sm text-gray-600">
                  Únete a iniciativas comunitarias y eventos municipales
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}