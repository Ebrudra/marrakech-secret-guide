// SEO utilities for better search engine optimization
// This helps with organic traffic which is valuable for ad monetization

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: any;
}

class SEOManager {
  private defaultMetadata: SEOMetadata = {
    title: "Guide de Marrakech - Découvrez la Ville Rouge",
    description: "Guide curated des meilleures adresses de Marrakech : restaurants, spas, activités culturelles et boutiques authentiques.",
    keywords: ["marrakech", "guide", "voyage", "maroc", "restaurants", "activités", "culture", "médina"],
    ogImage: "/assets/marrakech-hero.jpg"
  };

  updatePageMetadata(metadata: Partial<SEOMetadata>) {
    const fullMetadata = { ...this.defaultMetadata, ...metadata };
    
    // Update document title
    document.title = fullMetadata.title;
    
    // Update meta description
    this.updateMetaTag('description', fullMetadata.description);
    
    // Update keywords
    this.updateMetaTag('keywords', fullMetadata.keywords.join(', '));
    
    // Update Open Graph tags
    this.updateMetaTag('og:title', fullMetadata.ogTitle || fullMetadata.title);
    this.updateMetaTag('og:description', fullMetadata.ogDescription || fullMetadata.description);
    this.updateMetaTag('og:image', fullMetadata.ogImage || this.defaultMetadata.ogImage);
    
    // Update Twitter Card tags
    this.updateMetaTag('twitter:title', fullMetadata.ogTitle || fullMetadata.title);
    this.updateMetaTag('twitter:description', fullMetadata.ogDescription || fullMetadata.description);
    this.updateMetaTag('twitter:image', fullMetadata.ogImage || this.defaultMetadata.ogImage);
    
    // Update canonical URL
    if (fullMetadata.canonicalUrl) {
      this.updateCanonicalUrl(fullMetadata.canonicalUrl);
    }
    
    // Add structured data
    if (fullMetadata.structuredData) {
      this.addStructuredData(fullMetadata.structuredData);
    }
  }

  private updateMetaTag(property: string, content: string) {
    let element = document.querySelector(`meta[property="${property}"]`) || 
                  document.querySelector(`meta[name="${property}"]`);
    
    if (!element) {
      element = document.createElement('meta');
      if (property.startsWith('og:') || property.startsWith('twitter:')) {
        element.setAttribute('property', property);
      } else {
        element.setAttribute('name', property);
      }
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  }

  private updateCanonicalUrl(url: string) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    
    canonical.href = url;
  }

  private addStructuredData(data: any) {
    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
      existing.remove();
    }
    
    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // Generate structured data for activities
  generateActivityStructuredData(activity: any, category: string) {
    const baseUrl = window.location.origin;
    
    return {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": activity.Activité,
      "description": activity.Commentaires,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": activity.Adresse,
        "addressLocality": "Marrakech",
        "addressCountry": "MA"
      },
      "telephone": activity["Tél."],
      "url": `${baseUrl}?activity=${encodeURIComponent(activity.Activité)}`,
      "category": category,
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "31.6295",
        "longitude": "-7.9811"
      },
      "touristType": ["Cultural", "Leisure", "Adventure"],
      "isAccessibleForFree": activity.Réservation?.toLowerCase().includes('gratuit') || false
    };
  }

  // Generate structured data for the main guide
  generateGuideStructuredData() {
    const baseUrl = window.location.origin;
    
    return {
      "@context": "https://schema.org",
      "@type": "TravelGuide",
      "name": "Guide de Marrakech",
      "description": "Guide curated des meilleures adresses de Marrakech",
      "url": baseUrl,
      "about": {
        "@type": "City",
        "name": "Marrakech",
        "alternateName": "Marrakesh",
        "description": "Ville impériale du Maroc",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "31.6295",
          "longitude": "-7.9811"
        }
      },
      "author": {
        "@type": "Organization",
        "name": "Guide de Marrakech"
      },
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "inLanguage": ["fr", "en"],
      "audience": {
        "@type": "Audience",
        "audienceType": "Tourists"
      }
    };
  }

  // Update SEO for category pages
  updateCategoryPageSEO(category: string, language: 'fr' | 'en') {
    const categoryTranslations = {
      fr: {
        "Culture & Musées": {
          title: "Culture & Musées à Marrakech - Guide des Meilleures Visites",
          description: "Découvrez les musées incontournables de Marrakech : Jardin Majorelle, Musée YSL, Palais Bahia et plus encore.",
          keywords: ["musées marrakech", "culture marrakech", "jardin majorelle", "palais bahia", "art marrakech"]
        },
        "Se sustenter & Apéros & Tea Time": {
          title: "Restaurants et Bars à Marrakech - Guide Gastronomique",
          description: "Les meilleurs restaurants, rooftops et bars de Marrakech. Cuisine marocaine authentique et internationale.",
          keywords: ["restaurants marrakech", "rooftop marrakech", "cuisine marocaine", "bars marrakech", "gastronomie"]
        }
      },
      en: {
        "Culture & Museums": {
          title: "Culture & Museums in Marrakech - Best Visits Guide",
          description: "Discover Marrakech's must-see museums: Majorelle Garden, YSL Museum, Bahia Palace and more.",
          keywords: ["marrakech museums", "marrakech culture", "majorelle garden", "bahia palace", "marrakech art"]
        },
        "Food & Drinks & Tea Time": {
          title: "Restaurants and Bars in Marrakech - Gastronomic Guide",
          description: "The best restaurants, rooftops and bars in Marrakech. Authentic Moroccan and international cuisine.",
          keywords: ["marrakech restaurants", "marrakech rooftop", "moroccan cuisine", "marrakech bars", "gastronomy"]
        }
      }
    };

    const categoryData = categoryTranslations[language]?.[category as keyof typeof categoryTranslations[typeof language]];
    
    if (categoryData) {
      this.updatePageMetadata({
        title: categoryData.title,
        description: categoryData.description,
        keywords: categoryData.keywords,
        canonicalUrl: `${window.location.origin}?category=${encodeURIComponent(category)}`
      });
    }
  }

  // Update SEO for activity detail pages
  updateActivityPageSEO(activity: any, language: 'fr' | 'en') {
    const title = language === 'fr' 
      ? `${activity.Activité} - Guide Marrakech`
      : `${activity.Activité} - Marrakech Guide`;
    
    const description = activity.Commentaires.length > 150 
      ? activity.Commentaires.substring(0, 150) + '...'
      : activity.Commentaires;

    this.updatePageMetadata({
      title,
      description,
      keywords: [activity.Activité, activity.Thématique, "marrakech", "guide", "voyage"],
      canonicalUrl: `${window.location.origin}?activity=${encodeURIComponent(activity.Activité)}`,
      structuredData: this.generateActivityStructuredData(activity, activity.Thématique)
    });
  }

  // Generate sitemap data (for server-side generation)
  generateSitemapData(activities: any[]) {
    const baseUrl = window.location.origin;
    const urls = [
      {
        url: baseUrl,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '1.0'
      }
    ];

    // Add category pages
    const categories = [...new Set(activities.map(a => a.Thématique))];
    categories.forEach(category => {
      urls.push({
        url: `${baseUrl}?category=${encodeURIComponent(category)}`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.8'
      });
    });

    // Add activity pages
    activities.forEach(activity => {
      urls.push({
        url: `${baseUrl}?activity=${encodeURIComponent(activity.Activité)}`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.6'
      });
    });

    return urls;
  }
}

export const seoManager = new SEOManager();