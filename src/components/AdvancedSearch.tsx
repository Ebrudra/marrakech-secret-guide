import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Clock, DollarSign, Star, Filter, X, Zap } from "lucide-react";

interface AdvancedSearchProps {
  userPlan: 'free' | 'premium' | 'vip';
  language: 'fr' | 'en';
  onSearch: (results: any[]) => void;
}

interface SearchFilters {
  query: string;
  category: string;
  location: string;
  priceRange: [number, number];
  rating: number;
  openNow: boolean;
  distance: number;
  features: string[];
  sortBy: string;
}

const translations = {
  fr: {
    title: "Recherche Avancée",
    subtitle: "Trouvez exactement ce que vous cherchez",
    basicSearch: "Recherche de base",
    advancedSearch: "Recherche avancée",
    aiSearch: "Recherche IA",
    searchPlaceholder: "Que recherchez-vous ?",
    category: "Catégorie",
    location: "Lieu",
    priceRange: "Gamme de prix",
    rating: "Note minimum",
    openNow: "Ouvert maintenant",
    distance: "Distance max (km)",
    features: "Caractéristiques",
    sortBy: "Trier par",
    search: "Rechercher",
    clearFilters: "Effacer les filtres",
    results: "résultats",
    noResults: "Aucun résultat trouvé",
    premiumFeature: "Fonctionnalité Premium",
    upgradeMessage: "Passez au Premium pour la recherche avancée",
    aiSearchDesc: "Décrivez ce que vous voulez en langage naturel",
    aiPlaceholder: "Ex: Je veux un restaurant romantique avec terrasse pour ce soir",
    sortOptions: {
      relevance: "Pertinence",
      rating: "Note",
      distance: "Distance",
      price: "Prix",
      popularity: "Popularité"
    },
    categories: {
      all: "Toutes",
      culture: "Culture & Musées",
      food: "Restaurants",
      wellness: "Bien-être",
      shopping: "Shopping",
      visits: "Visites"
    },
    locations: {
      all: "Tous",
      medina: "Médina",
      gueliz: "Guéliz",
      hivernage: "Hivernage",
      palmeraie: "Palmeraie"
    },
    featuresOptions: [
      "WiFi gratuit",
      "Parking",
      "Terrasse",
      "Climatisation",
      "Piscine",
      "Spa",
      "Restaurant",
      "Bar"
    ]
  },
  en: {
    title: "Advanced Search",
    subtitle: "Find exactly what you're looking for",
    basicSearch: "Basic search",
    advancedSearch: "Advanced search",
    aiSearch: "AI Search",
    searchPlaceholder: "What are you looking for?",
    category: "Category",
    location: "Location",
    priceRange: "Price range",
    rating: "Minimum rating",
    openNow: "Open now",
    distance: "Max distance (km)",
    features: "Features",
    sortBy: "Sort by",
    search: "Search",
    clearFilters: "Clear filters",
    results: "results",
    noResults: "No results found",
    premiumFeature: "Premium Feature",
    upgradeMessage: "Upgrade to Premium for advanced search",
    aiSearchDesc: "Describe what you want in natural language",
    aiPlaceholder: "Ex: I want a romantic restaurant with terrace for tonight",
    sortOptions: {
      relevance: "Relevance",
      rating: "Rating",
      distance: "Distance",
      price: "Price",
      popularity: "Popularity"
    },
    categories: {
      all: "All",
      culture: "Culture & Museums",
      food: "Restaurants",
      wellness: "Wellness",
      shopping: "Shopping",
      visits: "Visits"
    },
    locations: {
      all: "All",
      medina: "Medina",
      gueliz: "Gueliz",
      hivernage: "Hivernage",
      palmeraie: "Palmeraie"
    },
    featuresOptions: [
      "Free WiFi",
      "Parking",
      "Terrace",
      "Air conditioning",
      "Pool",
      "Spa",
      "Restaurant",
      "Bar"
    ]
  }
};

