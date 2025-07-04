import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ExternalLink, MapPin, Star, Clock } from "lucide-react";
import { analytics } from "@/lib/analytics";

interface Ad {
  id: string;
  type: 'banner' | 'native' | 'sponsored';
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  targetUrl: string;
  category: string;
  location?: string;
  rating?: number;
  price?: string;
  sponsored: boolean;
}

interface AdManagerProps {
  placement: 'header' | 'sidebar' | 'content' | 'footer';
  category?: string;
  userPreferences?: string[];
  className?: string;
}

// Mock ad data - in production, this would come from an ad server
const mockAds: Ad[] = [
  {
    id: 'ad-1',
    type: 'native',
    title: 'Riad Yasmine - Séjour Authentique',
    description: 'Découvrez le charme traditionnel de Marrakech dans notre riad de luxe au cœur de la médina.',
    imageUrl: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=400',
    ctaText: 'Réserver maintenant',
    targetUrl: 'https://booking.com/riad-yasmine',
    category: 'Hébergement',
    location: 'Médina',
    rating: 4.8,
    price: 'À partir de 120€',
    sponsored: true
  },
  {
    id: 'ad-2',
    type: 'banner',
    title: 'Excursion Atlas - 20% de réduction',
    description: 'Explorez les montagnes de l\'Atlas avec nos guides experts. Offre limitée !',
    imageUrl: 'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=400',
    ctaText: 'Découvrir l\'offre',
    targetUrl: 'https://atlas-excursions.com/promo',
    category: 'Excursions',
    sponsored: true
  },
  {
    id: 'ad-3',
    type: 'sponsored',
    title: 'Restaurant Al Fassia',
    description: 'Cuisine marocaine authentique tenue par des femmes. Une expérience culinaire unique.',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    ctaText: 'Voir le menu',
    targetUrl: 'https://alfassia-restaurant.com',
    category: 'Se sustenter & Apéros & Tea Time',
    location: 'Guéliz',
    rating: 4.6,
    sponsored: true
  },
  {
    id: 'ad-4',
    type: 'native',
    title: 'Hammam & Spa Traditionnel',
    description: 'Détendez-vous dans notre spa authentique avec soins traditionnels marocains.',
    imageUrl: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=400',
    ctaText: 'Réserver un soin',
    targetUrl: 'https://spa-marrakech.com/booking',
    category: 'Bien-être & détente',
    rating: 4.9,
    price: 'À partir de 45€',
    sponsored: true
  }
];

