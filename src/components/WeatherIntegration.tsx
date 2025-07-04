import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sun, Cloud, CloudRain, Wind, Thermometer, Droplets, Eye, Umbrella } from "lucide-react";

interface WeatherData {
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    uvIndex: number;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
  }>;
  recommendations: string[];
}

interface WeatherIntegrationProps {
  language: 'fr' | 'en';
}

const translations = {
  fr: {
    title: "Météo & Recommandations",
    subtitle: "Conditions actuelles et suggestions d'activités",
    current: "Maintenant",
    forecast: "Prévisions 5 jours",
    temperature: "Température",
    humidity: "Humidité",
    wind: "Vent",
    visibility: "Visibilité",
    uvIndex: "Index UV",
    recommendations: "Recommandations météo",
    perfectFor: "Parfait pour",
    avoid: "À éviter",
    bringUmbrella: "Prenez un parapluie",
    sunProtection: "Protection solaire recommandée",
    idealWeather: "Temps idéal pour les activités extérieures",
    stayHydrated: "Restez hydraté",
    conditions: {
      sunny: "Ensoleillé",
      cloudy: "Nuageux",
      rainy: "Pluvieux",
      windy: "Venteux"
    }
  },
  en: {
    title: "Weather & Recommendations",
    subtitle: "Current conditions and activity suggestions",
    current: "Now",
    forecast: "5-day forecast",
    temperature: "Temperature",
    humidity: "Humidity",
    wind: "Wind",
    visibility: "Visibility",
    uvIndex: "UV Index",
    recommendations: "Weather recommendations",
    perfectFor: "Perfect for",
    avoid: "Avoid",
    bringUmbrella: "Bring an umbrella",
    sunProtection: "Sun protection recommended",
    idealWeather: "Ideal weather for outdoor activities",
    stayHydrated: "Stay hydrated",
    conditions: {
      sunny: "Sunny",
      cloudy: "Cloudy",
      rainy: "Rainy",
      windy: "Windy"
    }
  }
};

export default function WeatherIntegration({ language }: WeatherIntegrationProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    
    // Simulate API call - in production, use a real weather API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock weather data for Marrakech
    const mockData: WeatherData = {
      current: {
        temperature: 24,
        condition: 'sunny',
        humidity: 45,
        windSpeed: 12,
        visibility: 10,
        uvIndex: 7
      },
      forecast: [
        { date: '2024-03-15', high: 26, low: 14, condition: 'sunny', precipitation: 0 },
        { date: '2024-03-16', high: 28, low: 16, condition: 'sunny', precipitation: 0 },
        { date: '2024-03-17', high: 25, low: 15, condition: 'cloudy', precipitation: 10 },
        { date: '2024-03-18', high: 22, low: 13, condition: 'rainy', precipitation: 80 },
        { date: '2024-03-19', high: 24, low: 14, condition: 'sunny', precipitation: 5 }
      ],
      recommendations: [
        "Parfait pour visiter les jardins Majorelle",
        "Idéal pour une balade dans la médina",
        "Excellentes conditions pour les terrasses",
        "Protection solaire recommandée"
      ]
    };
    
    setWeatherData(mockData);
    setIsLoading(false);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'windy': return <Wind className="h-6 w-6 text-gray-600" />;
      default: return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getActivityRecommendations = (condition: string, temperature: number) => {
    const recommendations = [];
    
    if (condition === 'sunny' && temperature > 20) {
      recommendations.push({
        type: 'perfect',
        activities: ['Jardins et parcs', 'Terrasses et rooftops', 'Piscines et spas']
      });
    }
    
    if (condition === 'rainy') {
      recommendations.push({
        type: 'avoid',
        activities: ['Activités extérieures', 'Randonnées Atlas']
      });
      recommendations.push({
        type: 'perfect',
        activities: ['Musées', 'Hammams', 'Shopping couvert']
      });
    }
    
    if (temperature > 30) {
      recommendations.push({
        type: 'advice',
        text: t.stayHydrated
      });
    }
    
    return recommendations;
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center">
            <Sun className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
            <p className="text-muted-foreground">Chargement des données météo...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) return null;

  const activityRecs = getActivityRecommendations(weatherData.current.condition, weatherData.current.temperature);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Current Weather */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getWeatherIcon(weatherData.current.condition)}
            {t.current} - Marrakech
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Thermometer className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{weatherData.current.temperature}°C</div>
              <div className="text-sm text-muted-foreground">{t.temperature}</div>
            </div>
            
            <div className="text-center">
              <Droplets className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{weatherData.current.humidity}%</div>
              <div className="text-sm text-muted-foreground">{t.humidity}</div>
            </div>
            
            <div className="text-center">
              <Wind className="h-6 w-6 mx-auto mb-2 text-gray-500" />
              <div className="text-2xl font-bold">{weatherData.current.windSpeed} km/h</div>
              <div className="text-sm text-muted-foreground">{t.wind}</div>
            </div>
            
            <div className="text-center">
              <Eye className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{weatherData.current.visibility} km</div>
              <div className="text-sm text-muted-foreground">{t.visibility}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>{t.forecast}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-sm font-medium mb-2">
                  {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                </div>
                <div className="mb-2">
                  {getWeatherIcon(day.condition)}
                </div>
                <div className="text-sm">
                  <div className="font-semibold">{day.high}°</div>
                  <div className="text-muted-foreground">{day.low}°</div>
                </div>
                {day.precipitation > 0 && (
                  <div className="text-xs text-blue-500 mt-1">
                    <Umbrella className="h-3 w-3 inline mr-1" />
                    {day.precipitation}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>{t.recommendations}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityRecs.map((rec, index) => (
              <div key={index}>
                {rec.type === 'perfect' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      {t.perfectFor}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.activities?.map((activity, i) => (
                        <Badge key={i} className="bg-green-100 text-green-800">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {rec.type === 'avoid' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <Umbrella className="h-4 w-4" />
                      {t.avoid}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.activities?.map((activity, i) => (
                        <Badge key={i} className="bg-red-100 text-red-800">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {rec.type === 'advice' && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 font-medium">{rec.text}</p>
                  </div>
                )}
              </div>
            ))}
            
            {/* General recommendations */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Conseils généraux:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {weatherData.recommendations.map((rec, index) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}