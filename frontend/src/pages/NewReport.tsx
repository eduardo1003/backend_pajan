import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, MapPin, Upload, Send, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/integrations/api/client';

const categories = [
  { value: 'vialidad', label: 'Vialidad' },
  { value: 'salud', label: 'Salud' },
  { value: 'ambiente', label: 'Ambiente' },
  { value: 'seguridad', label: 'Seguridad' },
  { value: 'alumbrado', label: 'Alumbrado' },
  { value: 'agua_alcantarillado', label: 'Agua y Alcantarillado' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'maltrato_animal', label: 'Maltrato Animal' },
  { value: 'basura', label: 'Basura' },
  { value: 'otros', label: 'Otros' }
];

const NewReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    address: '',
    evidence: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoadingLocation(false);
          toast({
            title: "Ubicación no disponible",
            description: "No se pudo obtener la ubicación automáticamente",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Geolocalización no soportada",
        description: "Tu navegador no soporta geolocalización",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, evidence: file }));
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const { url } = await apiClient.uploadFile(file);
      return url;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      toast({
        title: "Error",
        description: "No se pudo obtener la información del usuario",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Validation
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Upload evidence if exists
      let evidenceUrl = null;
      if (formData.evidence) {
        evidenceUrl = await uploadFile(formData.evidence);
        if (!evidenceUrl) {
          toast({
            title: "Error",
            description: "No se pudo subir la imagen",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Create incident
      const incidentData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        address: formData.address || undefined,
        latitude: location?.lat?.toString(),
        longitude: location?.lng?.toString(),
        evidenceUrls: evidenceUrl ? [evidenceUrl] : undefined,
      };

      await apiClient.post('/incidents', incidentData);

      toast({
        title: "¡Reporte enviado exitosamente!",
        description: "Su reporte ha sido recibido y será asignado al departamento correspondiente",
      });

      // Reset form and navigate
      setFormData({
        title: '',
        description: '',
        category: '',
        address: '',
        evidence: null
      });

      navigate('/reports');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive"
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 shadow-lg">
        <div className="w-full flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-primary-foreground hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-responsive-lg font-bold">Nuevo Reporte</h1>
            <p className="text-sm opacity-90">Reporte un incidente en su comunidad</p>
          </div>
        </div>
      </div>

      <div className="w-full p-responsive">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-responsive-lg">Información del Incidente</CardTitle>
              <CardDescription>
                Proporcione los detalles básicos del problema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título del reporte *</Label>
                <Input
                  id="title"
                  placeholder="Ej: Bache en la calle principal"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción detallada *</Label>
                <Textarea
                  id="description"
                  placeholder="Describa el problema con detalle..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-responsive-lg">Categorización</CardTitle>
              <CardDescription>
                Seleccione la categoría que mejor describe el problema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Categoría del incidente *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-responsive-lg">Ubicación</CardTitle>
              <CardDescription>
                Especifique dónde ocurre el problema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Dirección o referencia</Label>
                <div className="flex gap-2">
                  <Input
                    id="address"
                    placeholder="Ej: Av. Principal con Calle 10 de Agosto"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={getCurrentLocation}
                    disabled={loadingLocation}
                  >
                    {loadingLocation ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {location && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Ubicación obtenida: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Evidence */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evidencia</CardTitle>
              <CardDescription>
                Adjunte fotos para ayudar a entender el problema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="evidence">Foto del incidente</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <input
                    id="evidence"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label htmlFor="evidence" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      {formData.evidence ? (
                        <>
                          <Upload className="h-8 w-8 text-green-500" />
                          <p className="text-sm font-medium text-green-600">
                            {formData.evidence.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Toque para cambiar
                          </p>
                        </>
                      ) : (
                        <>
                          <Camera className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm font-medium">Tomar foto</p>
                          <p className="text-xs text-muted-foreground">
                            o seleccione de la galería
                          </p>
                        </>
                      )}
                    </div>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Enviando reporte...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Enviar Reporte
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewReport;