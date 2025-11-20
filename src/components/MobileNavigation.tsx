import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Función para manejar el botón de retroceso
    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      
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
      window.Capacitor.addListener('backButton', () => {
        if (location.pathname === '/dashboard' || location.pathname === '/') {
          // Si está en la página principal, minimizar la app
          if (window.Capacitor?.Plugins?.App) {
            window.Capacitor.Plugins.App.minimizeApp();
          }
        } else {
          // Si no, retroceder
          navigate(-1);
        }
      });
    }

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleBackButton);
      if (window.Capacitor) {
        window.Capacitor.removeListener('backButton', () => {});
      }
    };
  }, [navigate, location.pathname]);

  return null; // Este componente no renderiza nada
};

// Extender la interfaz Window para incluir Capacitor
declare global {
  interface Window {
    Capacitor?: {
      addListener: (event: string, callback: () => void) => void;
      removeListener: (event: string, callback: () => void) => void;
      Plugins?: {
        App?: {
          minimizeApp: () => void;
        };
      };
    };
  }
}
