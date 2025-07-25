import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MapPin, Phone, Globe, Lightbulb, Clock, Languages, Menu } from "lucide-react";
import heroImage from "@/assets/marrakech-hero.jpg";

interface Activity {
  "Thématique": string;
  "Activité": string;
  "Adresse": string;
  "Tél.": string;
  "Réservation": string;
  "Commentaires": string | { fr: string; en: string };
}

const guideData = {
  "Guide Touristique": [
    {
      "Thématique": "Visite de la Medina",
      "Activité": "Guide local Abdoul",
      "Adresse": "",
      "Tél.": "212670720118",
      "Réservation": "Appelez de la part de Yann",
      "Commentaires": {
        "fr": "Guide expert de la médina, recommandé pour découvrir les secrets de Marrakech",
        "en": "Expert medina guide, recommended to discover the secrets of Marrakech"
      }
    }
  ],
  "Culture & Musées": [
    {
      "Thématique": "Culture & Musées",
      "Activité": "Maison de la Photographie",
      "Adresse": "Medina - Rue Ahl Fes, 46 Rue Bin Lafnadek",
      "Tél.": "+212 5243-85721",
      "Réservation": "Non obligatoire, mais conseillé",
      "Commentaires": {
        "fr": "Photos historiques et magnifique rooftop avec vue. Horaire : 10h à 19h00",
        "en": "Historical photos and magnificent rooftop with view. Hours: 10am to 7pm"
      }
    },
    {
      "Thématique": "Culture & Musées",
      "Activité": "Musée Yves Saint Laurent + Musée Berbère + Jardin Majorelle",
      "Adresse": "Rue Yves Saint Laurent, Guéliz",
      "Tél.": "+212 5243-13047",
      "Réservation": "Oui, en ligne",
      "Commentaires": {
        "fr": "Trio incontournable de Marrakech. Horaire : 10h à 18h30",
        "en": "Essential trio of Marrakech. Hours: 10am to 6:30pm"
      }
    },
    {
      "Thématique": "Culture & Musées",
      "Activité": "Musée des confluences pour prendre une pâtisserie/thé au café Bâcha",
      "Adresse": "Dar El Bacha, Rue Fatima Zahra",
      "Tél.": "+212 5243-13047",
      "Réservation": "Oui pour le café",
      "Commentaires": {
        "fr": "Parfait pour une pause culturelle et gourmande. Horaire : 10h à 18h00",
        "en": "Perfect for a cultural and gourmet break. Hours: 10am to 6pm"
      }
    },
    {
      "Thématique": "Culture & Musées",
      "Activité": "Bahia Palace + jardins",
      "Adresse": "Palais Bahia. Bahia Palace, Rue Riad Zitoun el Jdid",
      "Tél.": "",
      "Réservation": "Non",
      "Commentaires": {
        "fr": "Palais somptueux avec jardins traditionnels. Horaire : 09h à 17h00",
        "en": "Sumptuous palace with traditional gardens. Hours: 9am to 5pm"
      }
    },
    {
      "Thématique": "Culture & Musées",
      "Activité": "Le monde des Arts de la Parure",
      "Adresse": "39, 40 Ksibat Nhass",
      "Tél.": "+212 8086-58561",
      "Réservation": "Non",
      "Commentaires": {
        "fr": "Musée dédié aux bijoux et parures traditionnels marocains. Horaire : 10h à 17h30.",
        "en": "Museum dedicated to traditional Moroccan jewelry and ornaments. Hours: 10am to 5:30pm."
      }
    },
    {
      "Thématique": "Culture & Musées",
      "Activité": "Moroccan Culinary Arts Museum (palais historic + rooftop)",
      "Adresse": "Rue Riad Zitoun el Jdid,,Médina",
      "Tél.": "+212 5244-27177",
      "Réservation": "Oui, pour repas/cours (instagram.com, nomadmarrakech.com, instagram.com)",
      "Commentaires": {
        "fr": "Découvrez l'art culinaire marocain dans un cadre historique. Horaire : 09h à 20h00.",
        "en": "Discover Moroccan culinary arts in a historical setting. Hours: 9am to 8pm."
      }
    }
  ],
  "Visites & découvertes": [
    {
      "Thématique": "Visites & découvertes",
      "Activité": "Balade dans les souks + place Jemaa el‑Fna + Place des épices",
      "Adresse": "Médina",
      "Tél.": "–",
      "Réservation": "Avec guide Abdoul",
      "Commentaires": {
        "fr": "L'expérience authentique de la médina avec un guide local expert",
        "en": "The authentic medina experience with an expert local guide"
      }
    },
    {
      "Thématique": "Visites & découvertes",
      "Activité": "Ourika Valley",
      "Adresse": "Ourika",
      "Tél.": "via agence",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "Marché, cascades, trek - Sortie d'une journée en montagne",
        "en": "Market, waterfalls, trek - Full day mountain excursion"
      }
    },
    {
      "Thématique": "Visites & découvertes",
      "Activité": "Le Flouka restaurant - Lac Lalla Takerkoust",
      "Adresse": "Barrage Lalla Takerkoust",
      "Tél.": "+212 664-492660",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "Sortie d'une journée au bord du lac avec restaurant de qualité. https://www.leflouka-marrakech.com/hotel/",
        "en": "Full day lakeside outing with quality restaurant. https://www.leflouka-marrakech.com/hotel/"
      }
    },
    {
      "Thématique": "Visites & découvertes",
      "Activité": "Journée Désert Agafay",
      "Adresse": "Agafay",
      "Tél.": "via agence ou hôtel",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "Quad, bivouac, animations - Expérience désert authentique",
        "en": "Quad, bivouac, activities - Authentic desert experience"
      }
    },
    {
      "Thématique": "Visites & découvertes",
      "Activité": "Cascades d'Ouzoud",
      "Adresse": "150 KM au Nord-Est de Marrakech",
      "Tél.": "via agence ou hôtel",
      "Réservation": "Oui, à l’avance",
      "Commentaires": {
        "fr": "Sortie d'une journée pour découvrir les magnifiques cascades d'Ouzoud",
        "en": "Full day trip to discover the magnificent Ouzoud waterfalls"
      }
    }
  ],
  "Bien-être & détente": [
    {
      "Thématique": "Bien-être & détente",
      "Activité": "Héritage Spa",
      "Adresse": "40, Arset Aouzal Bad Doukkala",
      "Tél.": "212 (0) 5 24 39 04 07",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "Spa d'exception dans un riad authentique. Atmosphère intimiste et paisible, décoration soignée et précieuse.",
        "en": "Exceptional spa in an authentic riad. Intimate and peaceful atmosphere, refined and precious decoration."
      }
    },
    {
      "Thématique": "Bien-être & détente",
      "Activité": "Riad Laz Mimoun & Spa",
      "Adresse": "113 Derb Sidi Mbarek, Médina",
      "Tél.": "212624648730",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "Spa traditionnel avec tadelakt et massothérapie personnalisée",
        "en": "Traditional spa with tadelakt and personalized massage therapy"
      }
    },
    {
      "Thématique": "Bien-être & détente",
      "Activité": "Beldi Country Club",
      "Adresse": "Route Ourika - KM6 route du Barrage BP 210, Marrakech 40000",
      "Tél.": "05243-83950",
      "Réservation": "Conseillée",
      "Commentaires": {
        "fr": "Piscine et hammam dans un cadre verdoyant hors de la ville",
        "en": "Pool and hammam in a green setting outside the city"
      }
    }
  ],
  "Se sustenter & Apéros & Tea Time": [
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Nomad – rooftop moderne (tagines fusion)",
      "Adresse": "1 Derb Aarjane, Médina",
      "Tél.": "+212 524 381 609 / 661 451 519",
      "Réservation": "Oui (groupe ≥ 5)",
      "Commentaires": {
        "fr": "Avec sa superbe vue sur une oasis de palmiers et son incroyable coucher de soleil en font l’un des spots les plus prisés de la ville de Marrakech.\n\nAvec un cadre moderne et épuré, le Nomad Bar Marrakech offre une atmosphère chic et conviviale, l’endroit idoine pour savourer les excellents cocktails signature ou déguster les succulents tapas du chef, le tout, dans une ambiance festive rythmée par les sets du Dj résident.",
        "en": "With its superb view of a palm oasis and its incredible sunset, it is one of the most popular spots in Marrakech.\n\nWith a modern and refined setting, the Nomad Bar Marrakech offers a chic and friendly atmosphere, the ideal place to enjoy excellent signature cocktails or taste the chef's succulent tapas, all in a festive atmosphere set to the rhythm of the resident DJ's sets."
      }
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Le Grand Bazar",
      "Adresse": "Place Jemaa El Fna",
      "Tél.": "Passer par Yann pour la Réservation",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "En plein coeur de la place Jamaa El Fna, Le Grand Bazar est un restaurant innovant dans un cadre à la fois unique et mémorable. Vous serez transporté vers une véritable expérience culinaire aux saveurs marocaines et internationales.\n\nDans un décor digne d’un conte des mille et une nuits, ce lieu atypique mélange un restaurant et un cabinet de curiosités pour créer un monde enchanté grâce à des animations captivantes tous les soirs (musiciens, chanteurs, magiciens..). Des soirées inoubliables vous y attendent !",
        "en": "In the heart of Jemaa El Fna square, Le Grand Bazar is an innovative restaurant in a setting that is both unique and memorable. You will be transported to a true culinary experience with Moroccan and international flavors.\n\nIn a decor worthy of a tale from the Arabian Nights, this atypical place mixes a restaurant and a cabinet of curiosities to create an enchanted world thanks to captivating entertainment every evening (musicians, singers, magicians...). Unforgettable evenings await you there!"
      }
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "La maison Arabe",
      "Adresse": "1 Derb Assehbi",
      "Tél.": "+212 6 53 06 80 80",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "Idéalement situé au cœur de la ville ocre, ce prestigieux palais vous accueillera dans des tables chics, soigneusement organisées autour d’une très belle piscine, sous les arcs de pierres ou dans le petit jardin arboré.\n\nVous pouvez également réserver une table dans la somptueuse salle de restaurant élégamment décorée dans un style purement oriental avec des tapis berbères, des plafonds peints à la main et des lanternes typiquement marocaines.",
        "en": "Ideally located in the heart of the ochre city, this prestigious palace will welcome you at chic tables, carefully arranged around a beautiful swimming pool, under stone arches or in the small wooded garden.\n\nYou can also book a table in the sumptuous restaurant room elegantly decorated in a purely oriental style with Berber carpets, hand-painted ceilings, and typical Moroccan lanterns."
      }
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Mazel Café",
      "Adresse": "8 Place des Ferblantiers",
      "Tél.": "+212 661-662824",
      "Réservation": "Non",
      "Commentaires": {
        "fr": "Niché au cœur vibrant de la médina de Marrakech, Mazel Café est un véritable joyau culinaire, idéalement situé entre le Palais Badi et le Palais Bahia.",
        "en": "Nestled in the vibrant heart of the Marrakech medina, Mazel Café is a true culinary gem, ideally located between the Badi Palace and the Bahia Palace."
      }
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Les Terrasses des Epices",
      "Adresse": "15, souk cherifia, sidi abdelaziz, Marrakech Médina",
      "Tél.": "+212524375904",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "https://www.terrassedesepices.com/\nOuvert tous les jours de 12h00 à 17h00 et de 18h30 à 00h30, c’est au rythme des meilleurs Dj et musiciens de la ville que l’expérience Terrasse des épices prend toute sa dimension.",
        "en": "https://www.terrassedesepices.com/\nOpen daily from 12:00 PM to 5:00 PM and from 6:30 PM to 12:30 AM, the Terrasse des Épices experience comes alive to the rhythm of the city's best DJs and musicians."
      }
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "La Mamounia",
      "Adresse": "Avenue Bab Jdid,",
      "Tél.": "+212524388600",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "Prendre un tea Time, glâce ou même diner. Formule Brunch, extraordinaire. Je recommande Il y a 4 restaurant. ",
        "en": "Have tea time, ice cream, or even dinner. Extraordinary brunch option. I recommend it. There are 4 restaurants."
      }
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Le Kabana Rooftop - Foods & Cocktails",
      "Adresse": "Kissariat Ben Khalid R'mila, 1 Rue Fatima Zahra,",
      "Tél.": "+212 664-464450",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "Rooftop restaurant et bar à Marrakech offrant une vue panoramique sur la Koutoubia. Propose une cuisine internationale, des cocktails créatifs et une ambiance cosmopolite avec programmation musicale variée.",
        "en": "Rooftop restaurant and bar in Marrakech offering a panoramic view of the Koutoubia. Features international cuisine, creative cocktails, and a cosmopolitan atmosphere with varied musical programming."
      }
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Bacha Coffee",
      "Adresse": "Dar el Bacha, Rte Sidi Abdelaziz",
      "Tél.": "+212 5243-81293",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "Horaire : 10h à 18h00",
        "en": "Hours: 10am to 6pm"
      }
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Boutique Hôtel El Fenn (Rooftop)",
      "Adresse": "Derb Moulay Abdullah Ben Hezzian, 2, Marrakesh",
      "Tél.": "+212 5244-41210",
      "Réservation": "Oui pour le Rooftop",
      "Commentaires": {
        "fr": "Ce riad-boutique se trouve dans un ancien palais traditionnel doté d'un toit-terrasse meublé comprenant une piscine ainsi que des vues sur la mosquée Koutoubia , située à 5 minutes à pied. Il propose une collection d'art, un piano bar et un spa.",
        "en": "This boutique riad is in a former traditional palace featuring a furnished rooftop terrace with a pool and views of the Koutoubia Mosque, a 5-minute walk away. It offers an art collection, a piano bar, and a spa."
      }
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "La Cuisine Marocaine ",
      "Adresse": "Plusieurs (ex. Riad BE)",
      "Tél.": "via inst. @bemarrakech",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "Cours de cuisine marocaine dans un riad traditionnel.",
        "en": "Moroccan cooking class in a traditional riad."
      }
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Food tour privé Tasting Marrakech ",
      "Adresse": "Medina",
      "Tél.": "via @tasting_marrakech",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "Découvrez la cuisine marocaine à travers un tour privé avec un guide local.",
        "en": "Discover Moroccan cuisine through a private tour with a local guide."
      }
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Moroccan Culinary Arts Museum ",
      "Adresse": "Médina",
      "Tél.": "–",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "Cours de cuisine marocaine avec déjeuner inclus.",
        "en": "Moroccan cooking class with lunch included."
      }
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "L’épicurien",
      "Adresse": "Palais - Es Saadi Marrakech Resort",
      "Tél.": "+212 663-055704",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "facebook.com/epicurien.marrakech/",
        "en": "facebook.com/epicurien.marrakech/"
      }
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "KÔYA Restaurant Lounge",
      "Adresse": "Av. Echouhada, Marrakech",
      "Tél.": "+212 662-622452",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "Le KOYA est un restaurant asiatique fusion qui offre des spécialités contemporaines : Japonaise, Péruvienne, Thai et Chinoise.",
        "en": "KOYA is an Asian fusion restaurant offering contemporary specialties: Japanese, Peruvian, Thai, and Chinese."
      }
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Jardin du lotus",
      "Adresse": "Dar El Bacha, 9 Derb Sidi Ali Ben Hamdouch - Médina",
      "Tél.": "+212 5243-87318",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "En plein coeur de la médina et niché au fond d'une ruelle, Les Jardins du Lotus vous accueille dans un cadre exceptionnelle avec un décor sophistiqué.",
        "en": "In the heart of the medina and nestled at the end of an alley, Les Jardins du Lotus welcomes you to an exceptional setting with sophisticated decor."
      }
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "L'mida Marrakech : dans la Medina à côté de la place des épices",
      "Adresse": "dans la Medina à côté de la place des épices",
      "Tél.": "+212 5244-43662",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "Une des plus belles terrasses de la médina !\nSitué à 5 minutes à pied de la place Jemaa El Fna, à deux pas de la place des épices, se cache le restaurant L’Mida.\nLa terrasse chic et branchée propose une carte marocaine fusion.L’mida est un lieu où se mêle traditions marrakchi et goût des choses simples.\nAussi agréable pour flâner au soleil en journée que pour admirer le coucher du soleil pour dîner !",
        "en": "One of the most beautiful terraces in the medina!\nLocated a 5-minute walk from Jemaa El Fna square, just a stone's throw from the Place des Épices (Spice Square), you'll find the L'Mida restaurant.\nThe chic and trendy terrace offers a Moroccan fusion menu. L'mida is a place where Marrakchi traditions blend with a taste for simple things.\nEqually pleasant for lounging in the sun during the day as for admiring the sunset over dinner!"
      }
    }
  ],
  "Shopping & design": [
    {
      "Thématique": "Shopping & design",
      "Activité": "Medina Mall Marrakech",
      "Adresse": "Arsat Maach, 91 Avenue Hommane Fetouak",
      "Tél.": "+212 666-152120",
      "Réservation": "Non",
      "Commentaires": {
        "fr": "Centre commercial moderne avec boutiques internationales et cafés. Horaire 09h00 à 01h00",
        "en": "Modern shopping center with international shops and cafes. Hours 9:00am to 1:00am"
      }
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Les sens de Marrakech",
      "Adresse": "N°17 Rue Principale",
      "Tél.": "+212 5243-36991",
      "Réservation": "Non",
      "Commentaires": {
        "fr": "Boutique d'artisanat local de qualité. Horaire : 8h30 à 18h00",
        "en": "Quality local artisan shop. Hours: 8:30am to 6:00pm"
      }
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "SOME SLOW CONCEPT",
      "Adresse": "JXMP+GW9, Bd el Mansour Eddahbi, Marrakech 40000",
      "Tél.": "+2125244-33372",
      "Réservation": "Non",
      "Commentaires": {
        "fr": "Fabriquées à la main, dans le plus grand respect des traditions, nos créations sont le fruit d'une étroite collaboration avec les artisans mâalems. SOME c’est l’expression des savoir-faire traditionnels marocains, au service de créations tendances et uniques à la fois. Horaire : 10h à 19h00",
        "en": "Handmade, with the utmost respect for tradition, our creations are the result of close collaboration with master craftsmen (mâalems). SOME is the expression of traditional Moroccan know-how, serving creations that are both trendy and unique. Hours: 10am to 7pm"
      }
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Carré Eden ",
      "Adresse": "Av. Mohammed V, Guéliz",
      "Tél.": "+212524437246",
      "Réservation": "Non",
      "Commentaires": {
        "fr": "Centre commercial moderne avec boutiques de mode, restaurants et cinéma. Horaire : 10h à 22h00",
        "en": "Modern shopping center with fashion boutiques, restaurants, and a cinema. Hours: 10am to 10pm"
      }
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Boutique Hôtel El Fenn",
      "Adresse": "Derb Moulay Abdullah Ben Hezzian, 2, Marrakesh",
      "Tél.": "+212 5244-41210",
      "Réservation": "Oui pour le Rooftop ",
      "Commentaires": {
        "fr": "Ce riad-boutique se trouve dans un ancien palais traditionnel doté d'un toit-terrasse meublé comprenant une piscine ainsi que des vues sur la mosquée Koutoubia , située à 5 minutes à pied. Il propose une collection d'art, un piano bar et un spa.",
        "en": "This boutique riad is in a former traditional palace featuring a furnished rooftop terrace with a pool and views of the Koutoubia Mosque, a 5-minute walk away. It offers an art collection, a piano bar, and a spa."
      }
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Pop Galerie",
      "Adresse": "109-4 avenue principale de sidi ghanem, ",
      "Tél.": "+212 5243-36008",
      "Réservation": "Non",
      "Commentaires": {
        "fr": "Galerie d'art contemporain avec des œuvres de designers marocains et internationaux. Horaire : 10h à 19h00",
        "en": "Contemporary art gallery with works by Moroccan and international designers. Hours: 10am to 7pm"
      }
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Coucou Chamelle",
      "Adresse": "208 Rue Ibn Tofaïl, Marrakesh, Maroc",
      "Tél.": "+212 651-773407",
      "Réservation": "Non",
      "Commentaires": {
        "fr": "Boutique de créateurs locaux avec des vêtements, accessoires et objets de décoration uniques. Horaire : 10h à 19h00",
        "en": "Local designer boutique with unique clothing, accessories, and decorative items. Hours: 10am to 7pm"
      }
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Natus",
      "Adresse": "No 490 Route Safi, Marrakesh 40000",
      "Tél.": "+2125243-35344",
      "Réservation": "Non",
      "Commentaires": {
        "fr": "Boutique de décoration et d'artisanat marocain haut de gamme. Spécialisée dans les textiles, céramiques et objets d'artisanat. Ouvert Samedi matin.",
        "en": "High-end Moroccan decor and craft boutique. Specializing in textiles, ceramics, and artisanal objects. Open Saturday morning."
      }
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Virginie Darling",
      "Adresse": "437, Marrakesh 40000",
      "Tél.": "+212600-542204",
      "Réservation": "Non",
      "Commentaires": {
        "fr": "Boutique de mode et accessoires avec une sélection de vêtements, sacs et bijoux de créateurs marocains. Horaire : 10h à 19h00",
        "en": "Fashion and accessories boutique with a selection of clothing, bags, and jewelry from Moroccan designers. Hours: 10am to 7pm"
      }
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Fer attitude",
      "Adresse": "MX85+X63, Marrakech 40000",
      "Tél.": "+212661-765809",
      "Réservation": "Non",
      "Commentaires": {
        "fr": "Boutique spécialisée dans les objets en fer forgé et en métal, allant des luminaires aux meubles. Horaire : 10h à 19h00",
        "en": "Boutique specializing in wrought iron and metal objects, from lighting to furniture. Hours: 10am to 7pm"
      }
    },
    {
      "Thématique": "Shopping & design",
      "Activité": "Chabichic ",
      "Adresse": "435, Marrakech 40000",
      "Tél.": "+2128085-23037",
      "Réservation": "Non",
      "Commentaires": {
        "fr": "Boutique de mode et accessoires avec une sélection de vêtements, sacs et bijoux de créateurs marocains. Horaire : 10h à 19h00",
        "en": "Fashion and accessories boutique with a selection of clothing, bags, and jewelry from Moroccan designers. Hours: 10am to 7pm"
      }
    }
  ],
  "Nuit & détente": [
    {
      "Thématique": "Nuit & détente",
      "Activité": "Baromètre Marrakech",
      "Adresse": "Rue Moulay Ali, Médina",
      "Tél.": "+212 5243-79012",
      "Réservation": "Oui conseillé",
      "Commentaires": {
        "fr": "Cocktails after-dinner dans une ambiance raffinée",
        "en": "After-dinner cocktails in a sophisticated atmosphere"
      }
    },
    {
      "Thématique": "Nuit & détente",
      "Activité": "Jungle Rooftop La Pergola",
      "Adresse": "7, 8 Riad Zitoun Lakdim, Médina",
      "Tél.": "+212 5244-29646",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "Jazz Bar & Restaurant avec programmation le mercredi",
        "en": "Jazz Bar & Restaurant with a program on Wednesdays"
      }
    },
    {
      "Thématique": "Nuit & détente",
      "Activité": "KABANA ROOFTOP",
      "Adresse": "Kissariat Ben Khalid R'mila, 1 Rue Fatima Zahra",
      "Tél.": "+212 664-464450",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "DJ rooftop le week-end, vue panoramique sur la Koutoubia",
        "en": "Rooftop DJ on weekends, panoramic view of the Koutoubia"
      }
    },
    {
      "Thématique": "Nuit & détente",
      "Activité": "DJ rooftop @ Kabana (week-end) - KABANA ROOFTOP FOOD & COCKTAILS",
      "Adresse": "Kissariat Ben Khalid R'mila, 1 Rue Fatima Zahra, Médina",
      "Tél.": "+212 664-464450",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "DJ rooftop le week-end, vue panoramique sur la Koutoubia",
        "en": "Rooftop DJ on weekends, panoramic view of the Koutoubia"
      }
    },
    {
      "Thématique": "Nuit & détente",
      "Activité": "Toro Marrakech by Chef Richard Sandoval",
      "Adresse": "Av. Menara",
      "Tél.": "+212 662-680394",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "pan‑Latin steakhouse, Gueliz",
        "en": "pan‑Latin steakhouse, Gueliz"
      }
    },
    {
      "Thématique": "Nuit & détente",
      "Activité": "L'épicurien",
      "Adresse": "Palais - Es Saadi Marrakech Resort",
      "Tél.": "+212 663-055704",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "facebook.com/epicurien.marrakech",
        "en": "facebook.com/epicurien.marrakech"
      }
    },
    {
      "Thématique": "Nuit & détente",
      "Activité": "Taj mahal",
      "Adresse": "Rue Haroun Errachid, Marrakech 40000",
      "Tél.": "+212 5244-36984",
      "Réservation": "Oui",
      "Commentaires": {
        "fr": "",
        "en": ""
      }
    }
  ]
};

