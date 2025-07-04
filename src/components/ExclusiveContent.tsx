import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Lock, Star, MapPin, Calendar, Users, Camera, Utensils, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ExclusiveContentProps {
  userPlan: 'free' | 'premium' | 'vip';
  language: 'fr' | 'en';
}

interface ExclusiveActivity {
  id: string;
  title: string;
  description: string;
  location: string;
  price: string;
  duration: string;
  groupSize: string;
  includes: string[];
  exclusivity: 'premium' | 'vip';
  category: string;
  imageUrl: string;
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  availableDates: string[];
  rating: number;
  reviews: number;
}

const exclusiveActivities: ExclusiveActivity[] = [
  {
    id: 'exc-1',
    title: 'Dîner Privé chez une Famille Berbère',
    description: 'Expérience authentique dans une famille berbère traditionnelle avec cuisine maison et histoires locales.',
    location: 'Palmeraie de Marrakech',
    price: '180€ par personne',
    duration: '4 heures',
    groupSize: 'Maximum 6 personnes',
    includes: ['Transport privé', 'Dîner traditionnel', 'Spectacle de musique gnawa', 'Guide culturel'],
    exclusivity: 'premium',
    category: 'Expériences Culturelles',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    contactInfo: {
      name: 'Fatima Amellal',
      phone: '+212 661 234 567',
      email: 'fatima@berberfamily.ma'
    },
    availableDates: ['2024-03-15', '2024-03-22', '2024-03-29'],
    rating: 4.9,
    reviews: 47
  },
  {
    id: 'exc-2',
    title: 'Atelier de Poterie avec Maître Artisan',
    description: 'Apprenez les techniques ancestrales de la poterie marocaine avec un maître artisan dans son atelier privé.',
    location: 'Quartier des Potiers, Médina',
    price: '120€ par personne',
    duration: '3 heures',
    groupSize: 'Maximum 4 personnes',
    includes: ['Matériel inclus', 'Thé à la menthe', 'Création personnalisée', 'Certificat d\'authenticité'],
    exclusivity: 'premium',
    category: 'Artisanat',
    imageUrl: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=400',
    contactInfo: {
      name: 'Maître Hassan Tamegroute',
      phone: '+212 524 123 456',
      email: 'hassan@poterie-marrakech.ma'
    },
    availableDates: ['2024-03-16', '2024-03-23', '2024-03-30'],
    rating: 4.8,
    reviews: 32
  },
  {
    id: 'exc-3',
    title: 'Hélicoptère Privé - Survol de l\'Atlas',
    description: 'Vol privé en hélicoptère au-dessus des montagnes de l\'Atlas avec atterrissage pour déjeuner berbère.',
    location: 'Aéroport de Marrakech',
    price: '1200€ pour 4 personnes',
    duration: '6 heures',
    groupSize: 'Maximum 4 personnes',
    includes: ['Vol privé', 'Pilote expérimenté', 'Déjeuner berbère', 'Photos professionnelles'],
    exclusivity: 'vip',
    category: 'Expériences VIP',
    imageUrl: 'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=400',
    contactInfo: {
      name: 'Atlas Helicopter Services',
      phone: '+212 524 987 654',
      email: 'vip@atlashelicopter.ma'
    },
    availableDates: ['2024-03-20', '2024-03-27', '2024-04-03'],
    rating: 5.0,
    reviews: 18
  },
  {
    id: 'exc-4',
    title: 'Cours de Cuisine avec Chef Étoilé',
    description: 'Masterclass culinaire avec un chef étoilé dans sa cuisine privée, suivi d\'un dîner gastronomique.',
    location: 'Villa privée, Route de Fès',
    price: '350€ par personne',
    duration: '5 heures',
    groupSize: 'Maximum 8 personnes',
    includes: ['Cours avec chef étoilé', 'Ingrédients premium', 'Dîner gastronomique', 'Recettes exclusives'],
    exclusivity: 'vip',
    category: 'Gastronomie',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    contactInfo: {
      name: 'Chef Moha Fedal',
      phone: '+212 661 987 654',
      email: 'chef@mohafedal.com'
    },
    availableDates: ['2024-03-18', '2024-03-25', '2024-04-01'],
    rating: 4.9,
    reviews: 25
  }
];

