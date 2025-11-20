import React from 'react';
import { Building2, Phone, Mail, MapPin, ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useBarrioPresidents } from '@/hooks/useBarrioPresidents';

const BarrioPresidents = () => {
  const navigate = useNavigate();
  const { presidents, loading } = useBarrioPresidents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pajan-blue to-blue-500 text-white shadow-lg">
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Presidentes Barriales</h1>
              <p className="text-blue-100 text-sm">GAD Paján - Participación Ciudadana</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        {/* Introduction */}
        <Card className="bg-white shadow-md border-0 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Conecta con los Líderes de tu Barrio
                </h2>
                <p className="text-gray-600">
                  Los Presidentes Barriales son representantes elegidos por la comunidad que trabajan 
                  directamente con el GAD Municipal para mejorar la calidad de vida en cada sector. 
                  Contacta con el presidente de tu barrio para reportar problemas, proponer mejoras 
                  o participar en actividades comunitarias.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Barrio Presidents List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Directorio de Presidentes Barriales</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="bg-white shadow-md border-0 animate-pulse">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : presidents.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay presidentes barriales registrados</h3>
                <p className="text-gray-500">Los presidentes barriales aparecerán aquí una vez que sean agregados por el administrador.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {presidents.map((president) => (
                <Card key={president.id} className="bg-white shadow-md border-0 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-800 mb-1">
                          {president.name}
                        </CardTitle>
                        <p className="text-pajan-blue font-medium">{president.barrio}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>{president.residents} habitantes</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-pajan-blue flex-shrink-0" />
                      <span className="text-sm text-gray-600">{president.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-pajan-blue flex-shrink-0" />
                      <span className="text-sm text-gray-600">{president.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-pajan-blue flex-shrink-0" />
                      <span className="text-sm text-gray-600">{president.address}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* How to Contact */}
        <Card className="bg-white shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              ¿Cómo Contactar a tu Presidente Barrial?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pajan-blue text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                <p>
                  <strong>Identifica tu barrio:</strong> Revisa la lista de presidentes barriales y 
                  encuentra el que corresponde a tu sector de residencia.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pajan-blue text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                <p>
                  <strong>Contacta directamente:</strong> Usa el teléfono o correo electrónico 
                  proporcionado para comunicarte con tu presidente barrial.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pajan-blue text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                <p>
                  <strong>Reporta o propone:</strong> Comparte tus inquietudes, reporta problemas 
                  o propón mejoras para tu barrio.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pajan-blue text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</div>
                <p>
                  <strong>Participa activamente:</strong> Únete a las reuniones y actividades 
                  comunitarias organizadas por tu presidente barrial.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BarrioPresidents;
