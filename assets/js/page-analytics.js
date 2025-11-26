// Advanced Analytics Tracking System
class PageAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.pageData = {
      sessionId: this.sessionId,
      startTime: new Date().toISOString(),
      pages: [],
      events: [],
      deviceInfo: this.getDeviceInfo(),
      browserInfo: this.getBrowserInfo()
    };
    
    this.initializeTracking();
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      deviceMemory: navigator.deviceMemory || 'unknown',
      maxTouchPoints: navigator.maxTouchPoints || 0,
      screenResolution: `${screen.width}x${screen.height}`,
      screenColorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';

    if (ua.indexOf('Firefox') > -1) {
      browser = 'Firefox';
      version = ua.substring(ua.indexOf('Firefox') + 8);
    } else if (ua.indexOf('Chrome') > -1 && ua.indexOf('Chromium') === -1) {
      browser = 'Chrome';
      version = ua.substring(ua.indexOf('Chrome') + 7);
    } else if (ua.indexOf('Safari') > -1) {
      browser = 'Safari';
      version = ua.substring(ua.indexOf('Version') + 8);
    } else if (ua.indexOf('Edge') > -1) {
      browser = 'Edge';
      version = ua.substring(ua.indexOf('Edge') + 5);
    }

    return { browser, version };
  }

  trackPageView() {
    const pageView = {
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      pageTitle: document.title,
      referrer: document.referrer || 'direct',
      url: window.location.href,
      duration: 0,
      scrollDepth: 0,
      timeOnPage: 0
    };

    this.pageData.pages.push(pageView);
    this.sendAnalytics();
  }

  trackEvent(eventName, eventData = {}) {
    const event = {
      timestamp: new Date().toISOString(),
      eventName: eventName,
      page: window.location.pathname,
      data: eventData,
      scrollDepth: this.getScrollDepth()
    };

    this.pageData.events.push(event);
    console.log('[Analytics Event]', event);
  }

  trackClickEvent(element, elementType) {
    this.trackEvent('element_click', {
      elementType: elementType,
      elementText: element.textContent?.substring(0, 50),
      elementId: element.id || 'no-id',
      elementClass: element.className || 'no-class'
    });
  }

  trackFormSubmit(formName) {
    this.trackEvent('form_submit', {
      formName: formName,
      timestamp: new Date().toISOString()
    });
  }

  trackScroll() {
    const scrollDepth = this.getScrollDepth();
    if (scrollDepth % 25 === 0 && scrollDepth > 0) {
      this.trackEvent('scroll_depth', { depth: scrollDepth });
    }
  }

  getScrollDepth() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const totalScroll = scrollTop + windowHeight;
    return Math.round((totalScroll / documentHeight) * 100);
  }

  trackTimeOnPage() {
    if (this.pageData.pages.length > 0) {
      const lastPage = this.pageData.pages[this.pageData.pages.length - 1];
      const startTime = new Date(lastPage.timestamp).getTime();
      const currentTime = new Date().getTime();
      lastPage.timeOnPage = Math.round((currentTime - startTime) / 1000); // en secondes
    }
  }

  trackVideoInteraction(videoTitle, action) {
    this.trackEvent('video_interaction', {
      videoTitle: videoTitle,
      action: action // play, pause, complete
    });
  }

  trackLinkClick(linkUrl, linkText) {
    this.trackEvent('link_click', {
      linkUrl: linkUrl,
      linkText: linkText
    });
  }

  trackPortfolioFilter(filterName) {
    this.trackEvent('portfolio_filter', {
      filter: filterName
    });
  }

  sendAnalytics() {
    const analyticsPayload = {
      ...this.pageData,
      endTime: new Date().toISOString(),
      totalEvents: this.pageData.events.length,
      totalPages: this.pageData.pages.length
    };

    // Envoyer via beacon pour fiabilité
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', JSON.stringify(analyticsPayload));
    } else {
      // Fallback fetch
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(analyticsPayload),
        keepalive: true
      }).catch(err => console.error('Analytics send failed:', err));
    }
  }

  initializeTracking() {
    // Track page view
    this.trackPageView();

    // Track scrolling
    window.addEventListener('scroll', () => this.trackScroll(), { passive: true });

    // Track tous les clics
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a, button');
      if (target) {
        if (target.tagName === 'A') {
          this.trackLinkClick(target.href, target.textContent);
        } else if (target.tagName === 'BUTTON') {
          this.trackClickEvent(target, 'button');
        }
      }
    });

    // Track tous les formulaires
    document.addEventListener('submit', (e) => {
      const form = e.target;
      this.trackFormSubmit(form.name || form.id || 'unnamed-form');
    });

    // Track time on page avant navigation
    window.addEventListener('beforeunload', () => {
      this.trackTimeOnPage();
      this.sendAnalytics();
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('page_hidden');
        this.sendAnalytics();
      } else {
        this.trackEvent('page_visible');
      }
    });

    // Envoyer les analytics toutes les 30 secondes
    setInterval(() => {
      this.trackTimeOnPage();
      this.sendAnalytics();
    }, 30000);

    console.log('[Analytics Initialized]', {
      sessionId: this.sessionId,
      page: window.location.pathname
    });
  }
}

// Initialiser l'analytics au chargement du document
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.analytics = new PageAnalytics();
  });
} else {
  window.analytics = new PageAnalytics();
}
