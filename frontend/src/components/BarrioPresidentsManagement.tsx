import React, { useState } from 'react';
import { Plus, Edit, Trash2, Building2, Phone, Mail, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useBarrioPresidents, BarrioPresident } from '@/hooks/useBarrioPresidents';
import { useToast } from '@/hooks/use-toast';

const BarrioPresidentsManagement = () => {
  const { presidents, addPresident, updatePresident, deletePresident } = useBarrioPresidents();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPresident, setEditingPresident] = useState<BarrioPresident | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    barrio: '',
    phone: '',
    email: '',
    address: '',
    residents: 0
  });

  const resetForm = () => {
    setFormData({
      name: '',
      barrio: '',
      phone: '',
      email: '',
      address: '',
      residents: 0
    });
    setEditingPresident(null);
  };

  const handleOpenDialog = (president?: BarrioPresident) => {
    if (president) {
      setEditingPresident(president);
      setFormData({
        name: president.name,
        barrio: president.barrio,
        phone: president.phone,
        email: president.email,
        address: president.address,
        residents: president.residents
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.barrio || !formData.phone || !formData.email) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingPresident) {
        await updatePresident(editingPresident.id, formData);
        toast({
          title: "Éxito",
          description: "Presidente barrial actualizado correctamente"
        });
      } else {
        await addPresident(formData);
        toast({
          title: "Éxito",
          description: "Presidente barrial agregado correctamente"
        });
      }
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar el presidente barrial",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePresident(id);
      toast({
        title: "Éxito",
        description: "Presidente barrial eliminado correctamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar el presidente barrial",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Presidentes Barriales</h2>
          <p className="text-gray-600">Gestiona los presidentes barriales de Paján</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Presidente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPresident ? 'Editar Presidente Barrial' : 'Agregar Presidente Barrial'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: María González"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="barrio">Barrio *</Label>
                  <Input
                    id="barrio"
                    value={formData.barrio}
                    onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
                    placeholder="Ej: Centro"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ej: 0987-654-321"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ej: centro@gadpajan.gob.ec"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ej: Calle Principal #123"
                />
              </div>
              
              <div>
                <Label htmlFor="residents">Número de Habitantes</Label>
                <Input
                  id="residents"
                  type="number"
                  value={formData.residents}
                  onChange={(e) => setFormData({ ...formData, residents: parseInt(e.target.value) || 0 })}
                  placeholder="Ej: 450"
                  min="0"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingPresident ? 'Actualizar' : 'Agregar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presidents.map((president) => (
          <Card key={president.id} className="bg-white shadow-md border-0">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {president.name}
                    </CardTitle>
                    <p className="text-pajan-blue font-medium text-sm">{president.barrio}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(president)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará permanentemente el presidente barrial "{president.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(president.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-pajan-blue flex-shrink-0" />
                <span className="text-sm text-gray-600">{president.residents} habitantes</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {presidents.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay presidentes barriales</h3>
            <p className="text-gray-500 mb-4">Agrega el primer presidente barrial para comenzar.</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Presidente
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BarrioPresidentsManagement;
