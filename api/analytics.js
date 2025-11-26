export default async function handler(req, res) {
  // Activer CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const analyticsData = typeof req.body === 'string' 
        ? JSON.parse(req.body) 
        : req.body;
      
      // Enregistrer les données analytiques détaillées
      const enhancedData = {
        sessionId: analyticsData.sessionId,
        timestamp: new Date().toISOString(),
        pages: analyticsData.pages || [],
        events: analyticsData.events || [],
        deviceInfo: analyticsData.deviceInfo || {},
        browserInfo: analyticsData.browserInfo || {},
        totalEvents: analyticsData.totalEvents || 0,
        totalPages: analyticsData.totalPages || 0,
        duration: analyticsData.duration || 0,
        
        // Informations du serveur
        ip: req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        country: req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry'] || 'unknown',
        city: req.headers['x-vercel-ip-city'] || 'unknown',
        referer: req.headers['referer'] || 'direct'
      };

      // Log détaillé pour Vercel Web Analytics
      console.log('VERCEL_WEB_ANALYTICS', JSON.stringify({
        type: 'pageView',
        sessionId: enhancedData.sessionId,
        timestamp: enhancedData.timestamp,
        url: analyticsData.pages[0]?.url || 'unknown',
        referrer: analyticsData.pages[0]?.referrer || 'direct',
        userAgent: enhancedData.userAgent,
        country: enhancedData.country,
        city: enhancedData.city,
        totalPages: enhancedData.totalPages,
        totalEvents: enhancedData.totalEvents,
        device: enhancedData.deviceInfo.screenResolution,
        browser: `${enhancedData.browserInfo.browser} ${enhancedData.browserInfo.version}`,
        pages: enhancedData.pages.map(p => ({
          page: p.page,
          timeOnPage: p.timeOnPage,
          scrollDepth: p.scrollDepth
        }))
      }));

      // Envoyer des events individuels pour chaque page
      analyticsData.pages?.forEach(page => {
        console.log('VERCEL_WEB_ANALYTICS_EVENT', JSON.stringify({
          type: 'event',
          name: 'page_view',
          page: page.page,
          timeOnPage: page.timeOnPage,
          scrollDepth: page.scrollDepth,
          country: enhancedData.country
        }));
      });

      res.status(200).json({ 
        success: true,
        message: 'Analytics recorded successfully',
        sessionId: enhancedData.sessionId,
        pagesTracked: enhancedData.totalPages,
        eventsTracked: enhancedData.totalEvents,
        country: enhancedData.country,
        city: enhancedData.city
      });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ 
        error: 'Failed to record analytics',
        details: error.message 
      });
    }
  } else if (req.method === 'GET') {
    // Endpoint pour vérifier que l'API fonctionne
    const stats = {
      status: 'Analytics API is running ✅',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      region: process.env.VERCEL_REGION
    };
    
    console.log('[Analytics API Status]', stats);
    res.status(200).json(stats);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
