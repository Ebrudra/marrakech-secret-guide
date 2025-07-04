import { useState, useEffect } from "react";
import { Heart, Star, Calendar, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/components/AuthProvider";
import { addToFavorites, removeFromFavorites, getUserFavorites } from "@/lib/supabase";

interface Activity {
  "Thématique": string;
  "Activité": string;
  "Adresse": string;
  "Tél.": string;
  "Réservation": string;
  "Commentaires": string;
}

interface FavoritesManagerProps {
  activity: Activity;
  language: 'fr' | 'en';
  compact?: boolean;
}

const translations = {
  fr: {
    addToFavorites: "Ajouter aux favoris",
    removeFromFavorites: "Retirer des favoris",
    addedToFavorites: "Ajouté aux favoris",
    removedFromFavorites: "Retiré des favoris",
    addToItinerary: "Ajouter à l'itinéraire",
    share: "Partager",
    shared: "Lien copié!"
  },
  en: {
    addToFavorites: "Add to favorites",
    removeFromFavorites: "Remove from favorites",
    addedToFavorites: "Added to favorites",
    removedFromFavorites: "Removed from favorites",
    addToItinerary: "Add to itinerary",
    share: "Share",
    shared: "Link copied!"
  }
};

export default function FavoritesManager({ activity, language, compact = false }: FavoritesManagerProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInItinerary, setIsInItinerary] = useState(false);
  const t = translations[language];

  // Load favorites from Supabase
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        // If not logged in, check localStorage for backward compatibility
        const favorites = JSON.parse(localStorage.getItem('marrakech-favorites') || '[]');
        setIsFavorite(favorites.some((fav: Activity) => fav.Activité === activity.Activité));
        return;
      }
      
      try {
        const { data } = await getUserFavorites(user.id);
        if (data) {
          // Check if this activity is in the user's favorites
          const activityInFavorites = data.some((fav: any) => 
            fav.activities?.name === activity.Activité
          );
          setIsFavorite(activityInFavorites);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    
    loadFavorites();
    
    // Still use localStorage for itineraries for now
    const itinerary = JSON.parse(localStorage.getItem('marrakech-itinerary') || '[]');
    setIsInItinerary(itinerary.some((item: Activity) => item.Activité === activity.Activité));
  }, [activity, user]);

  const toggleFavorite = async () => {
    if (!user) {
      toast('Veuillez vous connecter pour ajouter des favoris');
      return;
    }
    
    if (isFavorite) {
      try {
        // Find the activity ID from the name
        const { data: activityData } = await supabase
          .from('activities')
          .select('id')
          .eq('name', activity.Activité)
          .maybeSingle();
        
        if (activityData) {
          const { error } = await removeFromFavorites(user.id, activityData.id);
          if (error) throw error;
          setIsFavorite(false);
          toast(t.removedFromFavorites);
        }
      } catch (error) {
        console.error('Error removing favorite:', error);
        toast('Erreur lors de la suppression du favori');
      }
    } else {
      try {
        // Find the activity ID from the name
        const { data: activityData } = await supabase
          .from('activities')
          .select('id')
          .eq('name', activity.Activité)
          .maybeSingle();
        
        if (activityData) {
          const { error } = await addToFavorites(user.id, activityData.id);
          if (error) throw error;
          setIsFavorite(true);
          toast(t.addedToFavorites);
        }
      } catch (error) {
        console.error('Error adding favorite:', error);
        toast('Erreur lors de l\'ajout du favori');
      }
    }
  };

  const addToItinerary = () => {
    const itinerary = JSON.parse(localStorage.getItem('marrakech-itinerary') || '[]');
    
    if (!isInItinerary) {
      const newItinerary = [...itinerary, { ...activity, addedAt: new Date().toISOString() }];
      localStorage.setItem('marrakech-itinerary', JSON.stringify(newItinerary));
      setIsInItinerary(true);
      toast(t.addedToFavorites);
    }
  };

  const shareActivity = async () => {
    const url = `${window.location.origin}?activity=${encodeURIComponent(activity.Activité)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: activity.Activité,
          text: activity.Commentaires,
          url: url,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
        toast(t.shared);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast(t.shared);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFavorite}
          className="h-8 w-8 p-0"
          disabled={!user}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={addToItinerary}
          className="h-8 w-8 p-0"
        >
          <Star className={`h-4 w-4 ${isInItinerary ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
      <Button
        variant={isFavorite ? "default" : "outline"}
        size="sm"
        onClick={toggleFavorite}
        className="flex items-center gap-2"
        disabled={!user}
      >
        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        {isFavorite ? t.removeFromFavorites : t.addToFavorites}
      </Button>
      
      <Button
        variant={isInItinerary ? "secondary" : "outline"}
        size="sm"
        onClick={addToItinerary}
        disabled={isInItinerary}
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        {t.addToItinerary}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={shareActivity}
        className="flex items-center gap-2"
      >
        <Share2 className="h-4 w-4" />
        {t.share}
      </Button>
    </div>
  );
}

// Add missing import for supabase
import { supabase } from "@/lib/supabase";