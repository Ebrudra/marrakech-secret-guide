import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Calendar, MapPin, Star, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface NotificationSettings {
  enabled: boolean;
  newActivities: boolean;
  favoriteUpdates: boolean;
  itineraryReminders: boolean;
  specialOffers: boolean;
  weeklyDigest: boolean;
}

interface NotificationManagerProps {
  language: 'fr' | 'en';
}

const translations = {
  fr: {
    title: "Notifications",
    subtitle: "Restez informé des nouveautés et recommandations",
    enableNotifications: "Activer les notifications",
    newActivities: "Nouvelles activités",
    newActivitiesDesc: "Soyez alerté des nouvelles adresses ajoutées",
    favoriteUpdates: "Mises à jour des favoris",
    favoriteUpdatesDesc: "Changements d'horaires ou d'informations",
    itineraryReminders: "Rappels d'itinéraire",
    itineraryRemindersDesc: "Notifications pour vos activités planifiées",
    specialOffers: "Offres spéciales",
    specialOffersDesc: "Promotions et réductions exclusives",
    weeklyDigest: "Résumé hebdomadaire",
    weeklyDigestDesc: "Récapitulatif des tendances et nouveautés",
    requestPermission: "Autoriser les notifications",
    permissionGranted: "Notifications autorisées",
    permissionDenied: "Notifications refusées",
    testNotification: "Tester les notifications",
    notificationSent: "Notification de test envoyée",
    browserNotSupported: "Votre navigateur ne supporte pas les notifications"
  },
  en: {
    title: "Notifications",
    subtitle: "Stay informed about news and recommendations",
    enableNotifications: "Enable notifications",
    newActivities: "New activities",
    newActivitiesDesc: "Get alerted about new places added",
    favoriteUpdates: "Favorite updates",
    favoriteUpdatesDesc: "Changes in schedules or information",
    itineraryReminders: "Itinerary reminders",
    itineraryRemindersDesc: "Notifications for your planned activities",
    specialOffers: "Special offers",
    specialOffersDesc: "Exclusive promotions and discounts",
    weeklyDigest: "Weekly digest",
    weeklyDigestDesc: "Summary of trends and news",
    requestPermission: "Allow notifications",
    permissionGranted: "Notifications allowed",
    permissionDenied: "Notifications denied",
    testNotification: "Test notifications",
    notificationSent: "Test notification sent",
    browserNotSupported: "Your browser doesn't support notifications"
  }
};

export default function NotificationManager({ language }: NotificationManagerProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    newActivities: true,
    favoriteUpdates: true,
    itineraryReminders: true,
    specialOffers: false,
    weeklyDigest: true
  });
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const t = translations[language];

  useEffect(() => {
    // Load notification settings
    const saved = localStorage.getItem('marrakech-notification-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }

    // Check current permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('marrakech-notification-settings', JSON.stringify(newSettings));
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast(t.browserNotSupported);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        toast(t.permissionGranted);
        saveSettings({ ...settings, enabled: true });
      } else {
        toast(t.permissionDenied);
        saveSettings({ ...settings, enabled: false });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted' && settings.enabled) {
      new Notification('Guide de Marrakech', {
        body: 'Vos notifications fonctionnent parfaitement ! 🌟',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-notification'
      });
      toast(t.notificationSent);
    }
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  // Schedule notifications based on user preferences
  const scheduleNotifications = () => {
    if (!settings.enabled || permission !== 'granted') return;

    // Example: Schedule weekly digest
    if (settings.weeklyDigest) {
      // This would typically be handled by a service worker
      console.log('Weekly digest scheduled');
    }

    // Example: Check for itinerary reminders
    if (settings.itineraryReminders) {
      const itineraries = JSON.parse(localStorage.getItem('marrakech-saved-itineraries') || '[]');
      // Process itineraries for upcoming activities
      console.log('Itinerary reminders checked');
    }
  };

  useEffect(() => {
    scheduleNotifications();
  }, [settings]);

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return <Badge className="bg-green-100 text-green-800">{t.permissionGranted}</Badge>;
      case 'denied':
        return <Badge variant="destructive">{t.permissionDenied}</Badge>;
      default:
        return <Badge variant="outline">Non configuré</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {settings.enabled ? (
            <Bell className="h-5 w-5 text-primary" />
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
          {t.title}
        </CardTitle>
        <p className="text-muted-foreground">{t.subtitle}</p>
        <div className="flex items-center gap-2">
          {getPermissionBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label className="text-base font-medium">{t.enableNotifications}</Label>
            <p className="text-sm text-muted-foreground">
              Autoriser les notifications push
            </p>
          </div>
          <div className="flex items-center gap-2">
            {permission !== 'granted' && (
              <Button
                variant="outline"
                size="sm"
                onClick={requestNotificationPermission}
              >
                {t.requestPermission}
              </Button>
            )}
            <Switch
              checked={settings.enabled && permission === 'granted'}
              onCheckedChange={() => {
                if (permission === 'granted') {
                  toggleSetting('enabled');
                } else {
                  requestNotificationPermission();
                }
              }}
              disabled={permission === 'denied'}
            />
          </div>
        </div>

        {/* Notification Types */}
        {settings.enabled && permission === 'granted' && (
          <div className="space-y-4">
            <h4 className="font-medium">Types de notifications :</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <div>
                    <Label className="text-sm font-medium">{t.newActivities}</Label>
                    <p className="text-xs text-muted-foreground">{t.newActivitiesDesc}</p>
                  </div>
                </div>
                <Switch
                  checked={settings.newActivities}
                  onCheckedChange={() => toggleSetting('newActivities')}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-primary" />
                  <div>
                    <Label className="text-sm font-medium">{t.favoriteUpdates}</Label>
                    <p className="text-xs text-muted-foreground">{t.favoriteUpdatesDesc}</p>
                  </div>
                </div>
                <Switch
                  checked={settings.favoriteUpdates}
                  onCheckedChange={() => toggleSetting('favoriteUpdates')}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <Label className="text-sm font-medium">{t.itineraryReminders}</Label>
                    <p className="text-xs text-muted-foreground">{t.itineraryRemindersDesc}</p>
                  </div>
                </div>
                <Switch
                  checked={settings.itineraryReminders}
                  onCheckedChange={() => toggleSetting('itineraryReminders')}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div>
                    <Label className="text-sm font-medium">{t.specialOffers}</Label>
                    <p className="text-xs text-muted-foreground">{t.specialOffersDesc}</p>
                  </div>
                </div>
                <Switch
                  checked={settings.specialOffers}
                  onCheckedChange={() => toggleSetting('specialOffers')}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-primary" />
                  <div>
                    <Label className="text-sm font-medium">{t.weeklyDigest}</Label>
                    <p className="text-xs text-muted-foreground">{t.weeklyDigestDesc}</p>
                  </div>
                </div>
                <Switch
                  checked={settings.weeklyDigest}
                  onCheckedChange={() => toggleSetting('weeklyDigest')}
                />
              </div>
            </div>

            {/* Test Button */}
            <Button
              variant="outline"
              onClick={sendTestNotification}
              className="w-full"
            >
              {t.testNotification}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}