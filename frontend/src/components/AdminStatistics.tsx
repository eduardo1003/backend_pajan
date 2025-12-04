import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/integrations/api/client';
import { incidentsApi } from '@/integrations/api/incidents';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Download, 
  FileText, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Building,
  TrendingUp,
  Calendar
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface Statistics {
  totalUsers: number;
  totalDepartments: number;
  totalIncidents: number;
  pendingIncidents: number;
  inProgressIncidents: number;
  resolvedIncidents: number;
  rejectedIncidents: number;
  incidentsByCategory: Array<{ name: string; value: number }>;
  incidentsByDepartment: Array<{ name: string; value: number }>;
  incidentsTrend: Array<{ date: string; count: number }>;
  resolutionTime: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminStatistics = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<Statistics>({
    totalUsers: 0,
    totalDepartments: 0,
    totalIncidents: 0,
    pendingIncidents: 0,
    inProgressIncidents: 0,
    resolvedIncidents: 0,
    rejectedIncidents: 0,
    incidentsByCategory: [],
    incidentsByDepartment: [],
    incidentsTrend: [],
    resolutionTime: 0
  });
  const [loading, setLoading] = useState(true);

  const loadStatistics = async () => {
    try {
      // Load statistics from API
      const stats = await apiClient.get('/stats/admin');
      const incidents = await incidentsApi.getAll();
      
      // Calculate incident statistics
      const pending = stats.incidentsByStatus?.pending || 0;
      const inProgress = stats.incidentsByStatus?.['in_progress'] || 0;
      const resolved = stats.incidentsByStatus?.resolved || 0;
      const rejected = stats.incidentsByStatus?.rejected || 0;

      // Incidents by category
      const categoryStats = stats.incidentsByCategory || {};

      // Incidents by department
      const departments = await apiClient.get('/departments');
      const departmentStats: Record<string, number> = {};
      incidents.forEach((incident: any) => {
        if (incident.assignedDepartmentId) {
          const dept = departments.find((d: any) => d.id === incident.assignedDepartmentId);
          const deptName = dept?.name || 'Sin asignar';
          departmentStats[deptName] = (departmentStats[deptName] || 0) + 1;
        } else {
          departmentStats['Sin asignar'] = (departmentStats['Sin asignar'] || 0) + 1;
        }
      });

      // Incidents trend (last 30 days)
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split('T')[0];
      });

      const trendData = last30Days.map(date => {
        const count = incidents.filter((incident: any) => 
          incident.createdAt.split('T')[0] === date
        ).length;
        return { date, count };
      });

      // Calculate average resolution time
      const resolvedIncidents = incidents.filter(i => i.status === 'resolved' && i.resolved_at);
      const avgResolutionTime = resolvedIncidents.length > 0 
        ? resolvedIncidents.reduce((acc, incident) => {
            const created = new Date(incident.created_at);
            const resolved = new Date(incident.resolved_at!);
            return acc + (resolved.getTime() - created.getTime());
          }, 0) / resolvedIncidents.length / (1000 * 60 * 60 * 24) // Convert to days
        : 0;

      setStats({
        totalUsers: usersResponse.count || 0,
        totalDepartments: departmentsResponse.count || 0,
        totalIncidents: incidents.length,
        pendingIncidents: pending,
        inProgressIncidents: inProgress,
        resolvedIncidents: resolved,
        rejectedIncidents: rejected,
        incidentsByCategory: Object.entries(categoryStats).map(([name, value]) => ({ name, value })),
        incidentsByDepartment: Object.entries(departmentStats).map(([name, value]) => ({ name, value })),
        incidentsTrend: trendData,
        resolutionTime: Math.round(avgResolutionTime * 10) / 10
      });

    } catch (error) {
      console.error('Error loading statistics:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  const generatePDFReport = async () => {
    try {
      const pdf = new jsPDF();
      
      // Title
      pdf.setFontSize(20);
      pdf.text('Reporte de Incidencias - GAD Paján', 20, 30);
      
      // Date
      pdf.setFontSize(12);
      pdf.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 45);
      
      // Summary statistics
      pdf.setFontSize(16);
      pdf.text('Resumen General', 20, 65);
      
      const summaryData = [
        ['Total de Usuarios', stats.totalUsers.toString()],
        ['Total de Departamentos', stats.totalDepartments.toString()],
        ['Total de Incidencias', stats.totalIncidents.toString()],
        ['Incidencias Pendientes', stats.pendingIncidents.toString()],
        ['Incidencias en Progreso', stats.inProgressIncidents.toString()],
        ['Incidencias Resueltas', stats.resolvedIncidents.toString()],
        ['Incidencias Rechazadas', stats.rejectedIncidents.toString()],
        ['Tiempo Promedio de Resolución', `${stats.resolutionTime} días`]
      ];

      pdf.autoTable({
        startY: 75,
        head: [['Métrica', 'Valor']],
        body: summaryData,
        theme: 'grid'
      });

      // Category breakdown
      const finalY = (pdf as any).lastAutoTable.finalY + 20;
      pdf.setFontSize(16);
      pdf.text('Incidencias por Categoría', 20, finalY);
      
      const categoryData = stats.incidentsByCategory.map(item => [
        item.name,
        item.value.toString(),
        `${((item.value / stats.totalIncidents) * 100).toFixed(1)}%`
      ]);

      pdf.autoTable({
        startY: finalY + 10,
        head: [['Categoría', 'Cantidad', 'Porcentaje']],
        body: categoryData,
        theme: 'grid'
      });

      // Department breakdown
      const finalY2 = (pdf as any).lastAutoTable.finalY + 20;
      pdf.setFontSize(16);
      pdf.text('Incidencias por Departamento', 20, finalY2);
      
      const departmentData = stats.incidentsByDepartment.map(item => [
        item.name,
        item.value.toString(),
        `${((item.value / stats.totalIncidents) * 100).toFixed(1)}%`
      ]);

      pdf.autoTable({
        startY: finalY2 + 10,
        head: [['Departamento', 'Cantidad', 'Porcentaje']],
        body: departmentData,
        theme: 'grid'
      });

      // Save the PDF
      pdf.save(`reporte-incidencias-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Éxito",
        description: "Reporte PDF generado correctamente",
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el reporte PDF",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with PDF Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Estadísticas del Sistema</h2>
          <p className="text-muted-foreground">Dashboard completo de métricas y análisis</p>
        </div>
        <Button onClick={generatePDFReport}>
          <Download className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Usuarios</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Departamentos</p>
                <p className="text-2xl font-bold">{stats.totalDepartments}</p>
              </div>
              <Building className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Incidencias</p>
                <p className="text-2xl font-bold">{stats.totalIncidents}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tiempo Resolución</p>
                <p className="text-2xl font-bold">{stats.resolutionTime}d</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold">{stats.pendingIncidents}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Progreso</p>
                <p className="text-2xl font-bold">{stats.inProgressIncidents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resueltas</p>
                <p className="text-2xl font-bold">{stats.resolvedIncidents}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rechazadas</p>
                <p className="text-2xl font-bold">{stats.rejectedIncidents}</p>
              </div>
              <FileText className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Incidencias por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.incidentsByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.incidentsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Incidencias por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.incidentsByDepartment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Incidencias (Últimos 30 días)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.incidentsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
              <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatistics;