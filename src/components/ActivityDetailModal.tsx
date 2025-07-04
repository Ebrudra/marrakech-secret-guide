import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Lightbulb, ExternalLink, Navigation } from "lucide-react";
import FavoritesManager from "./FavoritesManager";

interface Activity {
  "Thématique": string;
  "Activité": string;
  "Adresse": string;
  "Tél.": string;
  "Réservation": string;
  "Commentaires": string;
}

interface ActivityDetailModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  language: 'fr' | 'en';
}

const translations = {
  fr: {
    reservation: "Réservation :",
    tip: "Le petit plus",
    getDirections: "Itinéraire",
    call: "Appeler",
    category: "Catégorie",
    noAddress: "Adresse non disponible",
    noPhone: "Téléphone non disponible"
  },
  en: {
    reservation: "Reservation:",
    tip: "Insider tip",
    getDirections: "Directions",
    call: "Call",
    category: "Category",
    noAddress: "Address not available",
    noPhone: "Phone not available"
  }
};

export default function ActivityDetailModal({ activity, isOpen, onClose, language }: ActivityDetailModalProps) {
  const t = translations[language];

  if (!activity) return null;

  const openAddress = (address: string) => {
    if (address) {
      window.open(`https://maps.google.com/?q=${encodeURIComponent(address + ", Marrakech")}`, '_blank');
    }
  };

  const openPhone = (phone: string) => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  // Extract opening hours from comments if available
  const extractOpeningHours = (comments: string) => {
    const hourMatch = comments.match(/horaire\s*:?\s*([^.]+)/i);
    return hourMatch ? hourMatch[1].trim() : null;
  };

  const openingHours = extractOpeningHours(activity.Commentaires);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold pr-8">
            {activity.Activité}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {t.category}: {activity.Thématique}
            </Badge>
          </div>

          {/* Main Info */}
          <div className="space-y-4">
            {/* Address */}
            {activity.Adresse ? (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-foreground">{activity.Adresse}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAddress(activity.Adresse)}
                    className="mt-2 flex items-center gap-2"
                  >
                    <Navigation className="h-4 w-4" />
                    {t.getDirections}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{t.noAddress}</span>
              </div>
            )}

            {/* Phone */}
            {activity["Tél."] && activity["Tél."] !== "–" ? (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="flex items-center gap-2">
                  <span className="text-foreground">{activity["Tél."]}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openPhone(activity["Tél."])}
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-3 w-3" />
                    {t.call}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-5 w-5" />
                <span>{t.noPhone}</span>
              </div>
            )}

            {/* Opening Hours */}
            {openingHours && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground">{openingHours}</span>
              </div>
            )}

            {/* Reservation */}
            {activity.Réservation && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-primary">{t.reservation} </span>
                  <span className="text-foreground">{activity.Réservation}</span>
                </div>
              </div>
            )}
          </div>

          {/* Comments/Description */}
          {activity.Commentaires && (
            <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary/30">
              <div className="flex items-start gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <span className="font-medium text-primary text-sm">{t.tip}</span>
              </div>
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {activity.Commentaires}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="border-t pt-4">
            <FavoritesManager 
              activity={activity} 
              language={language}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}