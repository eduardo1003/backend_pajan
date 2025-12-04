import { useState, useEffect } from 'react';

export interface BarrioPresident {
  id: string;
  name: string;
  barrio: string;
  phone: string;
  email: string;
  address: string;
  residents: number;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'barrio_presidents';

export const useBarrioPresidents = () => {
  const [presidents, setPresidents] = useState<BarrioPresident[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar presidentes desde localStorage
  const loadPresidents = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedPresidents = JSON.parse(stored);
        setPresidents(parsedPresidents);
      } else {
        // Datos iniciales por defecto
        const defaultPresidents: BarrioPresident[] = [
          {
            id: '1',
            name: 'María González',
            barrio: 'Centro',
            phone: '0987-654-321',
            email: 'centro@gadpajan.gob.ec',
            address: 'Calle Principal #123',
            residents: 450,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Carlos Mendoza',
            barrio: 'San José',
            phone: '0987-654-322',
            email: 'sanjose@gadpajan.gob.ec',
            address: 'Av. San José #456',
            residents: 320,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Ana Rodríguez',
            barrio: 'La Esperanza',
            phone: '0987-654-323',
            email: 'laesperanza@gadpajan.gob.ec',
            address: 'Calle La Esperanza #789',
            residents: 280,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '4',
            name: 'Luis Torres',
            barrio: 'El Progreso',
            phone: '0987-654-324',
            email: 'elprogreso@gadpajan.gob.ec',
            address: 'Av. El Progreso #321',
            residents: 380,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '5',
            name: 'Carmen Vásquez',
            barrio: 'Los Laureles',
            phone: '0987-654-325',
            email: 'loslaureles@gadpajan.gob.ec',
            address: 'Calle Los Laureles #654',
            residents: 290,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '6',
            name: 'Roberto Silva',
            barrio: 'Villa Nueva',
            phone: '0987-654-326',
            email: 'villanueva@gadpajan.gob.ec',
            address: 'Av. Villa Nueva #987',
            residents: 420,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setPresidents(defaultPresidents);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPresidents));
      }
    } catch (error) {
      console.error('Error loading presidents from localStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  // Guardar presidentes en localStorage
  const savePresidents = (newPresidents: BarrioPresident[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPresidents));
      setPresidents(newPresidents);
    } catch (error) {
      console.error('Error saving presidents to localStorage:', error);
    }
  };

  // Agregar nuevo presidente
  const addPresident = (presidentData: Omit<BarrioPresident, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPresident: BarrioPresident = {
      ...presidentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedPresidents = [...presidents, newPresident];
    savePresidents(updatedPresidents);
    return newPresident;
  };

  // Actualizar presidente
  const updatePresident = (id: string, presidentData: Partial<Omit<BarrioPresident, 'id' | 'createdAt'>>) => {
    const updatedPresidents = presidents.map(president => 
      president.id === id 
        ? { ...president, ...presidentData, updatedAt: new Date().toISOString() }
        : president
    );
    savePresidents(updatedPresidents);
    return updatedPresidents.find(p => p.id === id);
  };

  // Eliminar presidente
  const deletePresident = (id: string) => {
    const updatedPresidents = presidents.filter(president => president.id !== id);
    savePresidents(updatedPresidents);
  };

  // Obtener presidente por ID
  const getPresidentById = (id: string) => {
    return presidents.find(president => president.id === id);
  };

  // Obtener presidentes por barrio
  const getPresidentsByBarrio = (barrio: string) => {
    return presidents.filter(president => 
      president.barrio.toLowerCase().includes(barrio.toLowerCase())
    );
  };

  // Cargar datos al inicializar
  useEffect(() => {
    loadPresidents();
  }, []);

  return {
    presidents,
    loading,
    addPresident,
    updatePresident,
    deletePresident,
    getPresidentById,
    getPresidentsByBarrio,
    refreshPresidents: loadPresidents
  };
};
