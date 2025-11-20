import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';

const availableIcons = [
  'Road', 'Heart', 'Leaf', 'Shield', 'Lightbulb', 'Droplets', 'Bus', 'Dog', 'Trash2', 'AlertCircle',
  'Zap', 'Building', 'Phone', 'Wifi', 'Tool', 'Users', 'Home', 'Car', 'Tree', 'Flame'
];

const availableColors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#FBBF24', '#06B6D4', 
  '#8B5CF6', '#F97316', '#6B7280', '#64748B', '#84CC16', '#EC4899'
];

const CategoryManagement = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'AlertCircle',
    color: '#64748B'
  });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'AlertCircle',
      color: '#64748B'
    });
    setSelectedCategory(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && selectedCategory) {
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', selectedCategory.id);

        if (error) throw error;

        toast({
          title: "Éxito",
          description: "Categoría actualizada correctamente",
        });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Éxito",
          description: "Categoría creada correctamente",
        });
      }

      resetForm();
      loadCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: error.message.includes('duplicate') 
          ? "Ya existe una categoría con ese nombre"
          : "No se pudo guardar la categoría",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || 'AlertCircle',
      color: category.color || '#64748B'
    });
    setIsEditing(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('¿Está seguro de que desea eliminar esta categoría?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Categoría eliminada correctamente",
      });

      loadCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      });
    }
  };

  const toggleCategoryStatus = async (categoryId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !isActive })
        .eq('id', categoryId);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: `Categoría ${!isActive ? 'activada' : 'desactivada'} correctamente`,
      });

      loadCategories();
    } catch (error) {
      console.error('Error toggling category status:', error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado de la categoría",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Cargando gestión de categorías...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
              </DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? 'Modifica los datos de la categoría'
                  : 'Crea una nueva categoría para los incidentes'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre interno</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej: vialidad"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Descripción</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción de la categoría"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Icono</label>
                <Select 
                  value={formData.icon} 
                  onValueChange={(value) => setFormData({ ...formData, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="grid grid-cols-6 gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {isEditing ? 'Actualizar' : 'Crear'} Categoría
                </Button>
                {isEditing && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Categorías */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Categorías Existentes
          </CardTitle>
          <CardDescription>
            Gestiona las categorías disponibles para clasificar incidentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{category.description}</h3>
                      <Badge variant="outline" className="text-xs">
                        {category.name}
                      </Badge>
                      <Badge 
                        variant={category.is_active ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {category.is_active ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Icono: {category.icon} • Color: {category.color}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCategoryStatus(category.id, category.is_active)}
                  >
                    {category.is_active ? 'Desactivar' : 'Activar'}
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Editar Categoría</DialogTitle>
                        <DialogDescription>
                          Modifica los datos de la categoría
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nombre interno</label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="ej: vialidad"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Descripción</label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descripción de la categoría"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Icono</label>
                          <Select 
                            value={formData.icon} 
                            onValueChange={(value) => setFormData({ ...formData, icon: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableIcons.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  {icon}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Color</label>
                          <div className="grid grid-cols-6 gap-2">
                            {availableColors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                className={`w-8 h-8 rounded-full border-2 ${
                                  formData.color === color ? 'border-gray-800' : 'border-gray-300'
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => setFormData({ ...formData, color })}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button type="submit" className="flex-1">
                            Actualizar Categoría
                          </Button>
                          <Button type="button" variant="outline" onClick={resetForm}>
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManagement;