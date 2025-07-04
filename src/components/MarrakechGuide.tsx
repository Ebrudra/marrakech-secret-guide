import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Globe, Lightbulb, Clock, Languages, Menu, X, Sparkles, Eye } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import FavoritesManager from "./FavoritesManager";
import AIItineraryPlanner from "./AIItineraryPlanner";
import ActivityDetailModal from "./ActivityDetailModal";
import UserProfileManager from "./UserProfileManager";
import OfflineManager from "./OfflineManager";
import NotificationManager from "./NotificationManager";
import heroImage from "@/assets/marrakech-hero.jpg";
import { analytics, trackInteraction } from "@/lib/analytics";
import { seoManager } from "@/lib/seo";

interface Activity {
  "Thématique": string;
  "Activité": string;
  "Adresse": string;
  "Tél.": string;
  "Réservation": string;
  "Commentaires": string;
}

const guideData = {
  "Guide Touristique": [
    {
      "Thématique": "Visite de la Medina",
      "Activité": "Guide local Abdoul",
      "Adresse": "",
      "Tél.": "212670720118",
      "Réservation": "Appelez de la part de Yann",
      "Commentaires": "Guide expert de la médina, recommandé pour découvrir les secrets de Marrakech"
    }
  ],
  "Culture & Musées": [
    {
      "Thématique": "Culture & Musées",
      "Activité": "Maison de la Photographie",
      "Adresse": "Medina - Rue Ahl Fes, 46 Rue Bin Lafnadek",
      "Tél.": "+212 5243-85721",
      "Réservation": "Non obligatoire, mais conseillé",
      "Commentaires": "Photos historiques et magnifique rooftop avec vue. Horaire : 10h à 19h00"
    },
    {
      "Thématique": "Culture & Musées",
      "Activité": "Musée Yves Saint Laurent + Musée Berbère + Jardin Majorelle",
      "Adresse": "Rue Yves Saint Laurent, Guéliz",
      "Tél.": "+212 5243-13047",
      "Réservation": "Oui, en ligne",
      "Commentaires": "Trio incontournable de Marrakech. Horaire : 10h à 18h30"
    },
    {
      "Thématique": "Culture & Musées",
      "Activité": "Musée des confluences pour prendre une pâtisserie/thé au café Bâcha",
      "Adresse": "Dar El Bacha, Rue Fatima Zahra",
      "Tél.": "+212 5243-13047",
      "Réservation": "Oui pour le café",
      "Commentaires": "Parfait pour une pause culturelle et gourmande. Horaire : 10h à 18h00"
    },
    {
      "Thématique": "Culture & Musées",
      "Activité": "Bahia Palace + jardins",
      "Adresse": "Palais Bahia. Bahia Palace, Rue Riad Zitoun el Jdid",
      "Tél.": "",
      "Réservation": "Non",
      "Commentaires": "Palais somptueux avec jardins traditionnels. Horaire : 09h à 17h00"
    },
    {
      "Thématique": "Culture & Musées",
      "Activité": "Le monde des Arts de la Parure",
      "Adresse": "39, 40 Ksibat Nhass",
      "Tél.": "+212 8086-58561",
      "Réservation": "Non",
      "Commentaires": "Musée dédié aux bijoux et parures traditionnels marocains. Horaire : 10h à 17h30."
    },
    {
      "Thématique": "Culture & Musées",
      "Activité": "Moroccan Culinary Arts Museum (palais historic + rooftop)",
      "Adresse": "Rue Riad Zitoun el Jdid,,Médina",
      "Tél.": "+212 5244-27177",
      "Réservation": "Oui, pour repas/cours (instagram.com, nomadmarrakech.com, instagram.com)",
      "Commentaires": "Découvrez l'art culinaire marocain dans un cadre historique. Horaire : 09h à 20h00. "
    }
  ],
  "Visites & découvertes": [
    {
      "Thématique": "Visites & découvertes",
      "Activité": "Balade dans les souks + place Jemaa el‑Fna + Place des épices",
      "Adresse": "Médina",
      "Tél.": "–",
      "Réservation": "Avec guide Abdoul",
      "Commentaires": "L'expérience authentique de la médina avec un guide local expert"
    },
    {
      "Thématique": "Visites & découvertes",
      "Activité": "Ourika Valley",
      "Adresse": "Ourika",
      "Tél.": "via agence",
      "Réservation": "Oui",
      "Commentaires": "Marché, cascades, trek - Sortie d'une journée en montagne"
    },
    {
      "Thématique": "Visites & découvertes",
      "Activité": "Le Flouka restaurant - Lac Lalla Takerkoust",
      "Adresse": "Barrage Lalla Takerkoust",
      "Tél.": "+212 664-492660",
      "Réservation": "Oui",
      "Commentaires": "Sortie d'une journée au bord du lac avec restaurant de qualité. https://www.leflouka-marrakech.com/hotel/"
    },
    {
      "Thématique": "Visites & découvertes",
      "Activité": "Journée Désert Agafay",
      "Adresse": "Agafay",
      "Tél.": "via agence ou hôtel",
      "Réservation": "Oui",
      "Commentaires": "Quad, bivouac, animations - Expérience désert authentique"
    },
    {
      "Thématique": "Visites & découvertes",
      "Activité": "Cascades d'Ouzoud",
      "Adresse": "150 KM au Nord-Est de Marrakech",
      "Tél.": "via agence ou hôtel",
      "Réservation": "Oui, à l'avance",
      "Commentaires": "Sortie d'une journée pour découvrir les magnifiques cascades d'Ouzoud"
    }
  ],
  "Bien-être & détente": [
    {
      "Thématique": "Bien-être & détente",
      "Activité": "Héritage Spa",
      "Adresse": "40, Arset Aouzal Bad Doukkala",
      "Tél.": "212 (0) 5 24 39 04 07",
      "Réservation": "Oui",
      "Commentaires": "Spa d'exception dans un riad authentique. Atmosphère intimiste et paisible, décoration soignée et précieuse."
    },
    {
      "Thématique": "Bien-être & détente",
      "Activité": "Riad Laz Mimoun & Spa",
      "Adresse": "113 Derb Sidi Mbarek, Médina",
      "Tél.": "212624648730",
      "Réservation": "Oui",
      "Commentaires": "Spa traditionnel avec tadelakt et massothérapie personnalisée"
    },
    {
      "Thématique": "Bien-être & détente",
      "Activité": "Beldi Country Club",
      "Adresse": "Route Ourika - KM6 route du Barrage BP 210, Marrakech 40000",
      "Tél.": "05243-83950",
      "Réservation": "Conseillée",
      "Commentaires": "Piscine et hammam dans un cadre verdoyant hors de la ville"
    }
  ],
  "Se sustenter & Apéros & Tea Time": [
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Nomad – rooftop moderne (tagines fusion)",
      "Adresse": "1 Derb Aarjane, Médina",
      "Tél.": "+212 524 381 609 / 661 451 519",
      "Réservation": "Oui (groupe ≥ 5)",
      "Commentaires": "Avec sa superbe vue sur une oasis de palmiers et son incroyable coucher de soleil en font l'un des spots les plus prisés de la ville de Marrakech.\n\nAvec un cadre moderne et épuré, le Nomad Bar Marrakech offre une atmosphère chic et conviviale, l'endroit idoine pour savourer les excellents cocktails signature ou déguster les succulents tapas du chef, le tout, dans une ambiance festive rythmée par les sets du Dj résident."
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Le Grand Bazar",
      "Adresse": "Place Jemaa El Fna",
      "Tél.": "Passer par Yann pour la Réservation",
      "Réservation": "Oui",
      "Commentaires": "En plein coeur de la place Jamaa El Fna, Le Grand Bazar est un restaurant innovant dans un cadre à la fois unique et mémorable. Vous serez transporté vers une véritable expérience culinaire aux saveurs marocaines et internationales.\n\nDans un décor digne d'un conte des mille et une nuits, ce lieu atypique mélange un restaurant et un cabinet de curiosités pour créer un monde enchanté grâce à des animations captivantes tous les soirs (musiciens, chanteurs, magiciens..). Des soirées inoubliables vous y attendent !"
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "La maison Arabe",
      "Adresse": "1 Derb Assehbi",
      "Tél.": "+212 6 53 06 80 80",
      "Réservation": "Oui",
      "Commentaires": "Idéalement situé au cœur de la ville ocre, ce prestigieux palais vous accueillera dans des tables chics, soigneusement organisées autour d'une très belle piscine, sous les arcs de pierres ou dans le petit jardin arboré.\n\nVous pouvez également réserver une table dans la somptueuse salle de restaurant élégamment décorée dans un style purement oriental avec des tapis berbères, des plafonds peints à la main et des lanternes typiquement marocaines."
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Mazel Café",
      "Adresse": "8 Place des Ferblantiers",
      "Tél.": "+212 661-662824",
      "Réservation": "Non",
      "Commentaires": "Niché au cœur vibrant de la médina de Marrakech, Mazel Café est un véritable joyau culinaire, idéalement situé entre le Palais Badi et le Palais Bahia,"
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Les Terrasses des Epices",
      "Adresse": "15, souk cherifia, sidi abdelaziz, Marrakech Médina",
      "Tél.": "+212524375904",
      "Réservation": "Oui",
      "Commentaires": "https://www.terrassedesepices.com/\nOuvert tous les jours de 12h00 à 17h00 et de 18h30 à 00h30, c'est au rythme des meilleurs Dj et musiciens de la ville que l'expérience Terrasse des épices prend toute sa dimension."
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "La Mamounia",
      "Adresse": "Avenue Bab Jdid,",
      "Tél.": "+212524388600",
      "Réservation": "Oui",
      "Commentaires": "Prendre un tea Time, glâce ou même diner. Formule Brunch, extraordinaire. Je recommande Il y a 4 restaurant. "
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Le Kabana Rooftop - Foods & Cocktails",
      "Adresse": "Kissariat Ben Khalid R'mila, 1 Rue Fatima Zahra,",
      "Tél.": "+212 664-464450",
      "Réservation": "Oui",
      "Commentaires": "Rooftop restaurant et bar à Marrakech offrant une vue panoramique sur la Koutoubia. Propose une cuisine internationale, des cocktails créatifs et une ambiance cosmopolite avec programmation musicale variée."
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Bacha Coffee",
      "Adresse": "Dar el Bacha, Rte Sidi Abdelaziz",
      "Tél.": "+212 5243-81293",
      "Réservation": "Oui",
      "Commentaires": "Horaire : 10h à 18h00"
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Boutique Hôtel El Fenn (Rooftop)",
      "Adresse": "Derb Moulay Abdullah Ben Hezzian, 2, Marrakesh",
      "Tél.": "+212 5244-41210",
      "Réservation": "Oui pour le Rooftop",
      "Commentaires": "Ce riad-boutique se trouve dans un ancien palais traditionnel doté d'un toit-terrasse meublé comprenant une piscine ainsi que des vues sur la mosquée Koutoubia , située à 5 minutes à pied. Il propose une collection d'art, un piano bar et un spa."
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "La Cuisine Marocaine ",
      "Adresse": "Plusieurs (ex. Riad BE)",
      "Tél.": "via inst. @bemarrakech",
      "Réservation": "Oui",
      "Commentaires": "Cours de cuisine marocaine dans un riad traditionnel."
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Food tour privé Tasting Marrakech ",
      "Adresse": "Medina",
      "Tél.": "via @tasting_marrakech",
      "Réservation": "Oui",
      "Commentaires": "Découvrez la cuisine marocaine à travers un tour privé avec un guide local."
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Moroccan Culinary Arts Museum ",
      "Adresse": "Médina",
      "Tél.": "–",
      "Réservation": "Oui",
      "Commentaires": "Cours de cuisine marocaine avec déjeuner inclus."
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "L'épicurien",
      "Adresse": "Palais - Es Saadi Marrakech Resort",
      "Tél.": "+212 663-055704",
      "Réservation": "Oui",
      "Commentaires": "https://www.facebook.com/epicurien.marrakech/?locale=fr_FR"
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "KÔYA Restaurant Lounge",
      "Adresse": "Av. Echouhada, Marrakech",
      "Tél.": "+212 662-622452",
      "Réservation": "Oui",
      "Commentaires": "Le KOYA est un restaurant asiatique fusion qui offre des spécialités contemporaines : Japonaise, Péruvienne, Thai et Chinoise."
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Jardin du lotus",
      "Adresse": "Dar El Bacha, 9 Derb Sidi Ali Ben Hamdouch - Médina",
      "Tél.": "+212 5243-87318",
      "Réservation": "Oui",
      "Commentaires": "En plein coeur de la médina et niché au fond d'une ruelle, Les Jardins du Lotus vous accueille dans un cadre exceptionnelle avec un décor sophistiqué."
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "L'mida Marrakech : dans la Medina à côté de la place des épices",
      "Adresse": "dans la Medina à côté de la place des épices",
      "Tél.": "+212 5244-43662",
      "Réservation": "Oui",
      "Commentaires": "Une des plus belles terrasses de la médina !\nSitué à 5 minutes à pied de la place Jemaa El Fna, à deux pas de la place des épices, se cache le restaurant L'Mida.\nLa terrasse chic et branchée propose une carte marocaine fusion.L'mida est un lieu où se mêle traditions marrakchi et goût des choses simples.\nAussi agréable pour flâner au soleil en journée que pour admirer le coucher du soleil pour dîner !"
    }
  ],
  "Shopping & design": [
    {
      "Thématique": "Shopping & design",
      "Activité": "Medina Mall Marrakech",
      "Adresse": "Arsat Maach, 91 Avenue Hommane Fetouak",
      "Tél.": "+212 666-152120",
      "Réservation": "Non",
      "Commentaires": "Centre commercial moderne avec boutiques internationales et cafés. Horaire 09h00 à 01h00"
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Les sens de Marrakech",
      "Adresse": "N°17 Rue Principale",
      "Tél.": "+212 5243-36991",
      "Réservation": "Non",
      "Commentaires": "Boutique d'artisanat local de qualité. Horaire : 8h30 à 18h00"
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "SOME SLOW CONCEPT",
      "Adresse": "JXMP+GW9, Bd el Mansour Eddahbi, Marrakech 40000",
      "Tél.": "+2125244-33372",
      "Réservation": "Non",
      "Commentaires": "Fabriquées à la main, dans le plus grand respect des traditions, nos créations sont le fruit d'une étroite collaboration avec les artisans mâalems. SOME c'est l'expression des savoir-faire traditionnels marocains, au service de créations tendances et uniques à la fois. Horaire : 10h à 19h00"
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Carré Eden ",
      "Adresse": "Av. Mohammed V, Guéliz",
      "Tél.": "+212524437246",
      "Réservation": "Non",
      "Commentaires": "Centre commercial moderne avec boutiques de mode, restaurants et cinéma. Horaire : 10h à 22h00"
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Boutique Hôtel El Fenn",
      "Adresse": "Derb Moulay Abdullah Ben Hezzian, 2, Marrakesh",
      "Tél.": "+212 5244-41210",
      "Réservation": "Oui pour le Rooftop ",
      "Commentaires": "Ce riad-boutique se trouve dans un ancien palais traditionnel doté d'un toit-terrasse meublé comprenant une piscine ainsi que des vues sur la mosquée Koutoubia , située à 5 minutes à pied. Il propose une collection d'art, un piano bar et un spa."
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Pop Galerie",
      "Adresse": "109-4 avenue principale de sidi ghanem, ",
      "Tél.": "+212 5243-36008",
      "Réservation": "Non",
      "Commentaires": "Galerie d'art contemporain avec des œuvres de designers marocains et internationaux. Horaire : 10h à 19h00"
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Coucou Chamelle",
      "Adresse": "208 Rue Ibn Tofaïl, Marrakesh, Maroc",
      "Tél.": "+212 651-773407",
      "Réservation": "Non",
      "Commentaires": "Boutique de créateurs locaux avec des vêtements, accessoires et objets de décoration uniques. Horaire : 10h à 19h00"
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Natus",
      "Adresse": "No 490 Route Safi, Marrakesh 40000",
      "Tél.": "+2125243-35344",
      "Réservation": "Non",
      "Commentaires": "Boutique de décoration et d'artisanat marocain haut de gamme. Spécialisée dans les textiles, céramiques et objets d'artisanat. Horaire : 10h à 19h00"
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Virginie Darling",
      "Adresse": "437, Marrakesh 40000",
      "Tél.": "+212600-542204",
      "Réservation": "Non",
      "Commentaires": "Boutique de mode et accessoires avec une sélection de vêtements, sacs et bijoux de créateurs marocains. Horaire : 10h à 19h00"
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Fer attitude",
      "Adresse": "MX85+X63, Marrakech 40000",
      "Tél.": "+212661-765809",
      "Réservation": "Non",
      "Commentaires": "Boutique spécialisée dans les objets en fer forgé et en métal, allant des luminaires aux meubles. Horaire : 10h à 19h00"
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Chabichic ",
      "Adresse": "435, Marrakech 40000",
      "Tél.": "+2128085-23037",
      "Réservation": "Non",
      "Commentaires": "Boutique de mode et accessoires avec une sélection de vêtements, sacs et bijoux de créateurs marocains. Horaire : 10h à 19h00"
    }
  ],
  "Nuit & détente": [
    {
      "Thématique": "Nuit & détente",
      "Activité": "Baromètre Marrakech",
      "Adresse": "Rue Moulay Ali, Médina",
      "Tél.": "+212 5243-79012",
      "Réservation": "Oui conseillé",
      "Commentaires": "Cocktails after-dinner dans une ambiance raffinée"
    },
    {
      "Thématique": "Nuit & détente",
      "Activité": "Jungle Rooftop La Pergola",
      "Adresse": "7, 8 Riad Zitoun Lakdim, Médina",
      "Tél.": "+212 5244-29646",
      "Réservation": "Oui",
      "Commentaires": "Jazz Bar & Restaurant avec programmation le mercredi"
    },
    {
      "Thématique": "Nuit & détente",
      "Activité": "KABANA ROOFTOP",
      "Adresse": "Kissariat Ben Khalid R'mila, 1 Rue Fatima Zahra",
      "Tél.": "+212 664-464450",
      "Réservation": "Oui",
      "Commentaires": "DJ rooftop le week-end, vue panoramique sur la Koutoubia"
    },
    {
      "Thématique": "Nuit & détente",
      "Activité": "DJ rooftop @ Kabana (week-end) - KABANA ROOFTOP FOOD & COCKTAILS",
      "Adresse": "Kissariat Ben Khalid R'mila, 1 Rue Fatima Zahra, Médina",
      "Tél.": "+212 664-464450",
      "Réservation": "Oui",
      "Commentaires": "DJ rooftop le week-end, vue panoramique sur la Koutoubia"
    }
  ]
};

const translations = {
  fr: {
    title: "Guide de Marrakech",
    subtitle: "Pour rendre votre séjour inoubliable, nous avons rassemblé une sélection d'adresses testées et approuvées. Laissez-vous guider par nos recommandations.",
    startButton: "Commencer l'exploration",
    categoriesMenu: "Catégories",
    allActivities: "Toutes les activités",
    aiPlanner: "Planificateur IA",
    myFavorites: "Mes favoris",
    profile: "Mon Profil",
    offline: "Hors ligne",
    notifications: "Notifications",
    searchPlaceholder: "Rechercher une activité, lieu, type...",
    noResults: "Aucun résultat trouvé",
    showDetails: "Voir les détails",
    backToGuide: "Retour au guide",
    categories: {
      "Guide Touristique": "Guide Touristique",
      "Culture & Musées": "Culture & Musées", 
      "Visites & découvertes": "Visites & découvertes",
      "Bien-être & détente": "Bien-être & détente",
      "Se sustenter & Apéros & Tea Time": "Se sustenter & Apéros & Tea Time",
      "Shopping & design": "Shopping & design",
      "Nuit & détente": "Nuit & détente"
    },
    reservation: "Réservation :",
    tip: "Le petit plus",
    chooseCategoryTitle: "Choisissez une thématique pour commencer votre découverte",
    chooseCategorySubtitle: "Chaque catégorie regroupe nos recommandations testées et approuvées pour vous faire vivre la vraie magie de Marrakech",
    footerText: "Guide curated de Marrakech - Découvrez l'authenticité de la Ville Ocre",
    tapMenuHint: "Appuyez sur le menu pour explorer",
    useMenuHint: "Utilisez le menu pour explorer les catégories"
  },
  en: {
    title: "Marrakech Guide",
    subtitle: "To make your stay unforgettable, we have gathered a selection of tested and approved addresses. Let our recommendations guide you.",
    startButton: "Start exploring",
    categoriesMenu: "Categories",
    allActivities: "All Activities",
    aiPlanner: "AI Planner",
    myFavorites: "My Favorites",
    profile: "My Profile", 
    offline: "Offline",
    notifications: "Notifications",
    searchPlaceholder: "Search activity, place, type...",
    noResults: "No results found",
    showDetails: "Show details",
    backToGuide: "Back to guide",
    categories: {
      "Guide Touristique": "Tourist Guide",
      "Culture & Musées": "Culture & Museums",
      "Visites & découvertes": "Visits & Discoveries", 
      "Bien-être & détente": "Wellness & Relaxation",
      "Se sustenter & Apéros & Tea Time": "Food & Drinks & Tea Time",
      "Shopping & design": "Shopping & Design",
      "Nuit & détente": "Nightlife & Entertainment"
    },
    reservation: "Reservation:",
    tip: "Insider tip",
    chooseCategoryTitle: "Choose a theme to start your discovery",
    chooseCategorySubtitle: "Each category groups our tested and approved recommendations to make you experience the true magic of Marrakech",
    footerText: "Curated Marrakech Guide - Discover the authenticity of the Red City",
    tapMenuHint: "Tap menu to explore",
    useMenuHint: "Use the menu to explore categories"
  }
};

