import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle, Clock, MapPin, Calendar, Filter, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { incidentsApi } from '@/integrations/api/incidents';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusConfig = {
  'pending': { color: 'bg-yellow-500', text: 'Pendiente', icon: Clock },
  'in_progress': { color: 'bg-blue-500', text: 'En Proceso', icon: AlertCircle },
  'resolved': { color: 'bg-green-500', text: 'Resuelto', icon: CheckCircle }
};

const Reports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>('all');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadUserReports();
    }
  }, [user]);

  const loadUserReports = async () => {
    try {
      setLoading(true);
      
      // Load user's incidents
      const incidentsData = await incidentsApi.getAll();
      setReports(incidentsData || []);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(report => report.status === filter);

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-4 shadow-medium">
        <div className="w-full flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
            className="text-primary-foreground hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-responsive-lg font-bold">Mis Reportes</h1>
            <p className="text-sm opacity-90">Seguimiento de incidentes</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="w-full p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtrar por estado:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
          <Button 
            variant={filter === 'pending' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pendientes
          </Button>
          <Button 
            variant={filter === 'in_progress' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('in_progress')}
          >
            En Proceso
          </Button>
          <Button 
            variant={filter === 'resolved' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('resolved')}
          >
            Resueltos
          </Button>
        </div>
      </div>

      {/* Reports List */}
      <div className="w-full p-4 space-y-4">
        {loading ? (
          <Card className="text-center py-8">
            <CardContent>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando reportes...</p>
            </CardContent>
          </Card>
        ) : filteredReports.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {filter === 'all' ? 'No has realizado reportes aún' : 'No hay reportes en esta categoría'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report) => {
            const statusInfo = statusConfig[report.status as keyof typeof statusConfig];
            const StatusIcon = statusInfo.icon;
            return (
              <Card key={report.id} className="overflow-hidden animate-slide-up">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight mb-2">
                        {report.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {report.category}
                        </Badge>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full ${statusInfo.color} flex items-center justify-center`}>
                      <StatusIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <CardDescription className="text-sm">
                    {report.description}
                  </CardDescription>
                  
                  <div className="space-y-2 text-xs text-muted-foreground">
                    {report.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{report.address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(report.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-3 w-3" />
                      <span className={`font-medium ${
                        report.status === 'resolved' ? 'text-green-600' :
                        report.status === 'in_progress' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>
                        {statusInfo.text}
                      </span>
                    </div>
                    {report.departments && (
                      <div className="text-xs">
                        <strong>Asignado a:</strong> {report.departments.name}
                      </div>
                    )}
                    {report.assigned_staff && (
                      <div className="text-xs">
                        <strong>Personal:</strong> {report.assigned_staff.full_name}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalles del Reporte</DialogTitle>
                        </DialogHeader>
                        {selectedReport && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-lg">{selectedReport.title}</h4>
                              <Badge variant="outline" className="mt-1">{selectedReport.category}</Badge>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-1">Descripción:</h5>
                              <p className="text-muted-foreground">{selectedReport.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>Estado:</strong>
                                <div className="flex items-center gap-2 mt-1">
                                  <StatusIcon className="h-4 w-4" />
                                  {statusInfo.text}
                                </div>
                              </div>
                              <div>
                                <strong>Fecha:</strong>
                                <div className="mt-1">
                                  {format(new Date(selectedReport.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                                </div>
                              </div>
                            </div>

                            {selectedReport.address && (
                              <div>
                                <strong>Ubicación:</strong>
                                <div className="flex items-center gap-2 mt-1">
                                  <MapPin className="h-4 w-4" />
                                  {selectedReport.address}
                                </div>
                              </div>
                            )}

                            {selectedReport.evidence_urls && selectedReport.evidence_urls.length > 0 && (
                              <div>
                                <h5 className="font-medium mb-2">Evidencia Reportada:</h5>
                                <div className="grid grid-cols-2 gap-2">
                                  {selectedReport.evidence_urls.map((url: string, index: number) => (
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

                            {selectedReport.status === 'resolved' && selectedReport.resolution_description && (
                              <div className="border-t pt-4">
                                <h5 className="font-medium mb-2 text-green-600">Resolución:</h5>
                                <p className="text-muted-foreground mb-2">{selectedReport.resolution_description}</p>
                                {selectedReport.resolution_evidence_urls && selectedReport.resolution_evidence_urls.length > 0 && (
                                  <div>
                                    <h6 className="font-medium mb-2">Evidencia de Resolución:</h6>
                                    <div className="grid grid-cols-2 gap-2">
                                      {selectedReport.resolution_evidence_urls.map((url: string, index: number) => (
                                        <img
                                          key={index}
                                          src={url}
                                          alt={`Resolución ${index + 1}`}
                                          className="w-full h-32 object-cover rounded-lg"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Reports;