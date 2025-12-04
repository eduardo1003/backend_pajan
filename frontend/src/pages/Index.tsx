import React from 'react';
import { AlertTriangle, Calendar, Users, Phone, Building2, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useBarrioPresidents } from '@/hooks/useBarrioPresidents';

const quickActions = [
  {
    icon: AlertTriangle,
    title: "Reportar Problema",
    description: "Reporta problemas de vialidad, ambiente, servicios públicos y más",
    route: "/new-report",
    color: "bg-red-50 border-red-200 hover:bg-red-100",
    iconColor: "text-pajan-red",
    bgColor: "bg-red-50"
  },
  {
    icon: Calendar,
    title: "Eventos",
    description: "Participa en eventos municipales y actividades comunitarias",
    route: "/public-events",
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    iconColor: "text-pajan-blue",
    bgColor: "bg-blue-50"
  },
  {
    icon: Users,
    title: "Participación",
    description: "Únete a iniciativas comunitarias y procesos participativos",
    route: "/participation",
    color: "bg-blue-100 border-blue-300 hover:bg-blue-200",
    iconColor: "text-blue-700",
    bgColor: "bg-blue-100"
  },
  {
    icon: Phone,
    title: "Contacto",
    description: "Comunícate directamente con el GAD Municipal",
    route: "/contact",
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    iconColor: "text-pajan-green",
    bgColor: "bg-green-50"
  },
  {
    icon: Building2,
    title: "Presidentes Barriales",
    description: "Conecta con los líderes de tu barrio",
    route: "/barrio-presidents",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50"
  }
];

const stats = [
  { number: "1,234", label: "Reportes Resueltos", icon: CheckCircle },
  { number: "95%", label: "% de Satisfacción", icon: TrendingUp },
  { number: "48h", label: "Tiempo Promedio de Respuesta", icon: Clock }
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { presidents, loading: presidentsLoading } = useBarrioPresidents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pajan-blue to-blue-500 text-white shadow-lg">
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">GAD Paján</h1>
            <p className="text-blue-100 text-sm sm:text-base">Participación Ciudadana</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        {/* Main Action Button */}
        <div className="text-center mb-8">
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-white text-pajan-blue border-2 border-pajan-blue hover:bg-blue-50 px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Iniciar Sesión
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className={`${action.color} hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md`}
                onClick={() => navigate(action.route)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${action.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <action.icon className={`h-8 w-8 ${action.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Estadísticas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 bg-white shadow-md border-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-pajan-blue" />
                </div>
                <div className="text-2xl font-bold text-pajan-blue mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Barrio Presidents Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Presidentes Barriales</h2>
          {presidentsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="bg-white shadow-md border-0 animate-pulse">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {presidents.slice(0, 6).map((president) => (
                  <Card key={president.id} className="bg-white shadow-md border-0 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Building2 className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{president.name}</h3>
                      <p className="text-pajan-blue font-medium text-sm mb-2">{president.barrio}</p>
                      <p className="text-xs text-gray-600">{president.phone}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-4">
                <Button 
                  onClick={() => navigate('/barrio-presidents')}
                  className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-2 rounded-full"
                >
                  Ver Todos los Presidentes
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Gobierno Autónomo Descentralizado Municipal de Paján
          </h3>
          <p className="text-sm text-gray-600">
            Construyendo una ciudad más participativa
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
