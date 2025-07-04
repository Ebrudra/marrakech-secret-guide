import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Missing Gemini API key. Please check your .env file.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  private isApiAvailable = true;

  async generateItinerary(preferences: string, availableActivities: any[]) {
    try {
      // Check if API is available
      if (!this.isApiAvailable) {
        console.warn('Gemini API unavailable, using fallback');
        return this.createFallbackItinerary(availableActivities);
      }
      
      // Check if we have activities
      if (!availableActivities || availableActivities.length === 0) {
        console.warn('No activities available, using fallback');
        return this.createFallbackItinerary([]);
      }
      
      const activitiesContext = availableActivities.map(activity => ({
        name: activity.name,
        category: activity.categories?.name || 'Unknown',
        description: activity.description,
        location: activity.street_address || activity.city,
        rating: activity.average_rating,
        comments: activity.comments
      }));

      const prompt = `
Tu es un expert guide touristique de Marrakech. Crée un itinéraire personnalisé basé sur ces préférences utilisateur :

"${preferences}"

Voici les activités disponibles à Marrakech :
${JSON.stringify(activitiesContext, null, 2)}

Instructions :
1. Crée un itinéraire de 1-3 jours basé sur les préférences
2. Sélectionne 4-6 activités parmi celles disponibles
3. Organise-les de manière logique (géographiquement et temporellement)
4. Inclus des horaires réalistes
5. Ajoute des conseils pratiques et des raisons pour chaque recommandation
6. Réponds UNIQUEMENT en JSON valide avec cette structure :

{
  "itinerary": [
    {
      "time": "09:00",
      "activity": "Nom exact de l'activité",
      "location": "Lieu",
      "duration": "2h30",
      "description": "Pourquoi cette activité correspond aux préférences",
      "category": "Catégorie",
      "tips": "Conseils pratiques"
    }
  ],
  "summary": "Résumé de l'itinéraire en 2-3 phrases",
  "totalDuration": "1 jour",
  "estimatedBudget": "€€"
}

Assure-toi que les noms d'activités correspondent EXACTEMENT à ceux de la liste fournie.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const itineraryData = JSON.parse(jsonMatch[0]);
            return itineraryData;
          } catch (jsonError) {
            console.error('Failed to parse JSON from Gemini response:', jsonError);
            return this.createFallbackItinerary(availableActivities);
          }
        } else {
          console.warn('No JSON found in Gemini response, using fallback');
          return this.createFallbackItinerary(availableActivities);
        }
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', text);
        // Fallback to a basic itinerary
        return this.createFallbackItinerary(availableActivities);
      }

    } catch (error) {
      console.error('Gemini API error:', error);
      // Mark API as unavailable if we get a 404 or other serious error
      if (error.toString().includes('404') || error.toString().includes('not found')) {
        this.isApiAvailable = false;
      }
      // Return fallback itinerary
      return this.createFallbackItinerary(availableActivities);
    }
  }

  private createFallbackItinerary(activities: any[]) {
    const featured = activities.filter(a => a.is_featured).slice(0, 4);
    const selected = featured.length >= 4 ? featured : 
                    (activities.length > 0 ? activities.slice(0, 4) : this.createDummyActivities());

    return {
      itinerary: selected.map((activity, index) => ({
        time: `${9 + index * 3}:00`,
        activity: activity.name,
        location: activity.street_address || activity.city || 'Marrakech',
        duration: '2h',
        description: activity.description || activity.comments || 'Activité recommandée',
        category: activity.categories?.name || 'Découverte',
        tips: 'Réservation recommandée'
      })),
      summary: 'Itinéraire découverte de Marrakech avec les activités les plus populaires',
      totalDuration: '1 jour',
      estimatedBudget: '€€'
    };
  }
  
  private createDummyActivities() {
    return [
      {
        name: "Jardin Majorelle",
        street_address: "Rue Yves Saint Laurent, Guéliz",
        city: "Marrakech",
        description: "Magnifique jardin botanique créé par Jacques Majorelle",
        categories: { name: "Culture & Musées" }
      },
      {
        name: "Place Jemaa el-Fnaa",
        street_address: "Médina",
        city: "Marrakech",
        description: "Place emblématique au cœur de la médina",
        categories: { name: "Visites & découvertes" }
      },
      {
        name: "Palais Bahia",
        street_address: "Rue Riad Zitoun el Jdid",
        city: "Marrakech",
        description: "Palais du 19ème siècle avec jardins et architecture marocaine",
        categories: { name: "Culture & Musées" }
      },
      {
        name: "Souk Semmarine",
        street_address: "Médina",
        city: "Marrakech",
        description: "Principal souk de Marrakech pour l'artisanat",
        categories: { name: "Shopping & design" }
      }
    ];
  }

  async generateActivityRecommendations(userPreferences: string[], viewedActivities: any[]) {
    try {
      const prompt = `
Basé sur ces préférences utilisateur : ${userPreferences.join(', ')}
Et ces activités déjà vues : ${viewedActivities.map(a => a.name).join(', ')}

Génère 3 recommandations d'activités similaires à Marrakech.
Réponds en JSON avec cette structure :
{
  "recommendations": [
    {
      "title": "Nom de l'activité",
      "description": "Description courte",
      "category": "Catégorie",
      "reason": "Pourquoi cette recommandation"
    }
  ]
}
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Gemini recommendations error:', error);
    }

    return {
      recommendations: [
        {
          title: "Explorez plus d'activités",
          description: "Découvrez d'autres expériences à Marrakech",
          category: "Découverte",
          reason: "Basé sur vos intérêts"
        }
      ]
    };
  }
}

export const geminiService = new GeminiService();