export default function AdManager({ placement, category, userPreferences = [], className = "" }: AdManagerProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [dismissedAds, setDismissedAds] = useState<string[]>([]);

  useEffect(() => {
    loadAds();
  }, [placement, category, userPreferences]);

  const loadAds = () => {
    // Filter ads based on placement, category, and user preferences
    let filteredAds = mockAds.filter(ad => !dismissedAds.includes(ad.id));

    // Category-based filtering
    if (category) {
      filteredAds = filteredAds.filter(ad => 
        ad.category === category || 
        userPreferences.includes(ad.category)
      );
    }

    // Placement-based filtering
    switch (placement) {
      case 'header':
        filteredAds = filteredAds.filter(ad => ad.type === 'banner').slice(0, 1);
        break;
      case 'sidebar':
        filteredAds = filteredAds.filter(ad => ad.type === 'native').slice(0, 2);
        break;
      case 'content':
        filteredAds = filteredAds.filter(ad => ad.type === 'sponsored').slice(0, 1);
        break;
      case 'footer':
        filteredAds = filteredAds.slice(0, 3);
        break;
    }

    setAds(filteredAds);
  };

  const handleAdClick = (ad: Ad) => {
    // Track ad click for analytics
    analytics.trackExternalClick(ad.targetUrl, ad.title, 'website');
    
    // Track ad performance
    const adEvent = {
      ad_id: ad.id,
      ad_type: ad.type,
      placement: placement,
      category: ad.category,
      user_preferences: userPreferences
    };
    
    // Store ad interaction data
    const interactions = JSON.parse(localStorage.getItem('marrakech-ad-interactions') || '[]');
    interactions.push({
      ...adEvent,
      timestamp: new Date().toISOString(),
      action: 'click'
    });
    localStorage.setItem('marrakech-ad-interactions', JSON.stringify(interactions));

    // Open ad link
    window.open(ad.targetUrl, '_blank');
  };

  const dismissAd = (adId: string) => {
    const newDismissed = [...dismissedAds, adId];
    setDismissedAds(newDismissed);
    localStorage.setItem('marrakech-dismissed-ads', JSON.stringify(newDismissed));
    
    // Track ad dismissal
    const interactions = JSON.parse(localStorage.getItem('marrakech-ad-interactions') || '[]');
    interactions.push({
      ad_id: adId,
      placement: placement,
      timestamp: new Date().toISOString(),
      action: 'dismiss'
    });
    localStorage.setItem('marrakech-ad-interactions', JSON.stringify(interactions));
  };

  const renderBannerAd = (ad: Ad) => (
    <div className={`relative bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg overflow-hidden ${className}`}>
      <div className="flex items-center p-4">
        <img 
          src={ad.imageUrl} 
          alt={ad.title}
          className="w-16 h-16 rounded-lg object-cover mr-4"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-foreground">{ad.title}</h4>
            {ad.sponsored && <Badge variant="outline" className="text-xs">Sponsorisé</Badge>}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{ad.description}</p>
          <Button 
            size="sm" 
            onClick={() => handleAdClick(ad)}
            className="flex items-center gap-1"
          >
            {ad.ctaText}
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dismissAd(ad.id)}
          className="absolute top-2 right-2 h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  const renderNativeAd = (ad: Ad) => (
    <Card className={`cursor-pointer hover:shadow-lg transition-shadow ${className}`}>
      <div className="relative">
        <img 
          src={ad.imageUrl} 
          alt={ad.title}
          className="w-full h-32 object-cover rounded-t-lg"
        />
        {ad.sponsored && (
          <Badge className="absolute top-2 left-2 text-xs">Sponsorisé</Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            dismissAd(ad.id);
          }}
          className="absolute top-2 right-2 h-6 w-6 p-0 bg-black/20 hover:bg-black/40"
        >
          <X className="h-3 w-3 text-white" />
        </Button>
      </div>
      <CardContent className="p-4" onClick={() => handleAdClick(ad)}>
        <h4 className="font-semibold mb-2">{ad.title}</h4>
        <p className="text-sm text-muted-foreground mb-3">{ad.description}</p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          {ad.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {ad.location}
            </div>
          )}
          {ad.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {ad.rating}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          {ad.price && (
            <span className="text-sm font-medium text-primary">{ad.price}</span>
          )}
          <Button size="sm" className="ml-auto">
            {ad.ctaText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSponsoredAd = (ad: Ad) => (
    <div className={`border-l-4 border-primary/30 bg-muted/30 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <img 
          src={ad.imageUrl} 
          alt={ad.title}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground">{ad.title}</h4>
            <Badge variant="secondary" className="text-xs">Sponsorisé</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{ad.description}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAdClick(ad)}
            className="flex items-center gap-1"
          >
            {ad.ctaText}
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dismissAd(ad.id)}
          className="h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  if (ads.length === 0) return null;

  return (
    <div className="space-y-4">
      {ads.map(ad => {
        switch (ad.type) {
          case 'banner':
            return <div key={ad.id}>{renderBannerAd(ad)}</div>;
          case 'native':
            return <div key={ad.id}>{renderNativeAd(ad)}</div>;
          case 'sponsored':
            return <div key={ad.id}>{renderSponsoredAd(ad)}</div>;
          default:
            return null;
        }
      })}
    </div>
  );
}