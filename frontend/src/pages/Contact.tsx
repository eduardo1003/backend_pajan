import React from 'react';
import { Phone, Mail, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  const contactInfo = [
    {
      icon: Phone,
      title: "Teléfono Principal",
      value: "593-5-260-0123",
      description: "Línea directa del GAD Municipal"
    },
    {
      icon: Mail,
      title: "Correo Electrónico",
      value: "info@gadpajan.gob.ec",
      description: "Atención al ciudadano"
    },
    {
      icon: MapPin,
      title: "Dirección",
      value: "Av. Principal s/n, Paján",
      description: "Oficinas principales del GAD"
    },
    {
      icon: Clock,
      title: "Horarios de Atención",
      value: "Lunes a Viernes: 8:00 - 17:00",
      description: "Atención presencial y telefónica"
    }
  ];

  const emergencyNumbers = [
    { name: "Emergencias", number: "911", color: "text-red-600" },
    { name: "Bomberos", number: "102", color: "text-red-500" },
    { name: "Policía", number: "101", color: "text-blue-600" },
    { name: "Cruz Roja", number: "131", color: "text-red-500" }
  ];

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
              <h1 className="text-2xl font-bold">Contacto</h1>
              <p className="text-blue-100 text-sm">GAD Paján - Participación Ciudadana</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        {/* Contact Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Información de Contacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactInfo.map((info, index) => (
              <Card key={index} className="bg-white shadow-md border-0">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-6 w-6 text-pajan-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{info.title}</h3>
                      <p className="text-lg font-bold text-pajan-blue mb-1">{info.value}</p>
                      <p className="text-sm text-gray-600">{info.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Numbers */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Números de Emergencia</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {emergencyNumbers.map((emergency, index) => (
              <Card key={index} className="bg-white shadow-md border-0 text-center">
                <CardContent className="p-4">
                  <div className={`text-2xl font-bold ${emergency.color} mb-2`}>
                    {emergency.number}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {emergency.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <Card className="bg-white shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Información Adicional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                <strong>Horarios de Atención:</strong> Nuestro equipo está disponible de lunes a viernes 
                de 8:00 AM a 5:00 PM para atender sus consultas y reportes.
              </p>
              <p>
                <strong>Respuesta Rápida:</strong> Los reportes de emergencia son atendidos las 24 horas 
                del día a través de nuestros números de emergencia.
              </p>
              <p>
                <strong>Participación Ciudadana:</strong> Invitamos a todos los ciudadanos a participar 
                activamente en la construcción de una mejor ciudad a través de esta plataforma.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
