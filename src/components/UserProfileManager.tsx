import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Heart, Calendar, Settings, Download, Share2, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface UserProfile {
  name: string;
  email: string;
  preferences: string[];
  visitDates: string;
  language: 'fr' | 'en';
  createdAt: string;
}

interface UserProfileManagerProps {
  language: 'fr' | 'en';
  onLanguageChange: (lang: 'fr' | 'en') => void;
}

const translations = {
  fr: {
    profile: "Mon Profil",
    favorites: "Mes Favoris",
    itineraries: "Mes Itinéraires",
    settings: "Paramètres",
    name: "Nom",
    email: "Email",
    visitDates: "Dates de visite",
    preferences: "Préférences",
    saveProfile: "Sauvegarder",
    exportData: "Exporter mes données",
    shareProfile: "Partager mon profil",
    deleteData: "Supprimer mes données",
    noFavorites: "Aucun favori enregistré",
    noItineraries: "Aucun itinéraire sauvegardé",
    profileSaved: "Profil sauvegardé",
    dataExported: "Données exportées",
    dataDeleted: "Données supprimées",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer toutes vos données ?",
    createdOn: "Créé le",
    items: "éléments"
  },
  en: {
    profile: "My Profile",
    favorites: "My Favorites",
    itineraries: "My Itineraries",
    settings: "Settings",
    name: "Name",
    email: "Email",
    visitDates: "Visit dates",
    preferences: "Preferences",
    saveProfile: "Save Profile",
    exportData: "Export my data",
    shareProfile: "Share my profile",
    deleteData: "Delete my data",
    noFavorites: "No favorites saved",
    noItineraries: "No itineraries saved",
    profileSaved: "Profile saved",
    dataExported: "Data exported",
    dataDeleted: "Data deleted",
    confirmDelete: "Are you sure you want to delete all your data?",
    createdOn: "Created on",
    items: "items"
  }
};

export default function UserProfileManager({ language, onLanguageChange }: UserProfileManagerProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    preferences: [],
    visitDates: '',
    language,
    createdAt: new Date().toISOString()
  });
  const [favorites, setFavorites] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const t = translations[language];

  useEffect(() => {
    // Load user data
    const savedProfile = localStorage.getItem('marrakech-user-profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    const savedFavorites = JSON.parse(localStorage.getItem('marrakech-favorites') || '[]');
    setFavorites(savedFavorites);

    const savedItineraries = JSON.parse(localStorage.getItem('marrakech-saved-itineraries') || '[]');
    setItineraries(savedItineraries);
  }, []);

  const saveProfile = () => {
    const updatedProfile = { ...profile, language };
    localStorage.setItem('marrakech-user-profile', JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
    toast(t.profileSaved);
  };

  const exportUserData = () => {
    const userData = {
      profile,
      favorites,
      itineraries,
      analytics: JSON.parse(localStorage.getItem('marrakech-analytics-events') || '[]'),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marrakech-guide-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast(t.dataExported);
  };

  const deleteAllData = () => {
    if (window.confirm(t.confirmDelete)) {
      localStorage.removeItem('marrakech-user-profile');
      localStorage.removeItem('marrakech-favorites');
      localStorage.removeItem('marrakech-saved-itineraries');
      localStorage.removeItem('marrakech-analytics-events');
      localStorage.removeItem('marrakech-user-id');
      
      setProfile({
        name: '',
        email: '',
        preferences: [],
        visitDates: '',
        language,
        createdAt: new Date().toISOString()
      });
      setFavorites([]);
      setItineraries([]);
      
      toast(t.dataDeleted);
    }
  };

  const removeFavorite = (activityName: string) => {
    const newFavorites = favorites.filter((fav: any) => fav.Activité !== activityName);
    localStorage.setItem('marrakech-favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const removeItinerary = (itineraryId: number) => {
    const newItineraries = itineraries.filter((it: any) => it.id !== itineraryId);
    localStorage.setItem('marrakech-saved-itineraries', JSON.stringify(newItineraries));
    setItineraries(newItineraries);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          {t.profile}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">{t.profile}</TabsTrigger>
            <TabsTrigger value="favorites">
              {t.favorites}
              {favorites.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {favorites.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="itineraries">
              {t.itineraries}
              {itineraries.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {itineraries.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">{t.settings}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.name}</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Votre nom"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="votre@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="visitDates">{t.visitDates}</Label>
                <Input
                  id="visitDates"
                  value={profile.visitDates}
                  onChange={(e) => setProfile({ ...profile, visitDates: e.target.value })}
                  placeholder="Ex: 15-20 Mars 2024"
                />
              </div>
            </div>
            
            <Button onClick={saveProfile} className="w-full">
              {t.saveProfile}
            </Button>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            {favorites.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t.noFavorites}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((favorite: any, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{favorite.Activité}</h4>
                        <p className="text-sm text-muted-foreground">{favorite.Thématique}</p>
                        {favorite.Adresse && (
                          <p className="text-sm text-muted-foreground mt-1">{favorite.Adresse}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFavorite(favorite.Activité)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="itineraries" className="space-y-4">
            {itineraries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t.noItineraries}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {itineraries.map((itinerary: any, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {t.createdOn} {new Date(itinerary.createdAt).toLocaleDateString()}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {itinerary.items?.length || 0} {t.items}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {itinerary.preferences}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItinerary(itinerary.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Langue / Language</Label>
                <div className="flex gap-2">
                  <Button
                    variant={language === 'fr' ? 'default' : 'outline'}
                    onClick={() => onLanguageChange('fr')}
                  >
                    Français
                  </Button>
                  <Button
                    variant={language === 'en' ? 'default' : 'outline'}
                    onClick={() => onLanguageChange('en')}
                  >
                    English
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <Button
                  variant="outline"
                  onClick={exportUserData}
                  className="w-full flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {t.exportData}
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={deleteAllData}
                  className="w-full flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {t.deleteData}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}