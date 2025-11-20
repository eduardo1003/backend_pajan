import { useState, useEffect } from 'react';

export interface CitizenEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  address: string;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  max_participants?: number;
  current_participants: number;
  category: string;
  contact_phone?: string;
  contact_email?: string;
}

const STORAGE_KEY = 'citizen_events';

export const useEvents = () => {
  const [events, setEvents] = useState<CitizenEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar eventos desde localStorage
  const loadEvents = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedEvents = JSON.parse(stored);
        setEvents(parsedEvents);
      } else {
        // Datos iniciales por defecto
        const defaultEvents: CitizenEvent[] = [
          {
            id: '1',
            title: 'Limpieza Comunitaria del Parque Central',
            description: 'Únete a nosotros para mantener limpio nuestro hermoso parque central. Trae guantes y bolsas de basura.',
            event_date: '2024-02-15',
            event_time: '08:00',
            location: 'Parque Central de Paján',
            address: 'Calle Principal s/n, Paján',
            image_url: null,
            is_published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: 'admin',
            max_participants: 50,
            current_participants: 23,
            category: 'Ambiente',
            contact_phone: '0987-654-321',
            contact_email: 'ambiente@gadpajan.gob.ec'
          },
          {
            id: '2',
            title: 'Taller de Reciclaje para Niños',
            description: 'Aprende sobre la importancia del reciclaje y cómo hacer manualidades con materiales reciclados.',
            event_date: '2024-02-20',
            event_time: '15:00',
            location: 'Centro Cultural Municipal',
            address: 'Av. Principal #123, Paján',
            image_url: null,
            is_published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: 'admin',
            max_participants: 30,
            current_participants: 15,
            category: 'Educación',
            contact_phone: '0987-654-322',
            contact_email: 'educacion@gadpajan.gob.ec'
          },
          {
            id: '3',
            title: 'Asamblea Ciudadana - Presupuesto Participativo',
            description: 'Participa en la decisión de cómo se invertirán los recursos municipales para el próximo año.',
            event_date: '2024-02-25',
            event_time: '18:00',
            location: 'Salón de Actos del GAD',
            address: 'Calle Municipal #456, Paján',
            image_url: null,
            is_published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: 'admin',
            max_participants: 100,
            current_participants: 67,
            category: 'Participación',
            contact_phone: '0987-654-323',
            contact_email: 'participacion@gadpajan.gob.ec'
          }
        ];
        setEvents(defaultEvents);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEvents));
      }
    } catch (error) {
      console.error('Error loading events from localStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  // Guardar eventos en localStorage
  const saveEvents = (newEvents: CitizenEvent[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
      setEvents(newEvents);
    } catch (error) {
      console.error('Error saving events to localStorage:', error);
    }
  };

  // Agregar nuevo evento
  const addEvent = (eventData: Omit<CitizenEvent, 'id' | 'created_at' | 'updated_at' | 'current_participants'>) => {
    const newEvent: CitizenEvent = {
      ...eventData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      current_participants: 0
    };
    const updatedEvents = [...events, newEvent];
    saveEvents(updatedEvents);
    return newEvent;
  };

  // Actualizar evento
  const updateEvent = (id: string, eventData: Partial<Omit<CitizenEvent, 'id' | 'created_at'>>) => {
    const updatedEvents = events.map(event => 
      event.id === id 
        ? { ...event, ...eventData, updated_at: new Date().toISOString() }
        : event
    );
    saveEvents(updatedEvents);
    return updatedEvents.find(e => e.id === id);
  };

  // Eliminar evento
  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    saveEvents(updatedEvents);
  };

  // Obtener evento por ID
  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  // Obtener eventos publicados
  const getPublishedEvents = () => {
    return events.filter(event => event.is_published);
  };

  // Obtener eventos por categoría
  const getEventsByCategory = (category: string) => {
    return events.filter(event => 
      event.category.toLowerCase().includes(category.toLowerCase()) && event.is_published
    );
  };

  // Participar en evento
  const joinEvent = (id: string) => {
    const event = events.find(e => e.id === id);
    if (event && event.current_participants < (event.max_participants || Infinity)) {
      updateEvent(id, { current_participants: event.current_participants + 1 });
      return true;
    }
    return false;
  };

  // Cargar datos al inicializar
  useEffect(() => {
    loadEvents();
  }, []);

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getPublishedEvents,
    getEventsByCategory,
    joinEvent,
    refreshEvents: loadEvents
  };
};
