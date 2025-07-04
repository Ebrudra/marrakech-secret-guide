import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Clock, MapPin, Calendar } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ItineraryItem {
  time: string;
  activity: string;
  location: string;
  duration: string;
  description: string;
  category: string;
}

interface AIItineraryPlannerProps {
  language: 'fr' | 'en';
  availableActivities: any[];
}

const translations = {
  fr: {
    title: "Planificateur d'Itinéraire IA",
    subtitle: "Décrivez vos préférences et laissez l'IA créer votre itinéraire parfait",
    placeholder: "Ex: Je veux visiter Marrakech pendant 2 jours, j'aime la culture, la gastronomie et les spas. Je préfère éviter les foules...",
    generateButton: "Générer mon itinéraire",
    generating: "Génération en cours...",
    error: "Erreur lors de la génération de l'itinéraire",
    day: "Jour",
    duration: "Durée",
    location: "Lieu",
    noItinerary: "Aucun itinéraire généré",
    tryAgain: "Réessayer",
    saveItinerary: "Sauvegarder l'itinéraire"
  },
  en: {
    title: "AI Itinerary Planner",
    subtitle: "Describe your preferences and let AI create your perfect itinerary",
    placeholder: "Ex: I want to visit Marrakech for 2 days, I love culture, gastronomy and spas. I prefer to avoid crowds...",
    generateButton: "Generate my itinerary",
    generating: "Generating...",
    error: "Error generating itinerary",
    day: "Day",
    duration: "Duration",
    location: "Location",
    noItinerary: "No itinerary generated",
    tryAgain: "Try Again",
    saveItinerary: "Save Itinerary"
  }
};

export default function AIItineraryPlanner({ language, availableActivities }: AIItineraryPlannerProps) {
  const [preferences, setPreferences] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const t = translations[language];

  const generateItinerary = async () => {
    if (!preferences.trim()) {
      toast("Veuillez décrire vos préférences");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation for now - replace with actual Gemini API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock itinerary data - replace with actual AI response
      const mockItinerary: ItineraryItem[] = [
        {
          time: "09:00",
          activity: "Jardin Majorelle + Musée YSL",
          location: "Guéliz",
          duration: "2h30",
          description: "Commencez votre journée dans ce jardin emblématique et découvrez l'univers d'Yves Saint Laurent",
          category: "Culture & Musées"
        },
        {
          time: "12:00",
          activity: "Déjeuner à Nomad",
          location: "Médina",
          duration: "1h30",
          description: "Savourez une cuisine fusion sur cette magnifique terrasse avec vue",
          category: "Se sustenter & Apéros & Tea Time"
        },
        {
          time: "14:30",
          activity: "Visite des Souks avec guide Abdoul",
          location: "Médina",
          duration: "2h",
          description: "Explorez les souks traditionnels avec un guide expert local",
          category: "Visites & découvertes"
        },
        {
          time: "17:00",
          activity: "Pause thé à Bacha Coffee",
          location: "Dar el Bacha",
          duration: "1h",
          description: "Détendez-vous avec un thé dans ce cadre somptueux",
          category: "Se sustenter & Apéros & Tea Time"
        },
        {
          time: "19:30",
          activity: "Dîner à La Mamounia",
          location: "Hivernage",
          duration: "2h",
          description: "Terminez en beauté dans ce palace légendaire",
          category: "Se sustenter & Apéros & Tea Time"
        }
      ];
      
      setItinerary(mockItinerary);
    } catch (error) {
      toast(t.error);
      console.error('Error generating itinerary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveItinerary = () => {
    const savedItineraries = JSON.parse(localStorage.getItem('marrakech-saved-itineraries') || '[]');
    const newItinerary = {
      id: Date.now(),
      preferences,
      items: itinerary,
      createdAt: new Date().toISOString(),
      day: currentDay
    };
    
    savedItineraries.push(newItinerary);
    localStorage.setItem('marrakech-saved-itineraries', JSON.stringify(savedItineraries));
    toast("Itinéraire sauvegardé!");
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Culture & Musées": "bg-blue-100 text-blue-800",
      "Visites & découvertes": "bg-green-100 text-green-800",
      "Se sustenter & Apéros & Tea Time": "bg-orange-100 text-orange-800",
      "Bien-être & détente": "bg-purple-100 text-purple-800",
      "Shopping & design": "bg-pink-100 text-pink-800",
      "Nuit & détente": "bg-indigo-100 text-indigo-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {t.title}
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

        {itinerary.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t.day} {currentDay}
              </h3>
              <Button onClick={saveItinerary} variant="outline" size="sm">
                {t.saveItinerary}
              </Button>
            </div>
            
            <div className="space-y-3">
              {itinerary.map((item, index) => (
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
                    
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}