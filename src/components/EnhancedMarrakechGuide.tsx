import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Phone, Clock, Lightbulb, Languages, Menu, X, Search, Filter, Heart, Star, Zap, Crown, TrendingUp } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from './ui/sheet';

// Import all the new components
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import FavoritesManager from './FavoritesManager';
import ActivityDetailModal from './ActivityDetailModal';
import AIItineraryPlanner from './AIItineraryPlanner';
import UserProfileManager from './UserProfileManager';
import NotificationManager from './NotificationManager';
import OfflineManager from './OfflineManager';
import PerformanceOptimizer from './PerformanceOptimizer';
import AdManager from './AdManager';
import AffiliateManager from './AffiliateManager';
import PremiumFeatures from './PremiumFeatures';
import MonetizationDashboard from './MonetizationDashboard';

// Import new premium components
import ExclusiveContent from './ExclusiveContent';
import PersonalizedRecommendations from './PersonalizedRecommendations';
import WeatherIntegration from './WeatherIntegration';
import SocialFeatures from './SocialFeatures';
import AdvancedSearch from './AdvancedSearch';

// Analytics and SEO
import { analytics, trackInteraction } from '@/lib/analytics';
import { seoManager } from '@/lib/seo';

interface Activity {
  "Thématique": string;
  "Activité": string;
  "Adresse": string;
  "Tél.": string;
  "Réservation": string;
  "Commentaires": string;
}

interface EnhancedMarrakechGuideProps {
  language?: string;
}

const guideData = {
  "Guide Touristique": [
    {
      "Thématique": "Visite de la Medina",
      "Activité": "Guide local Abdoul",
      "Adresse": "",
      "Tél.": "212670720118",
      "Réservation": "Appelez de la part de Yann",
      "Commentaires": "Guide expert de la médina, recommandé pour découvrir les secrets de Marrakech"
    }
  ],
  "Culture & Musées": [
    {
      "Thématique": "Culture & Musées",
      "Activité": "Maison de la Photographie",
      "Adresse": "Medina - Rue Ahl Fes, 46 Rue Bin Lafnadek",
      "Tél.": "+212 5243-85721",
      "Réservation": "Non obligatoire, mais conseillé",
      "Commentaires": "Photos historiques et magnifique rooftop avec vue. Horaire : 10h à 19h00"
    },
    {
      "Thématique": "Culture & Musées",
      "Activité": "Musée Yves Saint Laurent + Musée Berbère + Jardin Majorelle",
      "Adresse": "Rue Yves Saint Laurent, Guéliz",
      "Tél.": "+212 5243-13047",
      "Réservation": "Oui, en ligne",
      "Commentaires": "Trio incontournable de Marrakech. Horaire : 10h à 18h30"
    }
  ],
  "Se sustenter & Apéros & Tea Time": [
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Nomad – rooftop moderne (tagines fusion)",
      "Adresse": "1 Derb Aarjane, Médina",
      "Tél.": "+212 524 381 609 / 661 451 519",
      "Réservation": "Oui (groupe ≥ 5)",
      "Commentaires": "Avec sa superbe vue sur une oasis de palmiers et son incroyable coucher de soleil en font l'un des spots les plus prisés de la ville de Marrakech."
    }
  ]
};

const translations = {
  fr: {
    title: "Guide de Marrakech",
    subtitle: "Pour rendre votre séjour inoubliable, nous avons rassemblé une sélection d'adresses testées et approuvées.",
    backToGuide: "Retour au Guide",
    search: "Rechercher",
    filters: "Filtres",
    favorites: "Favoris",
    profile: "Profil",
    notifications: "Notifications",
    aiPlanner: "IA Planificateur",
    offline: "Hors ligne",
    performance: "Performance",
    premium: "Premium",
    dashboard: "Tableau de bord",
    categories: "Catégories",
    exclusive: "Exclusif",
    recommendations: "Recommandations",
    weather: "Météo",
    social: "Communauté",
    advancedSearch: "Recherche+",
    noResults: "Aucun résultat trouvé",
    reservation: "Réservation :",
    tip: "Le petit plus"
  },
  en: {
    title: "Marrakech Guide",
    subtitle: "To make your stay unforgettable, we have gathered a selection of tested and approved addresses.",
    backToGuide: "Back to Guide",
    search: "Search",
    filters: "Filters",
    favorites: "Favorites",
    profile: "Profile",
    notifications: "Notifications",
    aiPlanner: "AI Planner",
    offline: "Offline",
    performance: "Performance",
    premium: "Premium",
    dashboard: "Dashboard",
    categories: "Categories",
    exclusive: "Exclusive",
    recommendations: "Recommendations",
    weather: "Weather",
    social: "Community",
    advancedSearch: "Search+",
    noResults: "No results found",
    reservation: "Reservation:",
    tip: "Insider tip"
  }
};

const categoryColors = {
  "Guide Touristique": "bg-accent/10 border-accent/20",
  "Culture & Musées": "bg-primary/10 border-primary/20",
  "Se sustenter & Apéros & Tea Time": "bg-gradient-to-r from-accent/10 to-primary/5 border-accent/20"
};

const categoryEmojis = {
  "Guide Touristique": "🕌",
  "Culture & Musées": "🎨",
  "Se sustenter & Apéros & Tea Time": "🍃"
};

export const EnhancedMarrakechGuide: React.FC<EnhancedMarrakechGuideProps> = ({ language = 'fr' }) => {
  const [currentView, setCurrentView] = useState<string>('guide');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'en'>(language as 'fr' | 'en');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [userPlan, setUserPlan] = useState<'free' | 'premium' | 'vip'>('free');
  const [userPreferences, setUserPreferences] = useState<string[]>([]);

  const t = translations[currentLanguage];
  const categories = Object.keys(guideData);

  useEffect(() => {
    // Initialize analytics and SEO
    analytics.trackPageView('/', t.title);
    seoManager.updatePageMetadata({
      title: t.title,
      description: t.subtitle,
      keywords: ["marrakech", "guide", "voyage", "maroc", "restaurants", "activités"],
      structuredData: seoManager.generateGuideStructuredData()
    });

    // Load user preferences
    const savedPlan = localStorage.getItem('marrakech-user-plan') as 'free' | 'premium' | 'vip' || 'free';
    setUserPlan(savedPlan);

    const savedPreferences = JSON.parse(localStorage.getItem('marrakech-user-preferences') || '[]');
    setUserPreferences(savedPreferences);
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
    trackInteraction.categorySelect(category);
    
    if (category) {
      seoManager.updateCategoryPageSEO(category, currentLanguage);
    }
  };

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsActivityModalOpen(true);
    trackInteraction.activityView(activity.Activité, activity.Thématique);
    seoManager.updateActivityPageSEO(activity, currentLanguage);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const allActivities = Object.values(guideData).flat();
    const results = allActivities.filter(activity => 
      activity.Activité.toLowerCase().includes(query.toLowerCase()) ||
      activity.Commentaires.toLowerCase().includes(query.toLowerCase())
    );
    trackInteraction.search(query, results.length);
  };

  const handleFilterChange = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters, filterId];
    setActiveFilters(newFilters);
    trackInteraction.filterUse('category', filterId);
  };

  const getFilteredActivities = () => {
    let activities = selectedCategory 
      ? guideData[selectedCategory as keyof typeof guideData] || []
      : Object.values(guideData).flat();

    if (searchQuery) {
      activities = activities.filter(activity => 
        activity.Activité.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.Commentaires.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.Adresse.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return activities;
  };

  const renderMainGuide = () => (
    <div className="space-y-8">
      {/* Header with Search and Filters */}
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-warm bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <SearchBar
            onSearch={handleSearch}
            onClear={() => setSearchQuery('')}
            placeholder={`${t.search}...`}
            className="flex-1"
          />
          <FilterBar
            filters={{
              priceRange: [
                { id: 'budget', label: 'Budget', count: 15 },
                { id: 'mid-range', label: 'Moyen', count: 25 },
                { id: 'luxury', label: 'Luxe', count: 12 }
              ],
              features: [
                { id: 'wifi', label: 'WiFi', count: 30 },
                { id: 'parking', label: 'Parking', count: 18 },
                { id: 'terrace', label: 'Terrasse', count: 22 }
              ],
              openingHours: [
                { id: 'morning', label: 'Matin', count: 35 },
                { id: 'evening', label: 'Soir', count: 28 }
              ]
            }}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClearAll={() => setActiveFilters([])}
            language={currentLanguage}
          />
        </div>
      </div>

      {/* Ads - Header Banner */}
      <AdManager 
        placement="header" 
        category={selectedCategory || undefined}
        userPreferences={userPreferences}
      />

      {/* Category Navigation */}
      <div className="bg-card/95 backdrop-blur-sm rounded-lg p-6 border border-border/20">
        <h2 className="text-2xl font-bold mb-4 text-center">{t.categories}</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => handleCategorySelect(category)}
              className="transition-all duration-300"
            >
              <span className="mr-2">{categoryEmojis[category as keyof typeof categoryEmojis]}</span>
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar with Ads and Affiliate Offers */}
        <div className="lg:col-span-1 space-y-6">
          <AdManager 
            placement="sidebar" 
            category={selectedCategory || undefined}
            userPreferences={userPreferences}
          />
          
          <AffiliateManager
            placement="sidebar"
            category={selectedCategory || undefined}
            userPreferences={userPreferences}
          />
        </div>

        {/* Activities List */}
        <div className="lg:col-span-3">
          {selectedCategory && (
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <span className="text-4xl">{categoryEmojis[selectedCategory as keyof typeof categoryEmojis]}</span>
                {selectedCategory}
              </h2>
              <div className="h-1 w-24 bg-gradient-primary rounded-full"></div>
            </div>
          )}

          {/* Sponsored Content */}
          <div className="mb-6">
            <AdManager 
              placement="content" 
              category={selectedCategory || undefined}
              userPreferences={userPreferences}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {getFilteredActivities().map((activity: Activity, index) => (
              activity.Activité && (
                <Card 
                  key={index} 
                  className={`
                    group hover:shadow-warm transition-all duration-300 hover:-translate-y-1 cursor-pointer
                    ${selectedCategory ? categoryColors[selectedCategory as keyof typeof categoryColors] : 'bg-card'}
                  `}
                  onClick={() => handleActivityClick(activity)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                        {activity.Activité}
                      </CardTitle>
                      <FavoritesManager 
                        activity={activity} 
                        language={currentLanguage} 
                        compact={true}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activity.Adresse && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{activity.Adresse}</span>
                      </div>
                    )}
                    
                    {activity["Tél."] && activity["Tél."] !== "–" && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{activity["Tél."]}</span>
                      </div>
                    )}

                    {activity.Commentaires && (
                      <div className="bg-muted/50 p-3 rounded-lg border-l-4 border-primary/30">
                        <div className="flex items-start gap-2 mb-1">
                          <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="font-medium text-primary text-sm">{t.tip}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {activity.Commentaires}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            ))}
          </div>

          {getFilteredActivities().length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">{t.noResults}</p>
            </div>
          )}

          {/* Affiliate Offers */}
          <div className="mt-8">
            <AffiliateManager
              placement="category-list"
              category={selectedCategory || undefined}
              userPreferences={userPreferences}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'ai-planner':
        return <AIItineraryPlanner language={currentLanguage} availableActivities={Object.values(guideData).flat()} />;
      case 'exclusive':
        return <ExclusiveContent userPlan={userPlan} language={currentLanguage} />;
      case 'recommendations':
        return <PersonalizedRecommendations userPlan={userPlan} language={currentLanguage} userPreferences={userPreferences} />;
      case 'weather':
        return <WeatherIntegration language={currentLanguage} />;
      case 'social':
        return <SocialFeatures userPlan={userPlan} language={currentLanguage} />;
      case 'advanced-search':
        return <AdvancedSearch userPlan={userPlan} language={currentLanguage} onSearch={(results) => console.log(results)} />;
      case 'profile':
        return <UserProfileManager language={currentLanguage} onLanguageChange={setCurrentLanguage} />;
      case 'notifications':
        return <NotificationManager language={currentLanguage} />;
      case 'offline':
        return <OfflineManager language={currentLanguage} guideData={guideData} />;
      case 'performance':
        return <PerformanceOptimizer language={currentLanguage} />;
      case 'premium':
        return <PremiumFeatures language={currentLanguage} userPlan={userPlan} />;
      case 'dashboard':
        return <MonetizationDashboard language={currentLanguage} />;
      default:
        return renderMainGuide();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sunset">
      {/* Language Switcher */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentLanguage(currentLanguage === 'fr' ? 'en' : 'fr')}
          className="bg-card/90 backdrop-blur-sm border-border/20 hover:bg-card"
        >
          <Languages className="h-4 w-4 mr-2" />
          {currentLanguage.toUpperCase()}
        </Button>
      </div>

      {/* Navigation Menu */}
      <div className="fixed top-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-card/90 backdrop-blur-sm border-border/20 hover:bg-card"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2 mt-6">
              <Button
                variant={currentView === 'guide' ? "default" : "outline"}
                onClick={() => setCurrentView('guide')}
                className="justify-start"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Guide Principal
              </Button>
              
              <Button
                variant={currentView === 'ai-planner' ? "default" : "outline"}
                onClick={() => setCurrentView('ai-planner')}
                className="justify-start"
              >
                <Zap className="mr-2 h-4 w-4" />
                {t.aiPlanner}
                {userPlan === 'free' && <Crown className="ml-auto h-4 w-4 text-yellow-500" />}
              </Button>
              
              <Button
                variant={currentView === 'exclusive' ? "default" : "outline"}
                onClick={() => setCurrentView('exclusive')}
                className="justify-start"
              >
                <Crown className="mr-2 h-4 w-4" />
                {t.exclusive}
                {userPlan === 'free' && <Crown className="ml-auto h-4 w-4 text-yellow-500" />}
              </Button>
              
              <Button
                variant={currentView === 'recommendations' ? "default" : "outline"}
                onClick={() => setCurrentView('recommendations')}
                className="justify-start"
              >
                <Star className="mr-2 h-4 w-4" />
                {t.recommendations}
                {userPlan === 'free' && <Crown className="ml-auto h-4 w-4 text-yellow-500" />}
              </Button>
              
              <Button
                variant={currentView === 'weather' ? "default" : "outline"}
                onClick={() => setCurrentView('weather')}
                className="justify-start"
              >
                <MapPin className="mr-2 h-4 w-4" />
                {t.weather}
              </Button>
              
              <Button
                variant={currentView === 'social' ? "default" : "outline"}
                onClick={() => setCurrentView('social')}
                className="justify-start"
              >
                <Heart className="mr-2 h-4 w-4" />
                {t.social}
                {userPlan === 'free' && <Crown className="ml-auto h-4 w-4 text-yellow-500" />}
              </Button>
              
              <Button
                variant={currentView === 'advanced-search' ? "default" : "outline"}
                onClick={() => setCurrentView('advanced-search')}
                className="justify-start"
              >
                <Search className="mr-2 h-4 w-4" />
                {t.advancedSearch}
                {userPlan === 'free' && <Crown className="ml-auto h-4 w-4 text-yellow-500" />}
              </Button>
              
              <Button
                variant={currentView === 'profile' ? "default" : "outline"}
                onClick={() => setCurrentView('profile')}
                className="justify-start"
              >
                <Star className="mr-2 h-4 w-4" />
                {t.profile}
              </Button>
              
              <Button
                variant={currentView === 'notifications' ? "default" : "outline"}
                onClick={() => setCurrentView('notifications')}
                className="justify-start"
              >
                <Heart className="mr-2 h-4 w-4" />
                {t.notifications}
              </Button>
              
              <Button
                variant={currentView === 'offline' ? "default" : "outline"}
                onClick={() => setCurrentView('offline')}
                className="justify-start"
              >
                <MapPin className="mr-2 h-4 w-4" />
                {t.offline}
              </Button>
              
              <Button
                variant={currentView === 'performance' ? "default" : "outline"}
                onClick={() => setCurrentView('performance')}
                className="justify-start"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                {t.performance}
              </Button>
              
              <Button
                variant={currentView === 'premium' ? "default" : "outline"}
                onClick={() => setCurrentView('premium')}
                className="justify-start"
              >
                <Crown className="mr-2 h-4 w-4" />
                {t.premium}
              </Button>
              
              <Button
                variant={currentView === 'dashboard' ? "default" : "outline"}
                onClick={() => setCurrentView('dashboard')}
                className="justify-start"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                {t.dashboard}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Back Button */}
      {currentView !== 'guide' && (
        <div className="fixed top-20 left-4 z-40">
          <Button
            variant="outline"
            onClick={() => setCurrentView('guide')}
            className="bg-card/90 backdrop-blur-sm border-border/20 hover:bg-card"
          >
            ← {t.backToGuide}
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {renderCurrentView()}
      </div>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        language={currentLanguage}
      />

      {/* Footer with Affiliate Recommendations */}
      {currentView === 'guide' && (
        <footer className="bg-primary text-primary-foreground py-12 mt-20">
          <div className="container mx-auto px-6">
            <AffiliateManager
              placement="recommendations"
              userPreferences={userPreferences}
            />
            <div className="text-center mt-8">
              <p className="text-lg opacity-90">
                Guide curated de Marrakech - Découvrez l'authenticité de la Ville Ocre
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default EnhancedMarrakechGuide;