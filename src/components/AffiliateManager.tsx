import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star, MapPin, Phone, Calendar, Gift } from "lucide-react";
import { analytics } from "@/lib/analytics";

interface AffiliateOffer {
  id: string;
  partner: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  category: string;
  location: string;
  rating: number;
  imageUrl: string;
  affiliateUrl: string;
  commission: number;
  validUntil: string;
  features: string[];
}

interface AffiliateManagerProps {
  category?: string;
  activityName?: string;
  userPreferences?: string[];
  placement: 'activity-detail' | 'category-list' | 'sidebar' | 'recommendations';
}

// Mock affiliate offers - in production, these would come from affiliate networks
const mockOffers: AffiliateOffer[] = [
  {
    id: 'aff-1',
    partner: 'Booking.com',
    title: 'Riad Kniza - Hébergement de Luxe',
    description: 'Séjournez dans un riad authentique au cœur de la médina avec petit-déjeuner inclus.',
    originalPrice: 180,
    discountedPrice: 144,
    discount: 20,
    category: 'Hébergement',
    location: 'Médina',
    rating: 4.7,
    imageUrl: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=400',
    affiliateUrl: 'https://booking.com/riad-kniza?aid=marrakech-guide',
    commission: 8,
    validUntil: '2024-12-31',
    features: ['Petit-déjeuner inclus', 'WiFi gratuit', 'Piscine', 'Spa']
  },
  {
    id: 'aff-2',
    partner: 'GetYourGuide',
    title: 'Visite Guidée des Souks + Déjeuner',
    description: 'Explorez les souks traditionnels avec un guide local et savourez un déjeuner authentique.',
    originalPrice: 45,
    discountedPrice: 36,
    discount: 20,
    category: 'Visites & découvertes',
    location: 'Médina',
    rating: 4.8,
    imageUrl: 'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=400',
    affiliateUrl: 'https://getyourguide.com/marrakech-souks?partner_id=marrakech-guide',
    commission: 12,
    validUntil: '2024-11-30',
    features: ['Guide expert', 'Déjeuner inclus', 'Groupe limité', 'Photos incluses']
  },
  {
    id: 'aff-3',
    partner: 'Viator',
    title: 'Excursion Vallée de l\'Ourika',
    description: 'Découvrez les cascades et villages berbères de la vallée de l\'Ourika.',
    originalPrice: 65,
    discountedPrice: 52,
    discount: 20,
    category: 'Visites & découvertes',
    location: 'Ourika',
    rating: 4.6,
    imageUrl: 'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=400',
    affiliateUrl: 'https://viator.com/ourika-valley?mcid=marrakech-guide',
    commission: 10,
    validUntil: '2024-12-15',
    features: ['Transport inclus', 'Guide berbère', 'Déjeuner traditionnel', 'Randonnée facile']
  },
  {
    id: 'aff-4',
    partner: 'Spa Finder',
    title: 'Hammam & Massage Traditionnel',
    description: 'Expérience spa authentique avec hammam, gommage et massage aux huiles d\'argan.',
    originalPrice: 80,
    discountedPrice: 60,
    discount: 25,
    category: 'Bien-être & détente',
    location: 'Médina',
    rating: 4.9,
    imageUrl: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=400',
    affiliateUrl: 'https://spafinder.com/marrakech-hammam?ref=marrakech-guide',
    commission: 15,
    validUntil: '2024-12-31',
    features: ['Hammam traditionnel', 'Massage 60min', 'Huile d\'argan', 'Thé à la menthe']
  }
];

