import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Phone, Clock, Lightbulb, Languages, Menu, X, Search, Filter, Heart, Star, User, LogOut, Shield } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from './ui/sheet';
import { supabase, getActivities, getCategories } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import AuthModal from '@/components/AuthModal';
import AdminPanel from '@/components/AdminPanel';
import RealAIItineraryPlanner from '@/components/RealAIItineraryPlanner';

// Import existing components
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import FavoritesManager from './FavoritesManager';
import ActivityDetailModal from './ActivityDetailModal';
import UserProfileManager from './UserProfileManager';
import NotificationManager from './NotificationManager';
import OfflineManager from './OfflineManager';
import PerformanceOptimizer from './PerformanceOptimizer';

// Analytics and SEO
import { analytics, trackInteraction } from '@/lib/analytics';
import { seoManager } from '@/lib/seo';

interface Activity {
  id: number;
  name: string;
  description: string;
  category_id: number;
  street_address: string | null;
  phone_number: string | null;
  reservation_info: string | null;
  comments: string | null;
  average_rating: number;
  review_count: number;
  is_featured: boolean;
  categories?: { name: string; slug: string };
}

interface RealDataEnhancedGuideProps {
  language?: string;
}

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
    admin: "Administration",
    categories: "Catégories",
    noResults: "Aucun résultat trouvé",
    reservation: "Réservation :",
    tip: "Le petit plus",
    signIn: "Se connecter",
    signOut: "Se déconnecter",
    loading: "Chargement...",
    error: "Erreur lors du chargement"
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
    admin: "Administration",
    categories: "Categories",
    noResults: "No results found",
    reservation: "Reservation:",
    tip: "Insider tip",
    signIn: "Sign In",
    signOut: "Sign Out",
    loading: "Loading...",
    error: "Error loading"
  }
};

const categoryEmojis: Record<string, string> = {
  "Guide Touristique": "🕌",
  "Culture & Musées": "🎨",
  "Se sustenter & Apéros & Tea Time": "🍃",
  "Bien-être & détente": "💆",
  "Shopping & design": "🛍️",
  "Visites & découvertes": "🗺️",
  "Nuit & détente": "🌙"
};

export const RealDataEnhancedGuide: React.FC<RealDataEnhancedGuideProps> = ({ language = 'fr' }) => {
  const { user, signOut, isAdminUser, loading: authLoading } = useAuth();
  
  // Add hero image URL
  const heroImageUrl = "https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=1200";
  
  const [currentView, setCurrentView] = useState<string>('guide');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'en'>(language as 'fr' | 'en');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Data states
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = translations[currentLanguage];

  useEffect(() => {
    loadData();
    initializeAnalytics();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load categories
      const { data: categoriesData, error: categoriesError } = await getCategories();
      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Load activities
      const { data: activitiesData, error: activitiesError } = await getActivities();
      if (activitiesError) throw activitiesError;
      setActivities(activitiesData || []);

    } catch (error) {
      console.error('Error loading data:', error);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const initializeAnalytics = () => {
    analytics.trackPageView('/', t.title);
    seoManager.updatePageMetadata({
      title: t.title,
      description: t.subtitle,
      keywords: ["marrakech", "guide", "voyage", "maroc", "restaurants", "activités"],
      structuredData: seoManager.generateGuideStructuredData()
    });
  };

  const handleCategorySelect = (categorySlug: string) => {
    const category = categories.find(c => c.slug === categorySlug);
    if (!category) return;

    setSelectedCategory(selectedCategory === categorySlug ? null : categorySlug);
    trackInteraction.categorySelect(category.name);
    
    if (categorySlug) {
      seoManager.updateCategoryPageSEO(category.name, currentLanguage);
    }
  };

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsActivityModalOpen(true);
    trackInteraction.activityView(activity.name, activity.categories?.name || '');
    seoManager.updateActivityPageSEO(activity, currentLanguage);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results = getFilteredActivities(query);
    trackInteraction.search(query, results.length);
  };

  const handleFilterChange = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters, filterId];
    setActiveFilters(newFilters);
    trackInteraction.filterUse('category', filterId);
  };

  const getFilteredActivities = (query?: string) => {
    let filtered = activities;

    // Filter by category
    if (selectedCategory) {
      const category = categories.find(c => c.slug === selectedCategory);
      if (category) {
        filtered = filtered.filter(activity => activity.category_id === category.id);
      }
    }

    // Filter by search query
    const searchTerm = query || searchQuery;
    if (searchTerm) {
      filtered = filtered.filter(activity => 
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.street_address && activity.street_address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (activity.comments && activity.comments.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentView('guide');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-sunset flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-sunset flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadData}>Réessayer</Button>
        </div>
      </div>
    );
  }

  const renderMainGuide = () => (
    <div className="space-y-8">
      {/* Header with Search and Filters */}
      <div className="space-y-4">
        <div className="text-center">
          {/* Hero Image */}
          <div className="relative mb-6 rounded-xl overflow-hidden">
            <img 
              src={heroImageUrl} 
              alt="Marrakech" 
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
          </div>
          
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

      {/* Category Navigation */}
      <div className="bg-card/95 backdrop-blur-sm rounded-lg p-6 border border-border/20">
        <h2 className="text-2xl font-bold mb-4 text-center">{t.categories}</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.slug ? "default" : "outline"}
              onClick={() => handleCategorySelect(category.slug)}
              className="transition-all duration-300"
            >
              <span className="mr-2">{categoryEmojis[category.name] || "📍"}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-6">
        {selectedCategory && (
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <span className="text-4xl">
                {categoryEmojis[categories.find(c => c.slug === selectedCategory)?.name || ''] || "📍"}
              </span>
              {categories.find(c => c.slug === selectedCategory)?.name}
            </h2>
            <div className="h-1 w-24 bg-gradient-primary rounded-full"></div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getFilteredActivities().map((activity) => (
            <Card 
              key={activity.id} 
              className="group hover:shadow-warm transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-card"
              onClick={() => handleActivityClick(activity)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                    {activity.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {activity.is_featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Recommandé
                      </Badge>
                    )}
                    <FavoritesManager 
                      activity={{
                        "Thématique": activity.categories?.name || '',
                        "Activité": activity.name,
                        "Adresse": activity.street_address || '',
                        "Tél.": activity.phone_number || '',
                        "Réservation": activity.reservation_info || '',
                        "Commentaires": activity.comments || ''
                      }} 
                      language={currentLanguage} 
                      compact={true}
                    />
                  </div>
                </div>
                {activity.average_rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{activity.average_rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({activity.review_count} avis)</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {activity.street_address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{activity.street_address}</span>
                  </div>
                )}
                
                {activity.phone_number && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{activity.phone_number}</span>
                  </div>
                )}

                {activity.comments && (
                  <div className="bg-muted/50 p-3 rounded-lg border-l-4 border-primary/30">
                    <div className="flex items-start gap-2 mb-1">
                      <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="font-medium text-primary text-sm">{t.tip}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {activity.comments}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {getFilteredActivities().length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">{t.noResults}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'ai-planner':
        return <RealAIItineraryPlanner language={currentLanguage} />;
      case 'admin':
        return isAdminUser ? <AdminPanel language={currentLanguage} /> : renderMainGuide();
      case 'profile':
        return <UserProfileManager language={currentLanguage} onLanguageChange={setCurrentLanguage} />;
      case 'notifications':
        return <NotificationManager language={currentLanguage} />;
      case 'offline':
        return <OfflineManager language={currentLanguage} guideData={{}} />;
      case 'performance':
        return <PerformanceOptimizer language={currentLanguage} />;
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

      {/* User Menu */}
      <div className="fixed top-4 right-16 z-50">
        {user ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentView('profile')}
              className="bg-card/90 backdrop-blur-sm border-border/20 hover:bg-card"
            >
              <User className="h-4 w-4 mr-2" />
              {user.email?.split('@')[0]}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="bg-card/90 backdrop-blur-sm border-border/20 hover:bg-card"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-card/90 backdrop-blur-sm border-border/20 hover:bg-card"
          >
            <User className="h-4 w-4 mr-2" />
            {t.signIn}
          </Button>
        )}
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
                <Star className="mr-2 h-4 w-4" />
                {t.aiPlanner}
              </Button>
              
              {user && (
                <Button
                  variant={currentView === 'profile' ? "default" : "outline"}
                  onClick={() => setCurrentView('profile')}
                  className="justify-start"
                >
                  <User className="mr-2 h-4 w-4" />
                  {t.profile}
                </Button>
              )}
              
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
                <Star className="mr-2 h-4 w-4" />
                {t.performance}
              </Button>
              
              {isAdminUser && (
                <Button
                  variant={currentView === 'admin' ? "default" : "outline"}
                  onClick={() => setCurrentView('admin')}
                  className="justify-start"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  {t.admin}
                </Button>
              )}
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
        activity={selectedActivity ? {
          "Thématique": selectedActivity.categories?.name || '',
          "Activité": selectedActivity.name,
          "Adresse": selectedActivity.street_address || '',
          "Tél.": selectedActivity.phone_number || '',
          "Réservation": selectedActivity.reservation_info || '',
          "Commentaires": selectedActivity.comments || ''
        } : null}
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        language={currentLanguage}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default RealDataEnhancedGuide;