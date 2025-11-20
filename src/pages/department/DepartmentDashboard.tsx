import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  Camera
} from 'lucide-react';
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

export default function DepartmentDashboard() {
  const { profile } = useAuth();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [departmentStats, setDepartmentStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [resolution, setResolution] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (profile?.department_id) {
      loadDepartmentData();
    }
  }, [profile]);

  const loadDepartmentData = async () => {
    try {
      console.log('Loading department data for:', profile?.department_id);
      
      const { data: incidentsData, error } = await supabase
        .from('incidents')
        .select(`
          *,
          citizen:profiles!incidents_citizen_id_fkey(id, full_name, phone),
          assigned_staff:profiles!incidents_assigned_staff_id_fkey(id, full_name)
        `)
        .eq('assigned_department_id', profile.department_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading incidents:', error);
        throw error;
      }

      console.log('Loaded incidents for department:', incidentsData?.length);

      if (incidentsData) {
        setIncidents(incidentsData);
        
        const stats = {
          total: incidentsData.length,
          pending: incidentsData.filter(i => i.status === 'pending').length,
          inProgress: incidentsData.filter(i => i.status === 'in_progress').length,
          resolved: incidentsData.filter(i => i.status === 'resolved').length,
        };
        setDepartmentStats(stats);
      }
    } catch (error) {
      console.error('Error loading department data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del departamento: " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateIncidentStatus = async (incidentId: string, status: string, assignedStaffId?: string) => {
    try {
      const updateData: any = { status };
      
      if (assignedStaffId) {
        updateData.assigned_staff_id = assignedStaffId;
      }
      
      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
        updateData.resolution_description = resolution;
      }

      const { error } = await supabase
        .from('incidents')
        .update(updateData)
        .eq('id', incidentId);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Incidente actualizado correctamente",
      });
      
      loadDepartmentData();
      setSelectedIncident(null);
      setResolution('');
    } catch (error) {
      console.error('Error updating incident:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el incidente",
        variant: "destructive",
      });
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
        <div className="text-center">Cargando datos del departamento...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Panel de Departamento</h1>
          <p className="text-muted-foreground">
            Gestión de incidentes asignados
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Asignados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentStats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentStats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resueltos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentStats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Incidents List */}
      <Card>
        <CardHeader>
          <CardTitle>Incidentes Asignados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incidents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay incidentes asignados
              </p>
            ) : (
              incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{incident.title}</h4>
                      {getStatusBadge(incident.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{incident.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {getCategoryLabel(incident.category)}
                      </span>
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {incident.citizen?.full_name}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(incident.created_at).toLocaleDateString()}
                      </span>
                      {incident.assigned_staff && (
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          Asignado a: {incident.assigned_staff.full_name}
                        </span>
                      )}
                    </div>
                    {incident.address && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        {incident.address}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedIncident(incident)}
                        >
                          Gestionar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Gestionar Incidente</DialogTitle>
                          <DialogDescription>
                            Actualizar estado y asignar personal
                          </DialogDescription>
                        </DialogHeader>
                        {selectedIncident && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium">{selectedIncident.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {selectedIncident.description}
                              </p>
                            </div>
                            
                            {selectedIncident.evidence_urls && selectedIncident.evidence_urls.length > 0 && (
                              <div>
                                <h5 className="font-medium mb-2">Evidencia</h5>
                                <div className="grid grid-cols-2 gap-2">
                                  {selectedIncident.evidence_urls.map((url: string, index: number) => (
                                    <img
                                      key={index}
                                      src={url}
                                      alt={`Evidencia ${index + 1}`}
                                      className="w-full h-32 object-cover rounded border"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Cambiar Estado</label>
                                <Select
                                  defaultValue={selectedIncident.status}
                                  onValueChange={(value) => updateIncidentStatus(selectedIncident.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pendiente</SelectItem>
                                    <SelectItem value="in_progress">En Proceso</SelectItem>
                                    <SelectItem value="resolved">Resuelto</SelectItem>
                                    <SelectItem value="rejected">Rechazado</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Asignar a Personal</label>
                                <Select
                                  defaultValue={selectedIncident.assigned_staff_id || 'unassigned'}
                                  onValueChange={(value) => updateIncidentStatus(selectedIncident.id, selectedIncident.status, value === 'unassigned' ? undefined : value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar personal" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="unassigned">Sin asignar</SelectItem>
                                    <SelectItem value={profile.id}>
                                      {profile.full_name} (Yo)
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Descripción de la Resolución</label>
                              <Textarea
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value)}
                                placeholder="Describe la solución aplicada..."
                                className="mt-1"
                              />
                            </div>
                            
                            <Button
                              onClick={() => updateIncidentStatus(selectedIncident.id, 'resolved')}
                              className="w-full"
                            >
                              Marcar como Resuelto
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}