const categoryColors = {
  "Guide Touristique": "bg-accent/10 border-accent/20",
  "Culture & Musées": "bg-primary/10 border-primary/20",
  "Visites & découvertes": "bg-gradient-to-r from-primary/5 to-accent/5 border-primary/15",
  "Bien-être & détente": "bg-secondary/50 border-secondary/30",
  "Se sustenter & Apéros & Tea Time": "bg-gradient-to-r from-accent/10 to-primary/5 border-accent/20",
  "Shopping & design": "bg-primary-glow/10 border-primary-glow/20",
  "Nuit & détente": "bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20"
};

const categoryEmojis = {
  "Guide Touristique": "🕌",
  "Culture & Musées": "🎨",
  "Visites & découvertes": "🗺️",
  "Bien-être & détente": "🧘‍♀️",
  "Se sustenter & Apéros & Tea Time": "🍃",
  "Shopping & design": "🛍️",
  "Nuit & détente": "🌙"
};

export default function MarrakechGuide() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showAIPlanner, setShowAIPlanner] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showOffline, setShowOffline] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [categoryStartTime, setCategoryStartTime] = useState<number | null>(null);

  // Scroll detection for bottom of page (mobile only)
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const threshold = 100; // pixels from bottom
      
      // Only on mobile devices
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setIsAtBottom(scrollTop + windowHeight >= documentHeight - threshold);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = Object.keys(guideData);
  const t = translations[language];

  // Filter options for the filter bar
  const filterOptions = {
    priceRange: [
      { id: 'free', label: language === 'fr' ? 'Gratuit' : 'Free', count: 12 },
      { id: 'budget', label: language === 'fr' ? 'Économique' : 'Budget', count: 25 },
      { id: 'mid', label: language === 'fr' ? 'Moyen' : 'Mid-range', count: 18 },
      { id: 'luxury', label: language === 'fr' ? 'Luxe' : 'Luxury', count: 8 }
    ],
    features: [
      { id: 'rooftop', label: 'Rooftop', count: 6 },
      { id: 'traditional', label: language === 'fr' ? 'Traditionnel' : 'Traditional', count: 15 },
      { id: 'modern', label: language === 'fr' ? 'Moderne' : 'Modern', count: 10 },
      { id: 'garden', label: language === 'fr' ? 'Jardin' : 'Garden', count: 8 }
    ],
    openingHours: [
      { id: 'morning', label: language === 'fr' ? 'Matin' : 'Morning', count: 20 },
      { id: 'afternoon', label: language === 'fr' ? 'Après-midi' : 'Afternoon', count: 30 },
      { id: 'evening', label: language === 'fr' ? 'Soir' : 'Evening', count: 15 },
      { id: 'late', label: language === 'fr' ? 'Tard le soir' : 'Late night', count: 5 }
    ]
  };
  // Get all activities for the "All Activities" category
  const getAllActivities = () => {
    const allActivities: Activity[] = [];
    Object.values(guideData).forEach(categoryActivities => {
      allActivities.push(...categoryActivities);
    });
    return allActivities;
  };

  // Filter activities based on search and filters
  const filterActivities = (activities: Activity[]) => {
    let filtered = activities;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.Activité.toLowerCase().includes(query) ||
        activity.Adresse.toLowerCase().includes(query) ||
        activity.Commentaires.toLowerCase().includes(query) ||
        activity.Thématique.toLowerCase().includes(query)
      );
    }

    // Additional filters can be implemented here based on activeFilters
    // For now, we'll keep it simple

    return filtered;
  };
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

  const handleCategorySelect = (category: string) => {
    // Track time spent on previous category
    if (selectedCategory && categoryStartTime) {
      const timeSpent = Math.round((Date.now() - categoryStartTime) / 1000);
      trackInteraction.timeSpent(selectedCategory, timeSpent);
    }
    
    // Track new category selection
    if (category !== selectedCategory) {
      trackInteraction.categorySelect(category);
      setCategoryStartTime(Date.now());
      
      // Update SEO for category
      seoManager.updateCategoryPageSEO(category, language);
    }
    
    setSelectedCategory(selectedCategory === category ? null : category);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById('categories-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Track search with results count
    if (query.trim()) {
      const allActivities = getAllActivities();
      const results = filterActivities(allActivities);
      trackInteraction.search(query, results.length);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleClearAllFilters = () => {
    setActiveFilters([]);
  };

  const openActivityDetail = (activity: Activity) => {
    trackInteraction.activityView(activity.Activité, activity.Thématique);
    seoManager.updateActivityPageSEO(activity, language);
    setSelectedActivity(activity);
    setIsDetailModalOpen(true);
  };
  
  const handleLanguageChange = (newLanguage: 'fr' | 'en') => {
    setLanguage(newLanguage);
    
    // Update SEO for new language
    if (selectedCategory) {
      seoManager.updateCategoryPageSEO(selectedCategory, newLanguage);
    }
  };
  
  // Initialize SEO on mount
  useEffect(() => {
    seoManager.updatePageMetadata({
      structuredData: seoManager.generateGuideStructuredData()
    });
  }, []);
  const renderActivities = (activities: Activity[]) => {
    const filteredActivities = filterActivities(activities);
    
    if (filteredActivities.length === 0) {
      return (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground text-lg">{t.noResults}</p>
        </div>
      );
    }

    return filteredActivities.map((activity: Activity, index) => (
      activity.Activité && (
        <Card key={`${activity.Activité}-${index}`} className={`
          group hover:shadow-warm transition-all duration-300 hover:-translate-y-1 
          ${selectedCategory === "Toutes les activités" 
            ? "bg-gradient-to-r from-primary/5 to-accent/5 border-primary/15" 
            : categoryColors[selectedCategory as keyof typeof categoryColors]
          }
          animate-slide-up
        `} style={{ animationDelay: `${index * 100}ms` }}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors flex-1 pr-2">
                {activity.Activité}
              </CardTitle>
              <div className="flex items-center gap-1">
                <FavoritesManager activity={activity} language={language} compact />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openActivityDetail(activity)}
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.Adresse && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <button 
                  onClick={() => openAddress(activity.Adresse)}
                  className="text-left hover:text-primary transition-colors cursor-pointer underline decoration-primary/30 hover:decoration-primary"
                >
                  {activity.Adresse}
                </button>
              </div>
            )}
            
            {activity["Tél."] && activity["Tél."] !== "–" && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <button 
                  onClick={() => openPhone(activity["Tél."])}
                  className="hover:text-primary transition-colors cursor-pointer underline decoration-primary/30 hover:decoration-primary"
                >
                  {activity["Tél."]}
                </button>
              </div>
            )}

            {activity.Réservation && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                 <div>
                   <span className="font-medium text-primary text-bold">{t.reservation} </span>
                   <span className="text-muted-foreground">{activity.Réservation}</span>
                 </div>
              </div>
            )}

            {activity.Commentaires && (
              <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary/30">
                 <div className="flex items-start gap-2 mb-2">
                   <Lightbulb className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                   <span className="font-medium text-primary text-bold text-sm">{t.tip}</span>
                 </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activity.Commentaires}
                </p>
              </div>
            )}
            
            {/* Quick action button */}
            <div className="pt-2 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openActivityDetail(activity)}
                className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Eye className="h-4 w-4 mr-2" />
                {t.showDetails}
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-sunset">
      {/* Language Switcher */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleLanguageChange(language === 'fr' ? 'en' : 'fr')}
          className="bg-card/90 backdrop-blur-sm border-border/20 hover:bg-card"
        >
          <Languages className="h-4 w-4 mr-2" />
          {language.toUpperCase()}
        </Button>
      </div>

      {/* Mobile Burger Menu with Highlighting Circle */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <div className="relative">
          {/* Highlighting Circle - Only visible when at bottom */}
          <div className={`
            absolute inset-0 rounded-full border-4 border-primary animate-ping
            transition-opacity duration-500 pointer-events-none
            ${isAtBottom ? 'opacity-100' : 'opacity-0'}
          `} style={{ 
            width: '60px', 
            height: '60px', 
            top: '-10px', 
            left: '-10px',
            animationDuration: '2s'
          }} />
          
          {/* Secondary highlighting ring */}
          <div className={`
            absolute inset-0 rounded-full bg-primary/20 animate-pulse
            transition-opacity duration-500 pointer-events-none
            ${isAtBottom ? 'opacity-100' : 'opacity-0'}
          `} style={{ 
            width: '50px', 
            height: '50px', 
            top: '-5px', 
            left: '-5px',
            animationDuration: '1.5s'
          }} />

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`
                  bg-card/90 backdrop-blur-sm border-border/20 hover:bg-card
                  transition-all duration-300 relative z-10
                  ${isAtBottom ? 'shadow-lg shadow-primary/25 border-primary/40' : ''}
                `}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">{t.categoriesMenu}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-6">
                {/* All Activities Category */}
                <Button
                  variant={selectedCategory === "Toutes les activités" ? "default" : "outline"}
                  onClick={() => handleCategorySelect("Toutes les activités")}
                  className={`
                    justify-start transition-all duration-300 
                    ${selectedCategory === "Toutes les activités" 
                      ? "bg-gradient-primary text-primary-foreground shadow-warm" 
                      : "hover:bg-primary/10 hover:border-primary/30"
                    }
                  `}
                >
                  <span className="mr-2">🌟</span>
                  {t.allActivities}
                </Button>
                
                {/* AI Planner */}
                <Button
                  variant={showAIPlanner ? "default" : "outline"}
                  onClick={() => {
                    setShowAIPlanner(!showAIPlanner);
                    setSelectedCategory(null);
                    setShowProfile(false);
                    setShowOffline(false);
                    setShowNotifications(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    justify-start transition-all duration-300 
                    ${showAIPlanner 
                      ? "bg-gradient-primary text-primary-foreground shadow-warm" 
                      : "hover:bg-primary/10 hover:border-primary/30"
                    }
                  `}
                >
                  <span className="mr-2">🤖</span>
                  {t.aiPlanner}
                </Button>
                
                {/* Profile */}
                <Button
                  variant={showProfile ? "default" : "outline"}
                  onClick={() => {
                    setShowProfile(!showProfile);
                    setSelectedCategory(null);
                    setShowAIPlanner(false);
                    setShowOffline(false);
                    setShowNotifications(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    justify-start transition-all duration-300 
                    ${showProfile 
                      ? "bg-gradient-primary text-primary-foreground shadow-warm" 
                      : "hover:bg-primary/10 hover:border-primary/30"
                    }
                  `}
                >
                  <span className="mr-2">👤</span>
                  {t.profile}
                </Button>
                
                {/* Offline */}
                <Button
                  variant={showOffline ? "default" : "outline"}
                  onClick={() => {
                    setShowOffline(!showOffline);
                    setSelectedCategory(null);
                    setShowAIPlanner(false);
                    setShowProfile(false);
                    setShowNotifications(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    justify-start transition-all duration-300 
                    ${showOffline 
                      ? "bg-gradient-primary text-primary-foreground shadow-warm" 
                      : "hover:bg-primary/10 hover:border-primary/30"
                    }
                  `}
                >
                  <span className="mr-2">📱</span>
                  {t.offline}
                </Button>
                
                {/* Notifications */}
                <Button
                  variant={showNotifications ? "default" : "outline"}
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setSelectedCategory(null);
                    setShowAIPlanner(false);
                    setShowProfile(false);
                    setShowOffline(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    justify-start transition-all duration-300 
                    ${showNotifications 
                      ? "bg-gradient-primary text-primary-foreground shadow-warm" 
                      : "hover:bg-primary/10 hover:border-primary/30"
                    }
                  `}
                >
                  <span className="mr-2">🔔</span>
                  {t.notifications}
                </Button>
                
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => handleCategorySelect(category)}
                    className={`
                      justify-start transition-all duration-300 
                      ${selectedCategory === category 
                        ? "bg-primary text-primary-foreground shadow-warm" 
                        : "hover:bg-primary/10 hover:border-primary/30"
                      }
                    `}
                  >
                    <span className="mr-2">{categoryEmojis[category as keyof typeof categoryEmojis]}</span>
                    {t.categories[category as keyof typeof t.categories]}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Mobile hint text - only show when at bottom */}
        <div className={`
          absolute top-12 right-0 text-xs text-primary font-medium
          transition-all duration-500 pointer-events-none
          ${isAtBottom ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
        `}>
          <div className="bg-card/90 backdrop-blur-sm px-2 py-1 rounded-md border border-primary/20 shadow-sm">
            {t.tapMenuHint}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Marrakech au coucher du soleil"
            className="w-full h-full object-cover md:animate-none animate-[subtle-zoom_20s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-fade-in bg-gradient-warm bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 animate-slide-up opacity-90">
            {t.subtitle}
          </p>
          <Button 
            onClick={() => {
              setSelectedCategory("Toutes les activités");
              setShowAIPlanner(false);
              setTimeout(() => {
                document.getElementById('categories-section')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }, 100);
            }}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-warm animate-slide-up 
                       w-4/5 h-14 text-lg font-semibold
                       md:w-auto md:h-12 md:text-base md:font-medium"
          >
            {t.startButton}
          </Button>
        </div>
      </div>

      {/* Desktop Navigation - Hidden on mobile */}
      <div id="categories-section" className="bg-card/95 backdrop-blur-sm sticky top-0 z-40 border-b border-border/20 hidden md:block">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-center">
            {/* All Activities Category */}
            <Button
              variant={selectedCategory === "Toutes les activités" ? "default" : "outline"}
              onClick={() => setSelectedCategory(selectedCategory === "Toutes les activités" ? null : "Toutes les activités")}
              className={`
                setShowProfile(false);
                setShowOffline(false);
                setShowNotifications(false);
                transition-all duration-300 
                ${selectedCategory === "Toutes les activités" 
                  ? "bg-gradient-primary text-primary-foreground shadow-warm" 
                  : "hover:bg-primary/10 hover:border-primary/30"
                }
              `}
            >
              <span className="mr-2">🌟</span>
              {t.allActivities}
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`
                  transition-all duration-300 
                  ${selectedCategory === category 
                    ? "bg-primary text-primary-foreground shadow-warm" 
                    : "hover:bg-primary/10 hover:border-primary/30"
                  }
                `}
              >
                <span className="mr-2">{categoryEmojis[category as keyof typeof categoryEmojis]}</span>
                {t.categories[category as keyof typeof t.categories]}
              </Button>
            ))}
              {/* AI Planner */}
              <Button
                variant={showAIPlanner ? "default" : "outline"}
                onClick={() => {
                  setShowAIPlanner(!showAIPlanner);
                  setSelectedCategory(null);
                  setShowProfile(false);
                  setShowOffline(false);
                  setShowNotifications(false);
                }}
                className={`
                  transition-all duration-300 
                  ${showAIPlanner 
                    ? "bg-gradient-primary text-primary-foreground shadow-warm" 
                    : "hover:bg-primary/10 hover:border-primary/30"
                  }
                `}
              >
                <span className="mr-2">🤖</span>
                {t.aiPlanner}
              </Button>
              
              {/* Profile */}
              <Button
                variant={showProfile ? "default" : "outline"}
                onClick={() => {
                  setShowProfile(!showProfile);
                  setSelectedCategory(null);
                  setShowAIPlanner(false);
                  setShowOffline(false);
                  setShowNotifications(false);
                }}
                className={`
                  transition-all duration-300 
                  ${showProfile 
                    ? "bg-gradient-primary text-primary-foreground shadow-warm" 
                    : "hover:bg-primary/10 hover:border-primary/30"
                  }
                `}
              >
                <span className="mr-2">👤</span>
                {t.profile}
              </Button>
              
              {/* Offline */}
              <Button
                variant={showOffline ? "default" : "outline"}
                onClick={() => {
                  setShowOffline(!showOffline);
                  setSelectedCategory(null);
                  setShowAIPlanner(false);
                  setShowProfile(false);
                  setShowNotifications(false);
                }}
                className={`
                  transition-all duration-300 
                  ${showOffline 
                    ? "bg-gradient-primary text-primary-foreground shadow-warm" 
                    : "hover:bg-primary/10 hover:border-primary/30"
                  }
                `}
              >
                <span className="mr-2">📱</span>
                {t.offline}
              </Button>
              
              {/* Notifications */}
              <Button
                variant={showNotifications ? "default" : "outline"}
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setSelectedCategory(null);
                  setShowAIPlanner(false);
                  setShowProfile(false);
                  setShowOffline(false);
                }}
                className={`
                  transition-all duration-300 
                  ${showNotifications 
                    ? "bg-gradient-primary text-primary-foreground shadow-warm" 
                    : "hover:bg-primary/10 hover:border-primary/30"
                  }
                `}
              >
                <span className="mr-2">🔔</span>
                {t.notifications}
              </Button>
              
          </div>
        </div>
      </div>

      {/* Mobile Navigation Indicator - Only shown when category is selected */}
      {selectedCategory && (
        <div className="bg-card/95 backdrop-blur-sm sticky top-0 z-40 border-b border-border/20 md:hidden">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 text-primary font-medium">
                <span>
                  {selectedCategory === "Toutes les activités" 
                    ? "🌟" 
                    : categoryEmojis[selectedCategory as keyof typeof categoryEmojis]
                  }
                </span>
                <span>
                  {selectedCategory === "Toutes les activités" 
                    ? t.allActivities 
                    : t.categories[selectedCategory as keyof typeof t.categories]
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        {showProfile ? (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <Button
                variant="ghost"
                onClick={() => setShowProfile(false)}
                className="mb-4"
              >
                ← {t.backToGuide}
              </Button>
            </div>
            <UserProfileManager 
              language={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        ) : showOffline ? (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <Button
                variant="ghost"
                onClick={() => setShowOffline(false)}
                className="mb-4"
              >
                ← {t.backToGuide}
              </Button>
            </div>
            <OfflineManager 
              language={language}
              guideData={guideData}
            />
          </div>
        ) : showNotifications ? (
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
        {showAIPlanner ? (
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
        ) : selectedCategory ? (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                <span className="text-5xl">
                  {selectedCategory === "Toutes les activités" 
                    ? "🌟" 
                    : categoryEmojis[selectedCategory as keyof typeof categoryEmojis]
                  }
                </span>
                {selectedCategory === "Toutes les activités" 
                  ? t.allActivities 
                  : t.categories[selectedCategory as keyof typeof t.categories]
                }
              </h2>
              <div className="h-1 w-24 bg-gradient-primary mx-auto rounded-full"></div>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:flex-1">
                  <SearchBar
                    onSearch={handleSearch}
                    onClear={handleClearSearch}
                    placeholder={t.searchPlaceholder}
                  />
                </div>
                <FilterBar
                  filters={filterOptions}
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAllFilters}
                  language={language}
                />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {selectedCategory === "Toutes les activités" 
                ? renderActivities(getAllActivities())
                : renderActivities(guideData[selectedCategory as keyof typeof guideData])
              }
            </div>
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t.chooseCategoryTitle}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
              {t.chooseCategorySubtitle}
            </p>
            
            {/* Mobile hint for using menu */}
            <div className="md:hidden">
              <div className="inline-flex items-center gap-2 text-primary font-medium animate-bounce">
                <Menu className="h-4 w-4" />
                <span className="text-sm">{t.useMenuHint}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg opacity-90">
            {t.footerText}
          </p>
        </div>
      </footer>
      
      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        language={language}
      />

      <style jsx>{`
        @keyframes subtle-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}