export default function AffiliateManager({ category, activityName, userPreferences = [], placement }: AffiliateManagerProps) {
  const [offers, setOffers] = useState<AffiliateOffer[]>([]);
  const [clickedOffers, setClickedOffers] = useState<string[]>([]);

  useEffect(() => {
    loadOffers();
    loadClickHistory();
  }, [category, activityName, userPreferences]);

  const loadOffers = () => {
    let filteredOffers = mockOffers;

    // Filter by category if specified
    if (category) {
      filteredOffers = filteredOffers.filter(offer => 
        offer.category === category || 
        userPreferences.includes(offer.category)
      );
    }

    // Limit based on placement
    switch (placement) {
      case 'activity-detail':
        filteredOffers = filteredOffers.slice(0, 2);
        break;
      case 'category-list':
        filteredOffers = filteredOffers.slice(0, 3);
        break;
      case 'sidebar':
        filteredOffers = filteredOffers.slice(0, 1);
        break;
      case 'recommendations':
        filteredOffers = filteredOffers.slice(0, 4);
        break;
    }

    setOffers(filteredOffers);
  };

  const loadClickHistory = () => {
    const history = JSON.parse(localStorage.getItem('marrakech-affiliate-clicks') || '[]');
    setClickedOffers(history);
  };

  const handleAffiliateClick = (offer: AffiliateOffer) => {
    // Track affiliate click
    analytics.trackExternalClick(offer.affiliateUrl, offer.title, 'website');
    
    // Store affiliate interaction
    const interactions = JSON.parse(localStorage.getItem('marrakech-affiliate-interactions') || '[]');
    interactions.push({
      offer_id: offer.id,
      partner: offer.partner,
      title: offer.title,
      category: offer.category,
      commission: offer.commission,
      placement: placement,
      timestamp: new Date().toISOString(),
      user_preferences: userPreferences
    });
    localStorage.setItem('marrakech-affiliate-interactions', JSON.stringify(interactions));

    // Update click history
    const newClicked = [...clickedOffers, offer.id];
    setClickedOffers(newClicked);
    localStorage.setItem('marrakech-affiliate-clicks', JSON.stringify(newClicked));

    // Open affiliate link
    window.open(offer.affiliateUrl, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const isOfferExpiringSoon = (validUntil: string) => {
    const expiryDate = new Date(validUntil);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7;
  };

  const renderOffer = (offer: AffiliateOffer) => {
    const isClicked = clickedOffers.includes(offer.id);
    const isExpiring = isOfferExpiringSoon(offer.validUntil);

    return (
      <Card key={offer.id} className={`hover:shadow-lg transition-shadow ${isClicked ? 'opacity-75' : ''}`}>
        <div className="relative">
          <img 
            src={offer.imageUrl} 
            alt={offer.title}
            className="w-full h-40 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <Badge className="bg-red-500 text-white">
              -{offer.discount}%
            </Badge>
            {isExpiring && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Expire bientôt
              </Badge>
            )}
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-white/90">
              {offer.partner}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-lg">{offer.title}</h4>
            <div className="text-right">
              <div className="text-sm text-muted-foreground line-through">
                {formatPrice(offer.originalPrice)}
              </div>
              <div className="text-lg font-bold text-primary">
                {formatPrice(offer.discountedPrice)}
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {offer.location}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {offer.rating}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Valide jusqu'au {new Date(offer.validUntil).toLocaleDateString()}
            </div>
          </div>

          {/* Features */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {offer.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {offer.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{offer.features.length - 3}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              onClick={() => handleAffiliateClick(offer)}
              className="flex-1 flex items-center gap-2"
              disabled={isClicked}
            >
              {isClicked ? 'Déjà consulté' : 'Réserver maintenant'}
              <ExternalLink className="h-4 w-4" />
            </Button>
            <div className="text-xs text-muted-foreground">
              <Gift className="h-3 w-3 inline mr-1" />
              {offer.commission}% commission
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (offers.length === 0) return null;

  return (
    <div className="space-y-4">
      {placement === 'recommendations' && (
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Offres Partenaires Recommandées</h3>
          <p className="text-muted-foreground">
            Réservez directement avec nos partenaires de confiance et bénéficiez d'offres exclusives
          </p>
        </div>
      )}
      
      <div className={`grid gap-4 ${
        placement === 'recommendations' ? 'md:grid-cols-2 lg:grid-cols-3' :
        placement === 'category-list' ? 'md:grid-cols-2' :
        'grid-cols-1'
      }`}>
        {offers.map(renderOffer)}
      </div>
    </div>
  );
}