export default function AdvancedSearch({ userPlan, language, onSearch }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    location: 'all',
    priceRange: [0, 200],
    rating: 0,
    openNow: false,
    distance: 10,
    features: [],
    sortBy: 'relevance'
  });
  const [aiQuery, setAiQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const t = translations[language];

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock search results based on filters
    const mockResults = [
      {
        id: 1,
        name: "Jardin Majorelle",
        category: "Culture & Musées",
        location: "Guéliz",
        rating: 4.8,
        price: 70,
        distance: 2.5,
        features: ["WiFi gratuit", "Parking"],
        openNow: true
      },
      {
        id: 2,
        name: "Nomad Restaurant",
        category: "Restaurants",
        location: "Médina",
        rating: 4.6,
        price: 45,
        distance: 1.2,
        features: ["Terrasse", "WiFi gratuit"],
        openNow: true
      },
      {
        id: 3,
        name: "La Mamounia Spa",
        category: "Bien-être",
        location: "Hivernage",
        rating: 4.9,
        price: 150,
        distance: 3.8,
        features: ["Spa", "Piscine", "Restaurant"],
        openNow: false
      }
    ];

    // Apply filters
    let filteredResults = mockResults.filter(result => {
      if (filters.query && !result.name.toLowerCase().includes(filters.query.toLowerCase())) {
        return false;
      }
      if (filters.category !== 'all' && result.category !== filters.category) {
        return false;
      }
      if (filters.location !== 'all' && result.location !== filters.location) {
        return false;
      }
      if (result.price < filters.priceRange[0] || result.price > filters.priceRange[1]) {
        return false;
      }
      if (result.rating < filters.rating) {
        return false;
      }
      if (filters.openNow && !result.openNow) {
        return false;
      }
      if (result.distance > filters.distance) {
        return false;
      }
      if (filters.features.length > 0 && !filters.features.some(feature => result.features.includes(feature))) {
        return false;
      }
      return true;
    });

    // Sort results
    switch (filters.sortBy) {
      case 'rating':
        filteredResults.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        filteredResults.sort((a, b) => a.distance - b.distance);
        break;
      case 'price':
        filteredResults.sort((a, b) => a.price - b.price);
        break;
      default:
        // Keep relevance order
        break;
    }

    setSearchResults(filteredResults);
    onSearch(filteredResults);
    setIsSearching(false);
  };

  const handleAiSearch = async () => {
    if (userPlan === 'free') {
      return;
    }
    
    setIsSearching(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI search results
    const aiResults = [
      {
        id: 1,
        name: "Terrasse des Épices",
        category: "Restaurants",
        location: "Médina",
        rating: 4.7,
        price: 65,
        distance: 0.8,
        features: ["Terrasse", "Vue panoramique", "Ambiance romantique"],
        openNow: true,
        aiMatch: 95
      }
    ];

    setSearchResults(aiResults);
    onSearch(aiResults);
    setIsSearching(false);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      location: 'all',
      priceRange: [0, 200],
      rating: 0,
      openNow: false,
      distance: 10,
      features: [],
      sortBy: 'relevance'
    });
    setSearchResults([]);
  };

  const toggleFeature = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Search className="h-8 w-8 text-primary" />
          {t.title}
        </h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">{t.basicSearch}</TabsTrigger>
              <TabsTrigger value="advanced">
                {t.advancedSearch}
                {userPlan === 'free' && <Badge variant="outline" className="ml-2 text-xs">Premium</Badge>}
              </TabsTrigger>
              <TabsTrigger value="ai">
                {t.aiSearch}
                {userPlan === 'free' && <Badge variant="outline" className="ml-2 text-xs">Premium</Badge>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder={t.searchPlaceholder}
                  value={filters.query}
                  onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  <Search className="h-4 w-4 mr-2" />
                  {isSearching ? 'Recherche...' : t.search}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              {userPlan === 'free' ? (
                <div className="text-center p-8 bg-muted/50 rounded-lg">
                  <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">{t.premiumFeature}</h3>
                  <p className="text-muted-foreground">{t.upgradeMessage}</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>{t.category}</Label>
                      <select
                        value={filters.category}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        {Object.entries(t.categories).map(([key, value]) => (
                          <option key={key} value={key}>{value}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label>{t.location}</Label>
                      <select
                        value={filters.location}
                        onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        {Object.entries(t.locations).map(([key, value]) => (
                          <option key={key} value={key}>{value}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label>{t.priceRange}: {filters.priceRange[0]}€ - {filters.priceRange[1]}€</Label>
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                        max={200}
                        step={10}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>{t.rating}: {filters.rating} étoiles</Label>
                      <Slider
                        value={[filters.rating]}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value[0] }))}
                        max={5}
                        step={0.5}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>{t.distance}: {filters.distance} km</Label>
                      <Slider
                        value={[filters.distance]}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, distance: value[0] }))}
                        max={50}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>{t.features}</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {t.featuresOptions.map((feature) => (
                          <Badge
                            key={feature}
                            variant={filters.features.includes(feature) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleFeature(feature)}
                          >
                            {feature}
                            {filters.features.includes(feature) && (
                              <X className="h-3 w-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>{t.sortBy}</Label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        {Object.entries(t.sortOptions).map(([key, value]) => (
                          <option key={key} value={key}>{value}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {userPlan !== 'free' && (
                <div className="flex gap-4">
                  <Button onClick={handleSearch} disabled={isSearching} className="flex-1">
                    <Search className="h-4 w-4 mr-2" />
                    {isSearching ? 'Recherche...' : t.search}
                  </Button>
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    {t.clearFilters}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              {userPlan === 'free' ? (
                <div className="text-center p-8 bg-muted/50 rounded-lg">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">{t.premiumFeature}</h3>
                  <p className="text-muted-foreground">{t.upgradeMessage}</p>
                </div>
              ) : (
                <>
                  <div>
                    <Label>{t.aiSearchDesc}</Label>
                    <Input
                      placeholder={t.aiPlaceholder}
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <Button onClick={handleAiSearch} disabled={isSearching || !aiQuery.trim()} className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    {isSearching ? 'Recherche IA...' : 'Recherche IA'}
                  </Button>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{searchResults.length} {t.results}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((result) => (
                <div key={result.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{result.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{result.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span>{result.category}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {result.location}
                    </div>
                    <span>•</span>
                    <span>{result.distance} km</span>
                    <span>•</span>
                    <span>{result.price}€</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {result.features.map((feature: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}