const translations = {
  fr: {
    title: "Contenu Exclusif",
    subtitle: "Expériences uniques réservées aux membres Premium et VIP",
    premiumOnly: "Premium uniquement",
    vipOnly: "VIP uniquement",
    unlockContent: "Débloquer ce contenu",
    bookNow: "Réserver maintenant",
    contactInfo: "Informations de contact",
    includes: "Inclus",
    duration: "Durée",
    groupSize: "Taille du groupe",
    availableDates: "Dates disponibles",
    rating: "Note",
    reviews: "avis",
    upgradeRequired: "Mise à niveau requise",
    upgradeMessage: "Cette expérience exclusive nécessite un abonnement",
    cultural: "Expériences Culturelles",
    artisan: "Artisanat",
    vip: "Expériences VIP",
    gastronomy: "Gastronomie",
    secretSpots: "Lieux Secrets",
    secretSpotsDesc: "Découvrez les adresses cachées que seuls les locaux connaissent",
    insiderTips: "Conseils d'Initiés",
    insiderTipsDesc: "Astuces et recommandations exclusives de nos experts locaux",
    vipServices: "Services VIP",
    vipServicesDesc: "Concierge personnel et services sur mesure"
  },
  en: {
    title: "Exclusive Content",
    subtitle: "Unique experiences reserved for Premium and VIP members",
    premiumOnly: "Premium only",
    vipOnly: "VIP only",
    unlockContent: "Unlock this content",
    bookNow: "Book now",
    contactInfo: "Contact information",
    includes: "Includes",
    duration: "Duration",
    groupSize: "Group size",
    availableDates: "Available dates",
    rating: "Rating",
    reviews: "reviews",
    upgradeRequired: "Upgrade required",
    upgradeMessage: "This exclusive experience requires a subscription",
    cultural: "Cultural Experiences",
    artisan: "Artisan Crafts",
    vip: "VIP Experiences",
    gastronomy: "Gastronomy",
    secretSpots: "Secret Spots",
    secretSpotsDesc: "Discover hidden gems that only locals know",
    insiderTips: "Insider Tips",
    insiderTipsDesc: "Exclusive tips and recommendations from our local experts",
    vipServices: "VIP Services",
    vipServicesDesc: "Personal concierge and bespoke services"
  }
};

