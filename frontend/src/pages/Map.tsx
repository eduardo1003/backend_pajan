import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  created_at: string;
  citizen_id: string;
  profiles: {
    full_name: string;
  } | null;
}

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [tokenSaved, setTokenSaved] = useState(false);

  const loadIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select(`
          *,
          profiles:citizen_id (
            full_name
          )
        `)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) throw error;
      setIncidents((data as any) || []);
    } catch (error) {
      console.error('Error loading incidents:', error);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const saveMapboxToken = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setTokenSaved(true);
      initializeMap();
    }
  };

  const initializeMap = () => {
    const token = mapboxToken || localStorage.getItem('mapbox_token');
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-80.4616, -1.0545], // Paján coordinates
      zoom: 13,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    map.current.on('load', () => {
      addIncidentsToMap();
    });
  };

  const addIncidentsToMap = () => {
    if (!map.current) return;

    incidents.forEach((incident) => {
      const marker = document.createElement('div');
      marker.className = 'incident-marker';
      marker.style.width = '30px';
      marker.style.height = '30px';
      marker.style.borderRadius = '50%';
      marker.style.cursor = 'pointer';
      marker.style.display = 'flex';
      marker.style.alignItems = 'center';
      marker.style.justifyContent = 'center';
      marker.style.color = 'white';
      marker.style.fontWeight = 'bold';
      marker.style.border = '2px solid white';
      marker.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      // Color based on status
      switch (incident.status) {
        case 'pending':
          marker.style.backgroundColor = '#f59e0b';
          break;
        case 'in_progress':
          marker.style.backgroundColor = '#3b82f6';
          break;
        case 'resolved':
          marker.style.backgroundColor = '#10b981';
          break;
        case 'rejected':
          marker.style.backgroundColor = '#ef4444';
          break;
        default:
          marker.style.backgroundColor = '#6b7280';
      }

      marker.innerHTML = '●';

      marker.addEventListener('click', () => {
        setSelectedIncident(incident);
      });

      new mapboxgl.Marker(marker)
        .setLngLat([incident.longitude, incident.latitude])
        .addTo(map.current!);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('mapbox_token');
    if (token) {
      setMapboxToken(token);
      setTokenSaved(true);
      initializeMap();
    }
  }, []);

  useEffect(() => {
    if (map.current && incidents.length > 0) {
      addIncidentsToMap();
    }
  }, [incidents]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <AlertTriangle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'default';
      case 'resolved':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in_progress':
        return 'En Progreso';
      case 'resolved':
        return 'Resuelto';
      case 'rejected':
        return 'Rechazado';
      default:
        return status;
    }
  };

  if (!tokenSaved) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Configurar Mapbox Token</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Para ver el mapa de incidencias, necesitas configurar tu token de Mapbox.
              Puedes obtenerlo en{' '}
              <a
                href="https://mapbox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
            <Input
              type="text"
              placeholder="Ingresa tu Mapbox Public Token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <Button onClick={saveMapboxToken} className="w-full">
              Guardar Token
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 h-[calc(100vh-200px)]">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Mapa de Incidencias
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div ref={mapContainer} className="w-full h-[600px] rounded-b-lg" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leyenda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                <span className="text-sm">Pendiente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm">En Progreso</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm">Resuelto</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm">Rechazado</span>
              </div>
            </CardContent>
          </Card>

          {selectedIncident && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedIncident.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge variant={getStatusColor(selectedIncident.status) as any}>
                  {getStatusIcon(selectedIncident.status)}
                  {getStatusLabel(selectedIncident.status)}
                </Badge>
                
                <div>
                  <p className="text-sm font-medium">Descripción:</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedIncident.description}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Dirección:</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedIncident.address || 'No especificada'}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Reportado por:</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedIncident.profiles?.full_name || 'Usuario desconocido'}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Fecha:</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedIncident.created_at).toLocaleDateString()}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedIncident(null)}
                  className="w-full"
                >
                  Cerrar
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;