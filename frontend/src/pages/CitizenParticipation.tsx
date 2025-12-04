import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, Users, Clock, Phone, Mail, UserPlus, Image as ImageIcon } from 'lucide-react';

const CitizenParticipation = () => {
  const { user, profile } = useAuth();
  const { events, loading, joinEvent } = useEvents();
  const { toast } = useToast();

  const handleJoinEvent = (eventId: string) => {
    const success = joinEvent(eventId);
    if (success) {
      toast({
        title: "¡Te has unido al evento!",
        description: "Recibirás más información próximamente."
      });
    } else {
      toast({
        title: "No se pudo unir al evento",
        description: "El evento está lleno o no está disponible.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Ambiente': 'bg-green-100 text-green-800',
      'Educación': 'bg-blue-100 text-blue-800',
      'Salud': 'bg-red-100 text-red-800',
      'Deportes': 'bg-orange-100 text-orange-800',
      'Cultura': 'bg-purple-100 text-purple-800',
      'Participación': 'bg-pajan-blue text-white',
      'Desarrollo': 'bg-yellow-100 text-yellow-800',
      'Seguridad': 'bg-gray-100 text-gray-800',
      'Otros': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const publishedEvents = events.filter(event => event.is_published);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-pajan-blue to-blue-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Participación Ciudadana</h1>
              <p className="text-blue-100 text-sm sm:text-base">
                Eventos y actividades para la comunidad de Paján
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">{publishedEvents.length} eventos disponibles</span>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="bg-white shadow-md border-0 animate-pulse">
                <CardHeader className="pb-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : publishedEvents.length === 0 ? (
          <Card className="text-center py-12 bg-white shadow-md border-0">
            <CardContent>
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay eventos disponibles</h3>
              <p className="text-gray-500">Los eventos aparecerán aquí una vez que sean publicados.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedEvents.map((event) => (
              <Card key={event.id} className="bg-white shadow-md border-0 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {event.title}
                      </CardTitle>
                      <Badge className={`${getCategoryColor(event.category)} text-xs`}>
                        {event.category}
                      </Badge>
                    </div>
                    {event.image_url && (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center ml-3">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">{event.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-pajan-blue" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-pajan-blue" />
                      <span>{formatTime(event.event_time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-pajan-blue" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    {event.address && (
                      <div className="text-xs text-gray-500 ml-6 line-clamp-1">
                        {event.address}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-pajan-blue" />
                      <span>
                        {event.current_participants} / {event.max_participants || '∞'} participantes
                      </span>
                    </div>
                  </div>

                  {(event.contact_phone || event.contact_email) && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">Contacto:</p>
                      <div className="space-y-1">
                        {event.contact_phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Phone className="h-3 w-3 text-pajan-blue" />
                            <span>{event.contact_phone}</span>
                          </div>
                        )}
                        {event.contact_email && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Mail className="h-3 w-3 text-pajan-blue" />
                            <span className="line-clamp-1">{event.contact_email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={() => handleJoinEvent(event.id)}
                    className="w-full bg-gradient-to-r from-pajan-blue to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={event.max_participants && event.current_participants >= event.max_participants}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {event.max_participants && event.current_participants >= event.max_participants 
                      ? 'Evento Lleno' 
                      : 'Participar'
                    }
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Section */}
        <Card className="bg-white shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 text-center">
              ¿Cómo Participar?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="h-6 w-6 text-pajan-blue" />
                </div>
                <h3 className="font-semibold text-gray-800">1. Explora Eventos</h3>
                <p className="text-sm text-gray-600">
                  Revisa los eventos disponibles y encuentra los que más te interesen
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <UserPlus className="h-6 w-6 text-pajan-green" />
                </div>
                <h3 className="font-semibold text-gray-800">2. Únete</h3>
                <p className="text-sm text-gray-600">
                  Haz clic en "Participar" para unirte al evento de tu interés
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">3. Participa</h3>
                <p className="text-sm text-gray-600">
                  Asiste al evento y contribuye al desarrollo de tu comunidad
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CitizenParticipation;