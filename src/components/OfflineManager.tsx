import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, Wifi, WifiOff, Check, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface OfflineManagerProps {
  language: 'fr' | 'en';
  guideData: any;
}

const translations = {
  fr: {
    title: "Mode Hors Ligne",
    subtitle: "Téléchargez le guide pour l'utiliser sans connexion",
    downloadGuide: "Télécharger le guide complet",
    downloading: "Téléchargement en cours...",
    downloaded: "Guide téléchargé",
    available: "Disponible hors ligne",
    notAvailable: "Non disponible hors ligne",
    storage: "Stockage utilisé",
    lastUpdate: "Dernière mise à jour",
    updateAvailable: "Mise à jour disponible",
    update: "Mettre à jour",
    delete: "Supprimer",
    categories: "catégories",
    activities: "activités",
    offline: "Vous êtes hors ligne",
    online: "Vous êtes en ligne"
  },
  en: {
    title: "Offline Mode",
    subtitle: "Download the guide to use it without connection",
    downloadGuide: "Download complete guide",
    downloading: "Downloading...",
    downloaded: "Guide downloaded",
    available: "Available offline",
    notAvailable: "Not available offline",
    storage: "Storage used",
    lastUpdate: "Last update",
    updateAvailable: "Update available",
    update: "Update",
    delete: "Delete",
    categories: "categories",
    activities: "activities",
    offline: "You are offline",
    online: "You are online"
  }
};

export default function OfflineManager({ language, guideData }: OfflineManagerProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [offlineData, setOfflineData] = useState<any>(null);
  const [storageSize, setStorageSize] = useState(0);
  const t = translations[language];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline data
    loadOfflineData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineData = () => {
    const stored = localStorage.getItem('marrakech-offline-guide');
    if (stored) {
      const data = JSON.parse(stored);
      setOfflineData(data);
      setStorageSize(new Blob([stored]).size);
    }
  };

  const downloadGuide = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Simulate download progress
      const steps = 10;
      for (let i = 0; i <= steps; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setDownloadProgress((i / steps) * 100);
      }

      // Prepare offline data
      const offlineGuideData = {
        guideData,
        downloadDate: new Date().toISOString(),
        version: '1.0.0',
        language,
        totalCategories: Object.keys(guideData).length,
        totalActivities: Object.values(guideData).flat().length
      };

      // Store in localStorage
      localStorage.setItem('marrakech-offline-guide', JSON.stringify(offlineGuideData));
      
      // Register service worker for offline functionality
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/sw.js');
        } catch (error) {
          console.log('Service worker registration failed:', error);
        }
      }

      setOfflineData(offlineGuideData);
      setStorageSize(new Blob([JSON.stringify(offlineGuideData)]).size);
      toast(t.downloaded);
    } catch (error) {
      toast("Erreur lors du téléchargement");
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const deleteOfflineData = () => {
    localStorage.removeItem('marrakech-offline-guide');
    setOfflineData(null);
    setStorageSize(0);
    toast("Données hors ligne supprimées");
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          {t.title}
        </CardTitle>
        <p className="text-muted-foreground">{t.subtitle}</p>
        
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <Badge variant={isOnline ? "default" : "destructive"}>
            {isOnline ? t.online : t.offline}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Download Section */}
        {!offlineData ? (
          <div className="space-y-4">
            <Button
              onClick={downloadGuide}
              disabled={isDownloading}
              className="w-full"
            >
              {isDownloading ? (
                <>
                  <Download className="h-4 w-4 mr-2 animate-pulse" />
                  {t.downloading}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  {t.downloadGuide}
                </>
              )}
            </Button>
            
            {isDownloading && (
              <div className="space-y-2">
                <Progress value={downloadProgress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  {Math.round(downloadProgress)}%
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Offline Status */}
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">{t.available}</span>
            </div>
            
            {/* Offline Data Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {offlineData.totalCategories}
                </div>
                <div className="text-sm text-muted-foreground">{t.categories}</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {offlineData.totalActivities}
                </div>
                <div className="text-sm text-muted-foreground">{t.activities}</div>
              </div>
            </div>
            
            {/* Storage Info */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t.storage}:</span>
                <span className="font-medium">{formatBytes(storageSize)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>{t.lastUpdate}:</span>
                <span className="font-medium">
                  {new Date(offlineData.downloadDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={downloadGuide}
                className="flex-1"
              >
                {t.update}
              </Button>
              
              <Button
                variant="destructive"
                onClick={deleteOfflineData}
                className="flex-1"
              >
                {t.delete}
              </Button>
            </div>
          </div>
        )}
        
        {/* Offline Features Info */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Fonctionnalités hors ligne :</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Accès à toutes les activités et informations</li>
            <li>• Recherche et filtres fonctionnels</li>
            <li>• Gestion des favoris</li>
            <li>• Cartes et itinéraires (limités)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}