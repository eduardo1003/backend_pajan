import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { incidentsApi } from '@/integrations/api/incidents';
import { apiClient } from '@/integrations/api/client';
import { 
  Eye, 
  Edit, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  Calendar,
  Upload,
  Building
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Assignment Form Component
const AssignmentForm = ({ incident, departments, staff, onAssign }: {
  incident: any;
  departments: any[];
  staff: any[];
  onAssign: (incidentId: string, departmentId: string, staffId?: string) => void;
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<string>('');

  const departmentStaff = staff.filter(s => s.department_id === selectedDepartment);

  const handleAssign = () => {
    if (selectedDepartment) {
      onAssign(incident.id, selectedDepartment, selectedStaff && selectedStaff !== 'unassigned' ? selectedStaff : undefined);
      setSelectedDepartment('');
      setSelectedStaff('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Departamento</label>
        <Select
          value={selectedDepartment}
          onValueChange={(value) => {
            setSelectedDepartment(value);
            setSelectedStaff(''); // Reset staff selection when department changes
          }}
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

      {selectedDepartment && departmentStaff.length > 0 && (
        <div>
          <label className="text-sm font-medium">Personal del Departamento (Opcional)</label>
          <Select
            value={selectedStaff}
            onValueChange={setSelectedStaff}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar personal específico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Sin asignar personal específico</SelectItem>
              {departmentStaff.map((person) => (
                <SelectItem key={person.id} value={person.id}>
                  {person.full_name} ({person.role === 'department_head' ? 'Jefe' : 'Personal'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button 
        onClick={handleAssign} 
        disabled={!selectedDepartment}
        className="w-full"
      >
        <UserCheck className="h-4 w-4 mr-2" />
        Asignar Incidente
      </Button>
    </div>
  );
};

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  in_progress: { label: 'En Proceso', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  resolved: { label: 'Resuelto', color: 'bg-green-100 text-green-800', icon: CheckCircle }
};

const IncidentManagement = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [resolutionData, setResolutionData] = useState({
    description: '',
    evidence: null as File | null
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Cargar incidentes
      const incidentsData = await incidentsApi.getAll();
      
      // Cargar departamentos activos
      const departmentsData = await apiClient.get('/departments');
      
      // Cargar personal de departamentos
      const profilesData = await apiClient.get('/profiles');
      const staffData = profilesData.filter((p: any) => 
        ['department_head', 'department_staff'].includes(p.role) && p.isActive
      );

      setIncidents(incidentsData || []);
      setDepartments(departmentsData || []);
      setStaff(staffData || []);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos: " + (error.message || 'Error desconocido'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignIncident = async (incidentId: string, departmentId: string, staffId?: string) => {
    try {
      const updates: any = {
        assignedDepartmentId: departmentId,
        status: 'in_progress'
      };

      if (staffId) {
        updates.assignedStaffId = staffId;
      }

      await incidentsApi.update(incidentId, updates);

      toast({
        title: "Éxito",
        description: "Incidente asignado correctamente",
      });

      loadData();
    } catch (error) {
      console.error('Error assigning incident:', error);
      toast({
        title: "Error",
        description: "No se pudo asignar el incidente",
        variant: "destructive",
      });
    }
  };

  const updateIncidentStatus = async (incidentId: string, status: string) => {
    try {
      await incidentsApi.update(incidentId, { status });

      toast({
        title: "Éxito",
        description: "Estado del incidente actualizado",
      });

      loadData();
    } catch (error) {
      console.error('Error updating incident status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const resolveIncident = async () => {
    if (!selectedIncident) return;

    try {
      let evidenceUrl = null;
      if (resolutionData.evidence) {
        const { url } = await apiClient.uploadFile(resolutionData.evidence);
        evidenceUrl = url;
      }

      await incidentsApi.update(selectedIncident.id, {
        status: 'resolved',
        resolutionDescription: resolutionData.description,
        resolutionEvidenceUrls: evidenceUrl ? [evidenceUrl] : undefined
      });

      toast({
        title: "Éxito",
        description: "Incidente resuelto correctamente",
      });

      setSelectedIncident(null);
      setResolutionData({ description: '', evidence: null });
      loadData();
    } catch (error) {
      console.error('Error resolving incident:', error);
      toast({
        title: "Error",
        description: "No se pudo resolver el incidente",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Cargando gestión de incidentes...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Incidentes</h1>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{incidents.length}</div>
            <p className="text-xs text-muted-foreground">Total Incidentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {incidents.filter(i => i.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {incidents.filter(i => i.status === 'in_progress').length}
            </div>
            <p className="text-xs text-muted-foreground">En Proceso</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {incidents.filter(i => i.status === 'resolved').length}
            </div>
            <p className="text-xs text-muted-foreground">Resueltos</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Incidentes */}
      <Card>
        <CardHeader>
          <CardTitle>Todos los Incidentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incidents.map((incident) => {
              const statusInfo = statusConfig[incident.status as keyof typeof statusConfig];
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={incident.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                        <Badge variant="outline">{incident.category}</Badge>
                      </div>
                      <h3 className="font-semibold text-lg">{incident.title}</h3>
                      <p className="text-muted-foreground mb-2">{incident.description}</p>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(incident.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                          </span>
                        </div>
                        {incident.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{incident.address}</span>
                          </div>
                        )}
                        <div>
                          <strong>Ciudadano:</strong> {incident.citizen?.full_name}
                          {incident.citizen?.phone && ` - ${incident.citizen.phone}`}
                        </div>
                        {incident.department && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span>Asignado a: {incident.department.name}</span>
                          </div>
                        )}
                        {incident.assigned_staff && (
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            <span>Personal: {incident.assigned_staff.full_name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalles del Incidente</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold">{incident.title}</h4>
                              <p className="text-muted-foreground">{incident.description}</p>
                            </div>
                            {incident.evidence_urls && incident.evidence_urls.length > 0 && (
                              <div>
                                <h5 className="font-medium mb-2">Evidencia:</h5>
                                <div className="grid grid-cols-2 gap-2">
                                  {incident.evidence_urls.map((url: string, index: number) => (
                                    <img
                                      key={index}
                                      src={url}
                                      alt={`Evidencia ${index + 1}`}
                                      className="w-full h-32 object-cover rounded-lg"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {incident.status === 'pending' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <UserCheck className="h-4 w-4 mr-1" />
                              Asignar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Asignar Incidente</DialogTitle>
                              <DialogDescription>
                                Seleccione el departamento y personal responsable
                              </DialogDescription>
                            </DialogHeader>
                            <AssignmentForm 
                              incident={incident}
                              departments={departments}
                              staff={staff}
                              onAssign={assignIncident}
                            />
                          </DialogContent>
                        </Dialog>
                      )}

                      {incident.status === 'in_progress' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => setSelectedIncident(incident)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Resolver
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Resolver Incidente</DialogTitle>
                              <DialogDescription>
                                Marque el incidente como resuelto y agregue evidencia
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Descripción de la resolución</label>
                                <Textarea
                                  value={resolutionData.description}
                                  onChange={(e) => setResolutionData({ ...resolutionData, description: e.target.value })}
                                  placeholder="Describe cómo fue resuelto el problema..."
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Evidencia de resolución</label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setResolutionData({ ...resolutionData, evidence: file });
                                    }
                                  }}
                                />
                              </div>
                              <Button onClick={resolveIncident} className="w-full">
                                <Upload className="h-4 w-4 mr-2" />
                                Marcar como Resuelto
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      <Select
                        value={incident.status}
                        onValueChange={(status) => updateIncidentStatus(incident.id, status)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="in_progress">En Proceso</SelectItem>
                          <SelectItem value="resolved">Resuelto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncidentManagement;