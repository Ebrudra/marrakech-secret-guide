import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Crown, Star, MapPin, Calendar, Download, Zap, Lock, Check } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface PremiumPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  features: string[];
  popular?: boolean;
}

interface PremiumFeaturesProps {
  language: 'fr' | 'en';
  userPlan?: 'free' | 'premium' | 'vip';
}

const translations = {
  fr: {
    title: "Fonctionnalités Premium",
    subtitle: "Débloquez l'expérience complète de Marrakech",
    currentPlan: "Plan actuel",
    upgrade: "Passer au Premium",
    features: "Fonctionnalités",
    popular: "Populaire",
    free: "Gratuit",
    premium: "Premium",
    vip: "VIP",
    perMonth: "/mois",
    perYear: "/an",
    save: "Économisez",
    unlockFeature: "Débloquer cette fonctionnalité",
    premiumOnly: "Premium uniquement",
    comingSoon: "Bientôt disponible",
    subscribed: "Abonné",
    freeFeatures: [
      "Accès au guide complet",
      "Recherche et filtres de base",
      "Favoris (jusqu'à 10)",
      "Mode hors ligne limité"
    ],
    premiumFeatures: [
      "Favoris illimités",
      "Itinéraires IA personnalisés",
      "Notifications push avancées",
      "Mode hors ligne complet",
      "Accès prioritaire aux nouveautés",
      "Support client prioritaire",
      "Réductions partenaires exclusives",
      "Cartes détaillées hors ligne"
    ],
    vipFeatures: [
      "Toutes les fonctionnalités Premium",
      "Concierge personnel virtuel",
      "Réservations prioritaires",
      "Accès VIP aux événements",
      "Guide privé sur demande",
      "Transferts aéroport inclus",
      "Surclassements hôtels gratuits",
      "Support 24/7 dédié"
    ]
  },
  en: {
    title: "Premium Features",
    subtitle: "Unlock the complete Marrakech experience",
    currentPlan: "Current plan",
    upgrade: "Upgrade to Premium",
    features: "Features",
    popular: "Popular",
    free: "Free",
    premium: "Premium",
    vip: "VIP",
    perMonth: "/month",
    perYear: "/year",
    save: "Save",
    unlockFeature: "Unlock this feature",
    premiumOnly: "Premium only",
    comingSoon: "Coming soon",
    subscribed: "Subscribed",
    freeFeatures: [
      "Complete guide access",
      "Basic search and filters",
      "Favorites (up to 10)",
      "Limited offline mode"
    ],
    premiumFeatures: [
      "Unlimited favorites",
      "Personalized AI itineraries",
      "Advanced push notifications",
      "Complete offline mode",
      "Priority access to new features",
      "Priority customer support",
      "Exclusive partner discounts",
      "Detailed offline maps"
    ],
    vipFeatures: [
      "All Premium features",
      "Virtual personal concierge",
      "Priority reservations",
      "VIP event access",
      "Private guide on demand",
      "Airport transfers included",
      "Free hotel upgrades",
      "24/7 dedicated support"
    ]
  }
};

const premiumPlans: PremiumPlan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    period: 'month',
    features: [
      "Accès au guide complet",
      "Recherche et filtres de base",
      "Favoris (jusqu'à 10)",
      "Mode hors ligne limité"
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    period: 'month',
    popular: true,
    features: [
      "Favoris illimités",
      "Itinéraires IA personnalisés",
      "Notifications push avancées",
      "Mode hors ligne complet",
      "Accès prioritaire aux nouveautés",
      "Support client prioritaire",
      "Réductions partenaires exclusives",
      "Cartes détaillées hors ligne"
    ]
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 29.99,
    period: 'month',
    features: [
      "Toutes les fonctionnalités Premium",
      "Concierge personnel virtuel",
      "Réservations prioritaires",
      "Accès VIP aux événements",
      "Guide privé sur demande",
      "Transferts aéroport inclus",
      "Surclassements hôtels gratuits",
      "Support 24/7 dédié"
    ]
  }
];

export default function PremiumFeatures({ language, userPlan = 'free' }: PremiumFeaturesProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(userPlan);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const t = translations[language];

  useEffect(() => {
    // Load user's current plan
    const savedPlan = localStorage.getItem('marrakech-user-plan') || 'free';
    setSelectedPlan(savedPlan);
  }, []);

  const handleUpgrade = (planId: string) => {
    // In a real app, this would integrate with a payment processor
    localStorage.setItem('marrakech-user-plan', planId);
    setSelectedPlan(planId);
    setIsUpgradeModalOpen(false);
    toast(`Félicitations ! Vous êtes maintenant abonné au plan ${planId.toUpperCase()}`);
  };

  const isPremiumFeature = (feature: string) => {
    return !t.freeFeatures.includes(feature);
  };

  const canAccessFeature = (feature: string) => {
    if (selectedPlan === 'free') {
      return t.freeFeatures.includes(feature);
    }
    if (selectedPlan === 'premium') {
      return !t.vipFeatures.includes(feature) || t.premiumFeatures.includes(feature);
    }
    return true; // VIP has access to everything
  };

  const renderPlanCard = (plan: PremiumPlan) => {
    const isCurrentPlan = selectedPlan === plan.id;
    const yearlyPrice = plan.price * 12 * 0.8; // 20% discount for yearly

    return (
      <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''} ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground">
              {t.popular}
            </Badge>
          </div>
        )}
        
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {plan.id === 'vip' && <Crown className="h-5 w-5 text-yellow-500" />}
            {plan.id === 'premium' && <Star className="h-5 w-5 text-primary" />}
            {plan.name}
          </CardTitle>
          
          <div className="text-3xl font-bold">
            {plan.price === 0 ? (
              <span>{t.free}</span>
            ) : (
              <div>
                <span>{plan.price}€</span>
                <span className="text-sm text-muted-foreground">{t.perMonth}</span>
                <div className="text-sm text-muted-foreground">
                  ou {yearlyPrice.toFixed(2)}€{t.perYear} ({t.save} 20%)
                </div>
              </div>
            )}
          </div>
          
          {isCurrentPlan && (
            <Badge variant="secondary">{t.currentPlan}</Badge>
          )}
        </CardHeader>
        
        <CardContent>
          <ul className="space-y-2 mb-6">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          
          {!isCurrentPlan && (
            <Button 
              onClick={() => handleUpgrade(plan.id)}
              className="w-full"
              variant={plan.popular ? "default" : "outline"}
            >
              {plan.price === 0 ? 'Gratuit' : `Passer au ${plan.name}`}
            </Button>
          )}
          
          {isCurrentPlan && (
            <Button variant="secondary" className="w-full" disabled>
              {t.subscribed}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderFeatureCard = (title: string, description: string, isPremium: boolean, isVip: boolean = false) => {
    const canAccess = canAccessFeature(title);
    
    return (
      <Card className={`${!canAccess ? 'opacity-60' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold">{title}</h4>
            <div className="flex gap-1">
              {isVip && <Crown className="h-4 w-4 text-yellow-500" />}
              {isPremium && !isVip && <Star className="h-4 w-4 text-primary" />}
              {!canAccess && <Lock className="h-4 w-4 text-muted-foreground" />}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          
          {!canAccess && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Zap className="h-3 w-3" />
              {t.unlockFeature}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Current Plan Status */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                {t.currentPlan}: {selectedPlan.toUpperCase()}
              </h3>
              <p className="text-muted-foreground">
                {selectedPlan === 'free' && 'Accès de base au guide de Marrakech'}
                {selectedPlan === 'premium' && 'Accès complet avec fonctionnalités avancées'}
                {selectedPlan === 'vip' && 'Expérience VIP complète avec concierge'}
              </p>
            </div>
            {selectedPlan === 'free' && (
              <Button onClick={() => setIsUpgradeModalOpen(true)}>
                {t.upgrade}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feature Showcase */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderFeatureCard(
          "Itinéraires IA Personnalisés",
          "Créez des itinéraires sur mesure basés sur vos préférences avec notre IA avancée",
          true
        )}
        
        {renderFeatureCard(
          "Mode Hors Ligne Complet",
          "Téléchargez tout le guide et les cartes pour une utilisation sans connexion",
          true
        )}
        
        {renderFeatureCard(
          "Concierge Virtuel",
          "Assistant personnel 24/7 pour réservations et recommandations exclusives",
          true,
          true
        )}
        
        {renderFeatureCard(
          "Réductions Partenaires",
          "Accès exclusif aux offres et réductions de nos partenaires locaux",
          true
        )}
        
        {renderFeatureCard(
          "Support Prioritaire",
          "Assistance client prioritaire avec temps de réponse garanti",
          true
        )}
        
        {renderFeatureCard(
          "Accès VIP Événements",
          "Invitations exclusives aux événements culturels et festivités locales",
          true,
          true
        )}
      </div>

      {/* Upgrade Modal */}
      <Dialog open={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">{t.upgrade}</DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {premiumPlans.map(renderPlanCard)}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}