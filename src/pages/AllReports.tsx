import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { incidentsApi } from '@/integrations/api/incidents';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Search, Filter, Eye, Calendar, MapPin, FileText, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  address: string;
  evidence_urls: string[] | null;
  resolution_description: string | null;
  resolution_evidence_urls: string[] | null;
  created_at: string;
  resolved_at: string | null;
  profiles: {
    full_name: string;
  } | null;
}

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-500', icon: '⏳' },
  in_progress: { label: 'En Proceso', color: 'bg-blue-500', icon: '🔄' },
  resolved: { label: 'Resuelto', color: 'bg-green-500', icon: '✅' },
  rejected: { label: 'Rechazado', color: 'bg-red-500', icon: '❌' }
};

const AllReports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const loadReports = async () => {
    try {
      const data = await incidentsApi.getAll();
      setReports((data as any) || []);
      setFilteredReports((data as any) || []);
    } catch (error: any) {
      console.error('Error loading reports:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los reportes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(report => report.category === categoryFilter);
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, statusFilter, categoryFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      vialidad: 'Vialidad',
      salud: 'Salud',
      ambiente: 'Ambiente',
      seguridad: 'Seguridad',
      alumbrado: 'Alumbrado',
      agua_alcantarillado: 'Agua y Alcantarillado',
      transporte: 'Transporte',
      maltrato_animal: 'Maltrato Animal',
      basura: 'Basura',
      otros: 'Otros'
    };
    return categories[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/admin')}
              className="text-primary-foreground hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Todos los Reportes</h1>
              <p className="text-sm opacity-90">Gestión completa de incidentes</p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center py-8">Cargando reportes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 shadow-lg">
        <div className="w-full flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/admin')}
            className="text-primary-foreground hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-responsive-xl font-bold">Todos los Reportes</h1>
            <p className="text-sm opacity-90">Gestión completa de incidentes</p>
          </div>
        </div>
      </div>

      <div className="w-full p-responsive">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="in_progress">En Proceso</SelectItem>
                  <SelectItem value="resolved">Resuelto</SelectItem>
                  <SelectItem value="rejected">Rechazado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="vialidad">Vialidad</SelectItem>
                  <SelectItem value="salud">Salud</SelectItem>
                  <SelectItem value="ambiente">Ambiente</SelectItem>
                  <SelectItem value="seguridad">Seguridad</SelectItem>
                  <SelectItem value="alumbrado">Alumbrado</SelectItem>
                  <SelectItem value="agua_alcantarillado">Agua y Alcantarillado</SelectItem>
                  <SelectItem value="transporte">Transporte</SelectItem>
                  <SelectItem value="maltrato_animal">Maltrato Animal</SelectItem>
                  <SelectItem value="basura">Basura</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid-responsive-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{reports.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center text-white">⏳</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold">{reports.filter(r => r.status === 'pending').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white">🔄</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">En Proceso</p>
                  <p className="text-2xl font-bold">{reports.filter(r => r.status === 'in_progress').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white">✅</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Resueltos</p>
                  <p className="text-2xl font-bold">{reports.filter(r => r.status === 'resolved').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay reportes</h3>
                <p className="text-muted-foreground">
                  No se encontraron reportes con los filtros aplicados.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
                          <p className="text-muted-foreground mb-3 line-clamp-2">{report.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline">
                              {getCategoryName(report.category)}
                            </Badge>
                            <Badge 
                              className={`${statusConfig[report.status as keyof typeof statusConfig]?.color} text-white`}
                            >
                              {statusConfig[report.status as keyof typeof statusConfig]?.icon} {statusConfig[report.status as keyof typeof statusConfig]?.label}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{report.profiles?.full_name || 'Usuario'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(report.created_at)}</span>
                            </div>
                            {report.address && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{report.address}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{selectedReport?.title}</DialogTitle>
                        </DialogHeader>
                        {selectedReport && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Descripción</h4>
                              <p className="text-muted-foreground">{selectedReport.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Categoría</h4>
                                <Badge variant="outline">
                                  {getCategoryName(selectedReport.category)}
                                </Badge>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Estado</h4>
                                <Badge className={`${statusConfig[selectedReport.status as keyof typeof statusConfig]?.color} text-white`}>
                                  {statusConfig[selectedReport.status as keyof typeof statusConfig]?.icon} {statusConfig[selectedReport.status as keyof typeof statusConfig]?.label}
                                </Badge>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Reportado por</h4>
                              <p className="text-muted-foreground">{selectedReport.profiles?.full_name || 'Usuario'}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Fecha de creación</h4>
                              <p className="text-muted-foreground">{formatDate(selectedReport.created_at)}</p>
                            </div>

                            {selectedReport.address && (
                              <div>
                                <h4 className="font-semibold mb-2">Dirección</h4>
                                <p className="text-muted-foreground">{selectedReport.address}</p>
                              </div>
                            )}

                            {selectedReport.evidence_urls && selectedReport.evidence_urls.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2">Evidencia</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {selectedReport.evidence_urls.map((url, index) => (
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

                            {selectedReport.resolution_description && (
                              <div>
                                <h4 className="font-semibold mb-2">Resolución</h4>
                                <p className="text-muted-foreground">{selectedReport.resolution_description}</p>
                                {selectedReport.resolved_at && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Resuelto el {formatDate(selectedReport.resolved_at)}
                                  </p>
                                )}
                              </div>
                            )}

                            {selectedReport.resolution_evidence_urls && selectedReport.resolution_evidence_urls.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2">Evidencia de Resolución</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {selectedReport.resolution_evidence_urls.map((url, index) => (
                                    <img
                                      key={index}
                                      src={url}
                                      alt={`Resolución ${index + 1}`}
                                      className="w-full h-32 object-cover rounded border"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AllReports;