import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useBackButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Función para manejar el botón de retroceso
    const handleBackButton = () => {
      // Verificar si hay historial para retroceder
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        // Si no hay historial, ir al dashboard
        navigate('/dashboard');
      }
    };

    // Agregar listener para el evento popstate (botón de retroceso del navegador)
    window.addEventListener('popstate', handleBackButton);

    // Para dispositivos móviles con Capacitor
    if (window.Capacitor) {
      // Registrar el listener del botón de retroceso físico
      window.Capacitor.addListener('backButton', handleBackButton);
    }

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleBackButton);
      if (window.Capacitor) {
        window.Capacitor.removeListener('backButton', handleBackButton);
      }
    };
  }, [navigate]);
};

// Extender la interfaz Window para incluir Capacitor
declare global {
  interface Window {
    Capacitor?: {
      addListener: (event: string, callback: () => void) => void;
      removeListener: (event: string, callback: () => void) => void;
    };
  }
}
