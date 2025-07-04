// Analytics utility for tracking user interactions
// This will help with monetization by providing valuable data to advertisers

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

class Analytics {
  private isEnabled: boolean = true;
  private userId: string;

  constructor() {
    // Generate or retrieve user ID for session tracking
    this.userId = this.getOrCreateUserId();
    this.initializeAnalytics();
  }

  private getOrCreateUserId(): string {
    let userId = localStorage.getItem('marrakech-user-id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('marrakech-user-id', userId);
    }
    return userId;
  }

  private initializeAnalytics() {
    // Initialize Google Analytics 4 if gtag is available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: this.userId,
        custom_map: {
          custom_user_type: 'tourist'
        }
      });
    }
  }

  // Track page views
  trackPageView(page: string, title?: string) {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      event: 'page_view',
      category: 'navigation',
      action: 'page_view',
      label: page,
      custom_parameters: {
        page_title: title,
        user_id: this.userId,
        timestamp: new Date().toISOString()
      }
    };

    this.sendEvent(event);
  }

  // Track category selections
  trackCategorySelection(category: string) {
    const event: AnalyticsEvent = {
      event: 'category_selection',
      category: 'user_interaction',
      action: 'select_category',
      label: category,
      custom_parameters: {
        category_name: category,
        user_id: this.userId
      }
    };

    this.sendEvent(event);
  }

  // Track activity views
  trackActivityView(activityName: string, category: string) {
    const event: AnalyticsEvent = {
      event: 'activity_view',
      category: 'content_engagement',
      action: 'view_activity',
      label: activityName,
      custom_parameters: {
        activity_name: activityName,
        activity_category: category,
        user_id: this.userId
      }
    };

    this.sendEvent(event);
  }

  // Track search queries
  trackSearch(query: string, resultsCount: number) {
    const event: AnalyticsEvent = {
      event: 'search',
      category: 'user_interaction',
      action: 'search',
      label: query,
      value: resultsCount,
      custom_parameters: {
        search_term: query,
        results_count: resultsCount,
        user_id: this.userId
      }
    };

    this.sendEvent(event);
  }

  // Track favorites
  trackFavoriteAction(activityName: string, action: 'add' | 'remove') {
    const event: AnalyticsEvent = {
      event: 'favorite_action',
      category: 'user_engagement',
      action: `${action}_favorite`,
      label: activityName,
      custom_parameters: {
        activity_name: activityName,
        action_type: action,
        user_id: this.userId
      }
    };

    this.sendEvent(event);
  }

  // Track external link clicks (important for affiliate tracking)
  trackExternalClick(url: string, activityName: string, linkType: 'phone' | 'maps' | 'website') {
    const event: AnalyticsEvent = {
      event: 'external_click',
      category: 'conversion',
      action: `click_${linkType}`,
      label: activityName,
      custom_parameters: {
        destination_url: url,
        activity_name: activityName,
        link_type: linkType,
        user_id: this.userId
      }
    };

    this.sendEvent(event);
  }

  // Track AI itinerary generation
  trackAIItinerary(preferences: string, generatedItems: number) {
    const event: AnalyticsEvent = {
      event: 'ai_itinerary_generated',
      category: 'ai_interaction',
      action: 'generate_itinerary',
      value: generatedItems,
      custom_parameters: {
        preferences_length: preferences.length,
        items_generated: generatedItems,
        user_id: this.userId
      }
    };

    this.sendEvent(event);
  }

  // Track time spent on categories (for ad optimization)
  trackTimeSpent(category: string, timeInSeconds: number) {
    const event: AnalyticsEvent = {
      event: 'time_spent',
      category: 'engagement',
      action: 'time_on_category',
      label: category,
      value: timeInSeconds,
      custom_parameters: {
        category_name: category,
        time_seconds: timeInSeconds,
        user_id: this.userId
      }
    };

    this.sendEvent(event);
  }

  // Track filter usage
  trackFilterUsage(filterType: string, filterValue: string) {
    const event: AnalyticsEvent = {
      event: 'filter_usage',
      category: 'user_interaction',
      action: 'apply_filter',
      label: `${filterType}:${filterValue}`,
      custom_parameters: {
        filter_type: filterType,
        filter_value: filterValue,
        user_id: this.userId
      }
    };

    this.sendEvent(event);
  }

  private sendEvent(event: AnalyticsEvent) {
    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.event, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }

    // Also store locally for debugging and backup
    if (typeof window !== 'undefined') {
      const events = JSON.parse(localStorage.getItem('marrakech-analytics-events') || '[]');
      events.push({
        ...event,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 100 events to avoid storage bloat
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('marrakech-analytics-events', JSON.stringify(events));
    }

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event);
    }
  }

  // Get user engagement metrics for ad optimization
  getUserEngagementMetrics() {
    const events = JSON.parse(localStorage.getItem('marrakech-analytics-events') || '[]');
    const favorites = JSON.parse(localStorage.getItem('marrakech-favorites') || '[]');
    const itineraries = JSON.parse(localStorage.getItem('marrakech-saved-itineraries') || '[]');

    return {
      totalEvents: events.length,
      favoriteCount: favorites.length,
      savedItineraries: itineraries.length,
      mostViewedCategories: this.getMostViewedCategories(events),
      searchQueries: this.getSearchQueries(events),
      userId: this.userId
    };
  }

  private getMostViewedCategories(events: any[]) {
    const categoryViews = events
      .filter(e => e.event === 'category_selection')
      .reduce((acc, event) => {
        const category = event.label;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

    return Object.entries(categoryViews)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5);
  }

  private getSearchQueries(events: any[]) {
    return events
      .filter(e => e.event === 'search')
      .map(e => e.label)
      .slice(-10); // Last 10 searches
  }

  // Disable analytics (for privacy compliance)
  disable() {
    this.isEnabled = false;
  }

  // Enable analytics
  enable() {
    this.isEnabled = true;
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Helper function to track common interactions
export const trackInteraction = {
  categorySelect: (category: string) => analytics.trackCategorySelection(category),
  activityView: (activity: string, category: string) => analytics.trackActivityView(activity, category),
  search: (query: string, results: number) => analytics.trackSearch(query, results),
  favorite: (activity: string, action: 'add' | 'remove') => analytics.trackFavoriteAction(activity, action),
  externalClick: (url: string, activity: string, type: 'phone' | 'maps' | 'website') => 
    analytics.trackExternalClick(url, activity, type),
  aiItinerary: (preferences: string, items: number) => analytics.trackAIItinerary(preferences, items),
  timeSpent: (category: string, seconds: number) => analytics.trackTimeSpent(category, seconds),
  filterUse: (type: string, value: string) => analytics.trackFilterUsage(type, value)
};