export default function ExclusiveContent({ userPlan, language }: ExclusiveContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = translations[language];

  const canAccessContent = (exclusivity: 'premium' | 'vip') => {
    if (userPlan === 'free') return false;
    if (userPlan === 'premium' && exclusivity === 'vip') return false;
    return true;
  };

  const getFilteredActivities = () => {
    let filtered = exclusiveActivities;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(activity => activity.category === selectedCategory);
    }
    
    return filtered;
  };

  const handleBooking = (activity: ExclusiveActivity) => {
    if (!canAccessContent(activity.exclusivity)) {
      toast(t.upgradeRequired);
      return;
    }
    
    // In a real app, this would open a booking modal or redirect to booking page
    const message = `Bonjour, je souhaite réserver "${activity.title}" pour ${activity.price}. Merci de me confirmer la disponibilité.`;
    const whatsappUrl = `https://wa.me/${activity.contactInfo.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast(`Redirection vers WhatsApp pour réserver "${activity.title}"`);
  };

  const renderActivityCard = (activity: ExclusiveActivity) => {
    const hasAccess = canAccessContent(activity.exclusivity);
    
    return (
      <Card key={activity.id} className={`relative ${!hasAccess ? 'opacity-60' : ''}`}>
        <div className="relative">
          <img 
            src={activity.imageUrl} 
            alt={activity.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 left-2">
            <Badge className={activity.exclusivity === 'vip' ? 'bg-yellow-500' : 'bg-primary'}>
              {activity.exclusivity === 'vip' ? (
                <>
                  <Crown className="h-3 w-3 mr-1" />
                  {t.vipOnly}
                </>
              ) : (
                <>
                  <Star className="h-3 w-3 mr-1" />
                  {t.premiumOnly}
                </>
              )}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{activity.rating}</span>
              <span className="text-xs">({activity.reviews})</span>
            </div>
          </div>
          {!hasAccess && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
            <p className="text-muted-foreground text-sm mb-3">{activity.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{activity.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{activity.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>{activity.groupSize}</span>
              </div>
              <div className="text-lg font-bold text-primary">
                {activity.price}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold mb-2">{t.includes}:</h4>
            <div className="flex flex-wrap gap-1">
              {activity.includes.map((item, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          
          {hasAccess ? (
            <div className="space-y-3">
              <div className="text-sm">
                <h4 className="font-semibold mb-1">{t.contactInfo}:</h4>
                <p>{activity.contactInfo.name}</p>
                <p>{activity.contactInfo.phone}</p>
                <p>{activity.contactInfo.email}</p>
              </div>
              
              <Button 
                onClick={() => handleBooking(activity)}
                className="w-full"
              >
                {t.bookNow}
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                {t.upgradeMessage} {activity.exclusivity.toUpperCase()}
              </p>
              <Button variant="outline" className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                {t.unlockContent}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const categories = [
    { id: 'all', label: 'Toutes', icon: Sparkles },
    { id: 'Expériences Culturelles', label: t.cultural, icon: Camera },
    { id: 'Artisanat', label: t.artisan, icon: Star },
    { id: 'Gastronomie', label: t.gastronomy, icon: Utensils },
    { id: 'Expériences VIP', label: t.vip, icon: Crown }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Crown className="h-8 w-8 text-yellow-500" />
          {t.title}
        </h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <Tabs defaultValue="experiences" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="experiences">Expériences</TabsTrigger>
          <TabsTrigger value="secrets">{t.secretSpots}</TabsTrigger>
          <TabsTrigger value="tips">{t.insiderTips}</TabsTrigger>
          <TabsTrigger value="vip">{t.vipServices}</TabsTrigger>
        </TabsList>

        <TabsContent value="experiences" className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <category.icon className="h-4 w-4" />
                {category.label}
              </Button>
            ))}
          </div>

          {/* Activities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredActivities().map(renderActivityCard)}
          </div>
        </TabsContent>

        <TabsContent value="secrets" className="space-y-6">
          <Card className={userPlan === 'free' ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {t.secretSpots}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userPlan === 'free' ? (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">{t.upgradeMessage} Premium</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">🏛️ Riad Caché de la Médina</h4>
                    <p className="text-sm text-muted-foreground">
                      Un riad secret du 16ème siècle, accessible uniquement par une porte dérobée dans les souks.
                      Demandez "Dar Salam" au marchand de tapis Youssef, rue Semmarine.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">🌅 Terrasse Secrète Koutoubia</h4>
                    <p className="text-sm text-muted-foreground">
                      Vue imprenable sur la Koutoubia depuis une terrasse privée. 
                      Contact: Ahmed (+212 661 123 456) - Mot de passe: "Sunset Marrakech"
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">🍃 Jardin Privé Majorelle</h4>
                    <p className="text-sm text-muted-foreground">
                      Accès privé au jardin Majorelle avant l'ouverture publique (8h-9h).
                      Réservation: jardin.prive@majorelle.ma - 50€/personne
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <Card className={userPlan === 'free' ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {t.insiderTips}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userPlan === 'free' ? (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">{t.upgradeMessage} Premium</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-semibold mb-2">💰 Négociation dans les Souks</h4>
                    <p className="text-sm">
                      Commencez toujours à 30% du prix demandé. Utilisez la phrase magique: 
                      "Ana saken f'Marrakech" (je vis à Marrakech) pour obtenir le prix local.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-green-50">
                    <h4 className="font-semibold mb-2">🚗 Transport Local</h4>
                    <p className="text-sm">
                      Téléchargez l'app "Careem" pour des prix fixes. 
                      Pour les taxis, insistez sur le compteur ou négociez avant de monter.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <h4 className="font-semibold mb-2">🍽️ Restaurants Locaux</h4>
                    <p className="text-sm">
                      Les meilleurs restaurants n'ont pas d'enseigne. Suivez les locaux vers 13h30 
                      pour découvrir les vrais trésors culinaires.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vip" className="space-y-6">
          <Card className={userPlan !== 'vip' ? 'opacity-60' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                {t.vipServices}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userPlan !== 'vip' ? (
                <div className="text-center py-8">
                  <Crown className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                  <p className="text-muted-foreground">{t.upgradeMessage} VIP</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Concierge Personnel 24/7
                    </h4>
                    <p className="text-sm mb-3">
                      Votre assistant personnel dédié pour toutes vos demandes à Marrakech.
                    </p>
                    <Button size="sm">
                      Contacter mon concierge
                    </Button>
                  </div>
                  
                  <div className="p-6 border rounded-lg">
                    <h4 className="font-semibold mb-3">🚁 Transferts VIP</h4>
                    <p className="text-sm mb-3">
                      Transferts en hélicoptère depuis l'aéroport inclus dans votre abonnement VIP.
                    </p>
                    <Button variant="outline" size="sm">
                      Réserver un transfert
                    </Button>
                  </div>
                  
                  <div className="p-6 border rounded-lg">
                    <h4 className="font-semibold mb-3">🏨 Surclassements Gratuits</h4>
                    <p className="text-sm mb-3">
                      Surclassements automatiques dans nos hôtels partenaires premium.
                    </p>
                    <Button variant="outline" size="sm">
                      Voir les partenaires
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}