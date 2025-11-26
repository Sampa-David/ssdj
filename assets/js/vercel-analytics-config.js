<!-- Vercel Web Analytics Integration -->
<script>
  // Configuration pour Vercel Web Analytics
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments) };
  
  // Identifier les visiteurs
  if (typeof window !== 'undefined') {
    // Track page views
    window.va('pageview', {
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer || 'direct'
    });

    // Track custom events
    document.addEventListener('click', function(e) {
      const target = e.target.closest('[data-analytics]');
      if (target) {
        window.va('event', {
          name: target.getAttribute('data-analytics'),
          value: target.getAttribute('data-analytics-value') || 1
        });
      }
    });
  }
</script>

<!-- Script Vercel Web Analytics -->
<script defer src="https://cdn.vercel-analytics.com/v1/script.js"></script>
