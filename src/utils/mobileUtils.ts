// Utilidades para mejorar la experiencia móvil

export const isMobile = (): boolean => {
  return window.innerWidth <= 768;
};

export const isTablet = (): boolean => {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

export const isDesktop = (): boolean => {
  return window.innerWidth > 1024;
};

export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
};

export const preventZoom = (): void => {
  // Prevenir zoom en dispositivos móviles
  document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
  });
  
  document.addEventListener('gesturechange', (e) => {
    e.preventDefault();
  });
  
  document.addEventListener('gestureend', (e) => {
    e.preventDefault();
  });
};

export const setupMobileViewport = (): void => {
  // Configurar viewport para dispositivos móviles
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
  }
};

export const handleOrientationChange = (callback: () => void): (() => void) => {
  const handleChange = () => {
    // Pequeño delay para que el viewport se actualice
    setTimeout(callback, 100);
  };

  window.addEventListener('orientationchange', handleChange);
  window.addEventListener('resize', handleChange);

  return () => {
    window.removeEventListener('orientationchange', handleChange);
    window.removeEventListener('resize', handleChange);
  };
};

export const getSafeAreaInsets = () => {
  const computedStyle = getComputedStyle(document.documentElement);
  return {
    top: computedStyle.getPropertyValue('--safe-area-inset-top') || '0px',
    right: computedStyle.getPropertyValue('--safe-area-inset-right') || '0px',
    bottom: computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0px',
    left: computedStyle.getPropertyValue('--safe-area-inset-left') || '0px',
  };
};
