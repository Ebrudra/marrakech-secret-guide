import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Clock, MapPin, Calendar, Lightbulb } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { geminiService } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

interface ItineraryItem {
  time: string;
  activity: string;
  location: string;
  duration: string;
  description: string;
  category: string;
  tips?: string;
}

interface RealAIItineraryPlannerProps {
  language: 'fr' | 'en';
}

const translations = {
  fr: {
    title: "Planificateur d'Itinéraire IA",
    subtitle: "Décrivez vos préférences et laissez l'IA créer votre itinéraire parfait",
    placeholder: "Ex: Je veux visiter Marrakech pendant 2 jours, j'aime la culture, la gastronomie et les spas. Je préfère éviter les foules et j'ai un budget moyen...",
    generateButton: "Générer mon itinéraire",
    generating: "Génération en cours...",
    error: "Erreur lors de la génération de l'itinéraire",
    day: "Jour",
    duration: "Durée",
    location: "Lieu",
    noItinerary: "Aucun itinéraire généré",
    tryAgain: "Réessayer",
    saveItinerary: "Sauvegarder l'itinéraire",
    summary: "Résumé",
    totalDuration: "Durée totale",
    estimatedBudget: "Budget estimé",
    tips: "Conseils",
    loginRequired: "Connectez-vous pour sauvegarder vos itinéraires"
  },
  en: {
    title: "AI Itinerary Planner",
    subtitle: "Describe your preferences and let AI create your perfect itinerary",
    placeholder: "Ex: I want to visit Marrakech for 2 days, I love culture, gastronomy and spas. I prefer to avoid crowds and have a medium budget...",
    generateButton: "Generate my itinerary",
    generating: "Generating...",
    error: "Error generating itinerary",
    day: "Day",
    duration: "Duration",
    location: "Location",
    noItinerary: "No itinerary generated",
    tryAgain: "Try Again",
    saveItinerary: "Save Itinerary",
    summary: "Summary",
    totalDuration: "Total duration",
    estimatedBudget: "Estimated budget",
    tips: "Tips",
    loginRequired: "Sign in to save your itineraries"
  }
};

export default function RealAIItineraryPlanner({ language }: RealAIItineraryPlannerProps) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);
  const [availableActivities, setAvailableActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const t = translations[language];

  // Load available activities on component mount
  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setIsLoading(true);
      const { data } = await supabase
        .from('activities')
        .select(`
          *,
          categories (name)
        `)
        .eq('is_approved', true);
      
      setAvailableActivities(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading activities:', error);
      setIsLoading(false);
    }
  };

  const generateItinerary = async () => {
    if (!preferences.trim()) {
      toast("Veuillez décrire vos préférences");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Load fresh activities data
      await loadActivities();
      
      // Generate itinerary using Gemini AI
      const generatedItinerary = await geminiService.generateItinerary(
        preferences, 
        availableActivities
      );
      
      setItinerary(generatedItinerary);
      
      // Track analytics
      if (typeof window !== 'undefined') {
        const events = JSON.parse(localStorage.getItem('marrakech-analytics-events') || '[]');
        events.push({
          event: 'ai_itinerary_generated',
          preferences_length: preferences.length,
          items_generated: generatedItinerary.itinerary?.length || 0,
          timestamp: new Date().toISOString(),
          user_id: user?.id || 'anonymous'
        });
        localStorage.setItem('marrakech-analytics-events', JSON.stringify(events));
      }
      
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast(t.error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveItinerary = async () => {
    if (!user) {
      toast(t.loginRequired);
      return;
    }

    if (!itinerary) return;

    try {
      // Save itinerary to database
      const { data: savedItinerary, error: itineraryError } = await supabase
        .from('itineraries')
        .insert({
          user_id: user.id,
          name: `Itinéraire IA - ${new Date().toLocaleDateString()}`,
          description: itinerary.summary,
          preferences: preferences,
          is_public: false
        })
        .select()
        .single();

      if (itineraryError) throw itineraryError;

      // Save itinerary items
      const itineraryItems = itinerary.itinerary.map((item: ItineraryItem, index: number) => {
        // Find matching activity in database
        const matchingActivity = availableActivities.find(
          activity => activity.name.toLowerCase().includes(item.activity.toLowerCase()) ||
                     item.activity.toLowerCase().includes(activity.name.toLowerCase())
        );

        return {
          itinerary_id: savedItinerary.id,
          activity_id: matchingActivity?.id || null,
          day_number: 1,
          start_time: item.time,
          order_in_day: index,
          notes: `${item.description}${item.tips ? ` - ${item.tips}` : ''}`
        };
      });

      const { error: itemsError } = await supabase
        .from('itinerary_items')
        .insert(itineraryItems);

      if (itemsError) throw itemsError;

      toast("Itinéraire sauvegardé avec succès !");
      
    } catch (error) {
      console.error('Error saving itinerary:', error);
      toast("Erreur lors de la sauvegarde");
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Culture & Musées": "bg-blue-100 text-blue-800",
      "Visites & découvertes": "bg-green-100 text-green-800",
      "Se sustenter & Apéros & Tea Time": "bg-orange-100 text-orange-800",
      "Bien-être & détente": "bg-purple-100 text-purple-800",
      "Shopping & design": "bg-pink-100 text-pink-800",
      "Guide Touristique": "bg-indigo-100 text-indigo-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
            <p className="text-muted-foreground">Chargement des activités...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {t.title}
          <Badge className="bg-gradient-to-r from-primary to-accent text-white">
            IA Réelle
          </Badge>
        </CardTitle>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Textarea
            placeholder={t.placeholder}
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            className="min-h-[120px]"
          />
          
          <Button 
            onClick={generateItinerary}
            disabled={isGenerating || !preferences.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t.generating}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                {t.generateButton}
              </>
            )}
          </Button>
        </div>

        {itinerary && (
          <div className="space-y-6">
            {/* Itinerary Summary */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{t.summary}</h3>
                <p className="text-sm mb-3">{itinerary.summary}</p>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{t.totalDuration}: {itinerary.totalDuration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💰</span>
                    <span>{t.estimatedBudget}: {itinerary.estimatedBudget}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={saveItinerary} className="flex-1" disabled={!user}>
                <Calendar className="h-4 w-4 mr-2" />
                {t.saveItinerary}
              </Button>
              <Button onClick={generateItinerary} variant="outline">
                <Sparkles className="h-4 w-4 mr-2" />
                {t.tryAgain}
              </Button>
            </div>
            
            {/* Itinerary Items */}
            <div className="space-y-3">
              {itinerary.itinerary?.map((item: ItineraryItem, index: number) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {item.time}
                        </Badge>
                        <Badge className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {item.duration}
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-foreground mb-1">{item.activity}</h4>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    
                    {item.tips && (
                      <div className="bg-muted/50 p-2 rounded text-sm">
                        <div className="flex items-start gap-1">
                          <Lightbulb className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-primary font-medium text-xs">{t.tips}:</span>
                        </div>
                        <p className="text-xs mt-1">{item.tips}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {!user && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-yellow-800">{t.loginRequired}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}