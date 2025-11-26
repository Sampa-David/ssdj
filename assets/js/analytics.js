// Vercel Analytics - Tracking des visiteurs
(function() {
  // Script pour l'analytics Vercel
  const VERCEL_ANALYTICS_ID = process.env.VERCEL_ANALYTICS_ID || 'default';
  
  // Fonction pour tracker les visites
  function trackPageView() {
    const pageData = {
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    };
    
    // Envoyer les données à Vercel Analytics
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', JSON.stringify(pageData));
    }
  }

  // Tracker au chargement de la page
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackPageView);
  } else {
    trackPageView();
  }

  // Tracker les changements de page
  window.addEventListener('beforeunload', function() {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', JSON.stringify({
        event: 'page_leave',
        path: window.location.pathname,
        timestamp: new Date().toISOString()
      }));
    }
  });
})();
