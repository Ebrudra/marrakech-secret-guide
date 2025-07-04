import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Heart, MapPin, Clock, Star, Zap, Target } from "lucide-react";
import { analytics } from "@/lib/analytics";

interface PersonalizedRecommendationsProps {
  userPlan: 'free' | 'premium' | 'vip';
  language: 'fr' | 'en';
  userPreferences: string[];
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  confidence: number;
  reason: string;
  timeToVisit: string;
  estimatedCost: string;
  difficulty: 'easy' | 'medium' | 'hard';
  personalityMatch: number;
  trending: boolean;
  imageUrl: string;
}

const translations = {
  fr: {
    title: "Recommandations Personnalisées",
    subtitle: "Suggestions basées sur vos préférences et comportements",
    aiPowered: "Alimenté par IA",
    confidence: "Confiance",
    reason: "Pourquoi cette recommandation",
    timeToVisit: "Meilleur moment",
    estimatedCost: "Coût estimé",
    difficulty: "Difficulté",
    personalityMatch: "Compatibilité",
    trending: "Tendance",
    easy: "Facile",
    medium: "Moyen",
    hard: "Difficile",
    upgradeForMore: "Passez au Premium pour plus de recommandations",
    basedOn: "Basé sur",
    yourInterests: "vos intérêts",
    recentActivity: "activité récente",
    similarUsers: "utilisateurs similaires",
    seasonalTrends: "tendances saisonnières",
    noData: "Pas assez de données",
    exploreMore: "Explorez plus pour obtenir des recommandations personnalisées"
  },
  en: {
    title: "Personalized Recommendations",
    subtitle: "Suggestions based on your preferences and behavior",
    aiPowered: "AI Powered",
    confidence: "Confidence",
    reason: "Why this recommendation",
    timeToVisit: "Best time to visit",
    estimatedCost: "Estimated cost",
    difficulty: "Difficulty",
    personalityMatch: "Personality match",
    trending: "Trending",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    upgradeForMore: "Upgrade to Premium for more recommendations",
    basedOn: "Based on",
    yourInterests: "your interests",
    recentActivity: "recent activity",
    similarUsers: "similar users",
    seasonalTrends: "seasonal trends",
    noData: "Not enough data",
    exploreMore: "Explore more to get personalized recommendations"
  }
};

export default function PersonalizedRecommendations({ userPlan, language, userPreferences }: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    generateRecommendations();
  }, [userPreferences, userPlan]);

  const generateRecommendations = async () => {
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get user analytics data
    const analyticsData = analytics.getUserEngagementMetrics();
    const favorites = JSON.parse(localStorage.getItem('marrakech-favorites') || '[]');
    const searchHistory = JSON.parse(localStorage.getItem('marrakech-analytics-events') || '[]')
      .filter((e: any) => e.event === 'search')
      .map((e: any) => e.label);

    // Generate personalized recommendations based on user data
    const mockRecommendations: Recommendation[] = [
      {
        id: 'rec-1',
        title: 'Atelier de Calligraphie Arabe',
        description: 'Apprenez l\'art de la calligraphie arabe avec un maître calligraphe dans un riad traditionnel.',
        category: 'Culture & Musées',
        location: 'Médina',
        confidence: 92,
        reason: 'Basé sur votre intérêt pour la culture et vos visites de musées',
        timeToVisit: 'Matin (9h-12h)',
        estimatedCost: '80€',
        difficulty: 'easy',
        personalityMatch: 95,
        trending: true,
        imageUrl: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'rec-2',
        title: 'Cours de Cuisine Fusion Marocaine',
        description: 'Découvrez la fusion entre cuisine traditionnelle marocaine et techniques modernes.',
        category: 'Se sustenter & Apéros & Tea Time',
        location: 'Guéliz',
        confidence: 88,
        reason: 'Recommandé par des utilisateurs avec des goûts similaires',
        timeToVisit: 'Après-midi (14h-18h)',
        estimatedCost: '120€',
        difficulty: 'medium',
        personalityMatch: 87,
        trending: false,
        imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'rec-3',
        title: 'Randonnée Sunrise dans l\'Atlas',
        description: 'Lever de soleil spectaculaire depuis les sommets de l\'Atlas avec guide berbère.',
        category: 'Visites & découvertes',
        location: 'Montagnes de l\'Atlas',
        confidence: 85,
        reason: 'Tendance saisonnière pour cette période de l\'année',
        timeToVisit: 'Très tôt le matin (5h-10h)',
        estimatedCost: '95€',
        difficulty: 'hard',
        personalityMatch: 78,
        trending: true,
        imageUrl: 'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'rec-4',
        title: 'Séance Photo Professionnelle',
        description: 'Shooting photo dans les plus beaux décors de Marrakech avec photographe professionnel.',
        category: 'Expériences Uniques',
        location: 'Divers lieux emblématiques',
        confidence: 82,
        reason: 'Basé sur vos recherches récentes et votre profil',
        timeToVisit: 'Golden hour (17h-19h)',
        estimatedCost: '150€',
        difficulty: 'easy',
        personalityMatch: 91,
        trending: false,
        imageUrl: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ];

    // Filter recommendations based on user plan
    let filteredRecommendations = mockRecommendations;
    if (userPlan === 'free') {
      filteredRecommendations = mockRecommendations.slice(0, 2);
    } else if (userPlan === 'premium') {
      filteredRecommendations = mockRecommendations.slice(0, 3);
    }

    setRecommendations(filteredRecommendations);
    setIsLoading(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return t.easy;
      case 'medium': return t.medium;
      case 'hard': return t.hard;
      default: return difficulty;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
            <h3 className="text-lg font-semibold mb-2">Analyse de vos préférences...</h3>
            <p className="text-muted-foreground">Notre IA génère vos recommandations personnalisées</p>
            <Progress value={75} className="w-64 mx-auto mt-4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">{t.noData}</h3>
            <p className="text-muted-foreground">{t.exploreMore}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          {t.title}
        </h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
        <Badge className="mt-2 bg-gradient-to-r from-primary to-accent text-white">
          <Zap className="h-3 w-3 mr-1" />
          {t.aiPowered}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={rec.imageUrl} 
                alt={rec.title}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge className="bg-primary text-white">
                  {rec.confidence}% {t.confidence}
                </Badge>
                {rec.trending && (
                  <Badge className="bg-orange-500 text-white">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {t.trending}
                  </Badge>
                )}
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{rec.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{rec.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{rec.timeToVisit}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{rec.estimatedCost}</span>
                  <span className={`font-medium ${getDifficultyColor(rec.difficulty)}`}>
                    {getDifficultyLabel(rec.difficulty)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span>{t.personalityMatch}</span>
                  <span className="font-medium">{rec.personalityMatch}%</span>
                </div>
                <Progress value={rec.personalityMatch} className="h-2" />
              </div>
              
              <div className="bg-muted/50 p-3 rounded-lg mb-4">
                <div className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-primary mb-1">{t.reason}:</p>
                    <p className="text-xs text-muted-foreground">{rec.reason}</p>
                  </div>
                </div>
              </div>
              
              <Button className="w-full">
                <Heart className="h-4 w-4 mr-2" />
                Ajouter aux favoris
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {userPlan === 'free' && (
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">{t.upgradeForMore}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Débloquez des recommandations illimitées et plus précises avec l'IA avancée
            </p>
            <Button>
              Passer au Premium
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}