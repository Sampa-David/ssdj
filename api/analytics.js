import { analytics } from '@vercel/analytics/server';

export default async function handler(req, res) {
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
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'],
        country: req.headers['x-vercel-ip-country'] || 'unknown',
        city: req.headers['x-vercel-ip-city'] || 'unknown'
      };

      // Log détaillé pour Vercel
      console.log('[Page Analytics]', {
        sessionId: enhancedData.sessionId,
        totalPages: enhancedData.totalPages,
        totalEvents: enhancedData.totalEvents,
        pages: enhancedData.pages.map(p => ({
          page: p.page,
          timeOnPage: p.timeOnPage,
          scrollDepth: p.scrollDepth,
          referrer: p.referrer
        })),
        browser: `${enhancedData.browserInfo.browser} ${enhancedData.browserInfo.version}`,
        device: enhancedData.deviceInfo.screenResolution,
        location: `${enhancedData.city}, ${enhancedData.country}`
      });

      // Envoyer à Vercel Analytics
      try {
        analytics({
          name: 'page_session',
          parameters: {
            sessionId: enhancedData.sessionId,
            pageCount: enhancedData.totalPages,
            eventCount: enhancedData.totalEvents,
            browser: enhancedData.browserInfo.browser,
            device: enhancedData.deviceInfo.screenResolution,
            country: enhancedData.country
          }
        });
      } catch (analyticsError) {
        console.warn('Vercel Analytics error:', analyticsError);
      }

      res.status(200).json({ 
        success: true,
        message: 'Analytics recorded successfully',
        sessionId: enhancedData.sessionId,
        pagesTracked: enhancedData.totalPages,
        eventsTracked: enhancedData.totalEvents
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
    res.status(200).json({ 
      status: 'Analytics API is running',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