const translations = {
  fr: {
    title: "Guide de Marrakech",
    subtitle: "Pour rendre votre séjour inoubliable, nous avons rassemblé une sélection d'adresses testées et approuvées. Laissez-vous guider par nos recommandations.",
    startButton: "Commencer l'exploration",
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
    footerText: "Guide curated de Marrakech - Découvrez l'authenticité de la Ville Ocre"
  },
  en: {
    title: "Marrakech Guide",
    subtitle: "To make your stay unforgettable, we have gathered a selection of tested and approved addresses. Let our recommendations guide you.",
    startButton: "Start exploring",
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
    footerText: "Curated Marrakech Guide - Discover the authenticity of the Red City"
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
  const [isScrolled, setIsScrolled] = useState(false);

  const categories = Object.keys(guideData);
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAddress = (address: string) => {
    if (address) {
      window.open(`https: //maps.google.com/?q=${encodeURIComponent(address + ", Marrakech")}`, '_blank');
    }
  };

  const openPhone = (phone: string) => {
    if (phone) {
      window.open(`tel:${phone
      }`, '_self');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sunset">
      {/* Language Switcher - Desktop */}
      <div className="fixed top-4 left-4 z-50 hidden md:block">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          className="bg-card/90 backdrop-blur-sm border-border/20 hover:bg-card"
        >
          <Languages className="h-4 w-4 mr-2" />
          {language.toUpperCase()}
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage
  } 
            alt="Marrakech au coucher du soleil"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in bg-gradient-warm bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-slide-up opacity-90">
            {t.subtitle}
          </p>
          <Button 
            onClick={() => {
              setSelectedCategory(categories[0]);
              setTimeout(() => {
                document.getElementById('categories-section')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }, 100);
            }}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-warm animate-slide-up"
          >
            {t.startButton}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div id="categories-section" className="bg-card/95 backdrop-blur-sm sticky top-0 z-40 border-b border-border/20 transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          {/* Desktop - Always show full category list */}
          <div className="hidden md:flex flex-row flex-wrap gap-2 justify-center">
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
          </div>

          {/* Mobile - Category list when not scrolled, burger menu when scrolled */}
          <div className="md:hidden">
            {!isScrolled ? (
              // Full category list when not scrolled on mobile
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-center">
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
              </div>
            ) : (
              // Burger menu with selected category when scrolled on mobile
              <div className="flex items-center justify-between">
                {selectedCategory && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{categoryEmojis[selectedCategory as keyof typeof categoryEmojis]}</span>
                    <span className="font-medium text-foreground">
                      {t.categories[selectedCategory as keyof typeof t.categories]}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  {/* Language Switcher - Mobile when scrolled */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                    className="bg-card/90 backdrop-blur-sm border-border/20 hover:bg-card"
                  >
                    <Languages className="h-4 w-4 mr-1" />
                    {language.toUpperCase()}
                  </Button>
                  
                  {/* Burger Menu */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Menu className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                      <div className="py-6">
                        <h3 className="text-lg font-semibold mb-4">Categories</h3>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <Button
                              key={category}
                              variant={selectedCategory === category ? "default" : "ghost"}
                              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                              className={`
                                w-full justify-start transition-all duration-300
                                ${selectedCategory === category 
                                  ? "bg-primary text-primary-foreground" 
                                  : "hover:bg-primary/10"
                                }
                              `}
                            >
                              <span className="mr-2">{categoryEmojis[category as keyof typeof categoryEmojis]}</span>
                              {t.categories[category as keyof typeof t.categories]}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      { /* Content */}
      <div className="container mx-auto px-6 py-12">
        {selectedCategory ? (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                <span className="text-5xl">{categoryEmojis[selectedCategory as keyof typeof categoryEmojis]}</span>
                {t.categories[selectedCategory as keyof typeof t.categories]}
              </h2>
              <div className="h-1 w-24 bg-gradient-primary mx-auto rounded-full"></div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {guideData[selectedCategory as keyof typeof guideData
      ].map((activity: Activity, index) => (
                activity.Activité && (
                  <Card key={index
      } className={`
                    break-words 
                    group mx-1 sm:mx-0 hover:shadow-warm transition-all duration-300 hover:-translate-y-1 
                    ${categoryColors[selectedCategory as keyof typeof categoryColors
          ]
        }
                    animate-slide-up
                  `
      } style={
        { animationDelay: `${index * 100
          }ms`
        }
      }>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                        {activity.Activité
      }
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {activity.Adresse && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <button 
                            onClick={() => openAddress(activity.Adresse)
        }
                            className="text-left hover:text-primary transition-colors cursor-pointer underline decoration-primary/30 hover:decoration-primary"
                          >
                            {activity.Adresse
        }
                          </button>
                        </div>
                      )
      }
                      
                      {activity[
          "Tél."
        ] && activity[
          "Tél."
        ] !== "–" && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                          <button 
                            onClick={() => openPhone(activity[
            "Tél."
          ])
        }
                            className="hover:text-primary transition-colors cursor-pointer underline decoration-primary/30 hover:decoration-primary"
                          >
                            {activity[
            "Tél."
          ]
        }
                          </button>
                        </div>
                      )
      }

                      {activity.Réservation && (
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                           <div>
                             <span className="font-medium text-primary text-bold">{t.reservation} </span>
                             <span className="text-muted-foreground">{activity.Réservation}</span>
                           </div>
                        </div>
                      )
      }

                      {activity.Commentaires && (
                        <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary/30">
                           <div className="flex items-start gap-2 mb-2">
                             <Lightbulb className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                             <span className="font-medium text-primary text-bold text-sm">{t.tip}</span>
                           </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                             {typeof activity.Commentaires === 'string' 
                               ? activity.Commentaires 
                               : activity.Commentaires[language]}
                          </p>
                        </div>
                      )
      }
                    </CardContent>
                  </Card>
                )
              ))
    }
            </div>
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t.chooseCategoryTitle}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.chooseCategorySubtitle}
            </p>
          </div>
        )
  }
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg opacity-90">
            {t.footerText}
          </p>
        </div>
      </footer>
    </div>
  );
}
