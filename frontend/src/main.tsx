import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { preventZoom, setupMobileViewport } from './utils/mobileUtils'

// Configurar para dispositivos móviles
setupMobileViewport();
preventZoom();

createRoot(document.getElementById("root")!).render(<App />);
