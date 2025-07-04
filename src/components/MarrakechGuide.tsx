import React, { useState } from 'react';
import { Button } from './ui/button';
import { NotificationManager } from './NotificationManager';
import { AIItineraryPlanner } from './AIItineraryPlanner';

interface MarrakechGuideProps {
  language?: string;
}

export const MarrakechGuide: React.FC<MarrakechGuideProps> = ({ language = 'en' }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIPlanner, setShowAIPlanner] = useState(false);

  // Placeholder translations
  const t = {
    backToGuide: 'Back to Guide',
    notifications: 'Notifications',
    aiPlanner: 'AI Planner',
    welcome: 'Welcome to Marrakech Guide'
  };

  // Placeholder function for getting activities
  const getAllActivities = () => {
    return [
      { id: 1, name: 'Jemaa el-Fnaa', type: 'attraction' },
      { id: 2, name: 'Majorelle Garden', type: 'garden' },
      { id: 3, name: 'Koutoubia Mosque', type: 'religious' }
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        {showNotifications ? (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <Button
                variant="ghost"
                onClick={() => setShowNotifications(false)}
                className="mb-4"
              >
                ← {t.backToGuide}
              </Button>
            </div>
            <NotificationManager language={language} />
          </div>
        ) : showAIPlanner ? (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <Button
                variant="ghost"
                onClick={() => setShowAIPlanner(false)}
                className="mb-4"
              >
                ← {t.backToGuide}
              </Button>
            </div>
            <AIItineraryPlanner 
              language={language} 
              availableActivities={getAllActivities()}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {t.welcome}
              </h1>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => setShowNotifications(true)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {t.notifications}
                </Button>
                <Button
                  onClick={() => setShowAIPlanner(true)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {t.aiPlanner}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarrakechGuide;