import { useState
} from "react";
import { Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button
} from "@/components/ui/button";
import { MapPin, Phone, Globe, Lightbulb, Clock
} from "lucide-react";
import heroImage from "@/assets/marrakech-hero.jpg";

interface Activity {
  "Thématique": string;
  "Activité": string;
  "Adresse": string;
  "Tél.": string;
  "Réservation": string;
  "Commentaires": string;
}

const guideData = {
  "Guide Abdoul": [
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
      "Tél.": "",
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
      "Commentaires": "Sortie d'une journée au bord du lac avec restaurant de qualité"
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
      "Réservation": "Oui, à l’avance",
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
      "Adresse": "Route Ourika",
      "Tél.": "–",
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
      "Commentaires": "Avec sa superbe vue sur une oasis de palmiers et son incroyable coucher de soleil en font l’un des spots les plus prisés de la ville de Marrakech.\n\nAvec un cadre moderne et épuré, le Nomad Bar Marrakech offre une atmosphère chic et conviviale, l’endroit idoine pour savourer les excellents cocktails signature ou déguster les succulents tapas du chef, le tout, dans une ambiance festive rythmée par les sets du Dj résident."
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Le Grand Bazar",
      "Adresse": "Place Jemaa El Fna",
      "Tél.": "Passer par Yann pour la Résa",
      "Réservation": "",
      "Commentaires": "En plein coeur de la place Jamaa El Fna, Le Grand Bazar est un restaurant innovant dans un cadre à la fois unique et mémorable. Vous serez transporté vers une véritable expérience culinaire aux saveurs marocaines et internationales.\n\nDans un décor digne d’un conte des mille et une nuits, ce lieu atypique mélange un restaurant et un cabinet de curiosités pour créer un monde enchanté grâce à des animations captivantes tous les soirs (musiciens, chanteurs, magiciens..). Des soirées inoubliables vous y attendent !"
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "La maison Arabe",
      "Adresse": "1 Derb Assehbi",
      "Tél.": "+212 6 53 06 80 80",
      "Réservation": "Oui",
      "Commentaires": "Idéalement situé au cœur de la ville ocre, ce prestigieux palais vous accueillera dans des tables chics, soigneusement organisées autour d’une très belle piscine, sous les arcs de pierres ou dans le petit jardin arboré.\n\nVous pouvez également réserver une table dans la somptueuse salle de restaurant élégamment décorée dans un style purement oriental avec des tapis berbères, des plafonds peints à la main et des lanternes typiquement marocaines."
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Mazel Café",
      "Adresse": "8 Place des Ferblantiers",
      "Tél.": "+212 661-662824",
      "Réservation": "",
      "Commentaires": "Niché au cœur vibrant de la médina de Marrakech, Mazel Café est un véritable joyau culinaire, idéalement situé entre le Palais Badi et le Palais Bahia,"
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Les Terrasses des Epices",
      "Adresse": "15, souk cherifia, sidi abdelaziz, Marrakech Médina",
      "Tél.": "+212 5 24 37 59 04",
      "Réservation": "oui",
      "Commentaires": "https://www.terrassedesepices.com/\nOuvert tous les jours de 12h00 à 17h00 et de 18h30 à 00h30, c’est au rythme des meilleurs Dj et musiciens de la ville que l’expérience Terrasse des épices prend toute sa dimension."
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "La Mamounia",
      "Adresse": "Avenue Bab Jdid,",
      "Tél.": "(212) 524 388 600\n\nrestaurants@mamounia.com",
      "Réservation": "oui",
      "Commentaires": "Prendre un tea Time, glâce ou même diner. Formule Brunch, extraordinaire. Je recommande Il y a 4 restaurant."
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Le Kabana Rooftop - Foods & Cocktails",
      "Adresse": "Kissariat Ben Khalid R'mila, 1 Rue Fatima Zahra,",
      "Tél.": "+212 664-464450",
      "Réservation": "oui",
      "Commentaires": "Rooftop restaurant et bar à Marrakech offrant une vue panoramique sur la Koutoubia. Propose une cuisine internationale, des cocktails créatifs et une ambiance cosmopolite avec programmation musicale variée."
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Bacha Coffee",
      "Adresse": "Dar el Bacha, Rte Sidi Abdelaziz",
      "Tél.": "+212 5243-81293",
      "Réservation": "",
      "Commentaires": "Horaire : 10h à 18h00"
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Boutique Hôtel El Fenn (Rooftop)",
      "Adresse": "Derb Moulay Abdullah Ben Hezzian, 2, Marrakesh",
      "Tél.": "+212 5244-41210",
      "Réservation": "oui pour le Rooftop",
      "Commentaires": "Ce riad-boutique se trouve dans un ancien palais traditionnel doté d'un toit-terrasse meublé comprenant une piscine ainsi que des vues sur la mosquée Koutoubia , située à 5 minutes à pied. Il propose une collection d'art, un piano bar et un spa."
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "La Cuisine Marocaine (cours dans riad)",
      "Adresse": "Plusieurs (ex. Riad BE)",
      "Tél.": "via inst. @bemarrakech",
      "Réservation": "Oui",
      "Commentaires": ""
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Food tour privé Tasting Marrakech",
      "Adresse": "Medina",
      "Tél.": "via @tasting_marrakech",
      "Réservation": "Oui",
      "Commentaires": ""
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "Moroccan Culinary Arts Museum – cours + déjeuner",
      "Adresse": "Médina",
      "Tél.": "–",
      "Réservation": "Oui",
      "Commentaires": ""
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "L’épicurien",
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
      "Activité": "Musée des confluences: café Bâcha",
      "Adresse": "",
      "Tél.": "",
      "Réservation": "",
      "Commentaires": ""
    },
    {
      "Thématique": "Se sustenter & Apéros & Tea Time",
      "Activité": "L'mida Marrakech : dans la Medina à côté de la place des épices",
      "Adresse": "dans la Medina à côté de la place des épices",
      "Tél.": "+212 5244-43662",
      "Réservation": "Oui",
      "Commentaires": "Une des plus belles terrasses de la médina !\nSitué à 5 minutes à pied de la place Jemaa El Fna, à deux pas de la place des épices, se cache le restaurant L’Mida.\nLa terrasse chic et branchée propose une carte marocaine fusion.L’mida est un lieu où se mêle traditions marrakchi et goût des choses simples.\nAussi agréable pour flâner au soleil en journée que pour admirer le coucher du soleil pour dîner !"
    }
  ],
  "Shopping & design": [
    {
      "Thématique": "Shopping & design",
      "Activité": "Medina Mall Marrakech",
      "Adresse": "Arsat Maach, 91 Avenue Hommane Fetouak",
      "Tél.": "",
      "Réservation": "Non",
      "Commentaires": "Centre Commercial Artisanal. Horaire 09h00 à 01h00"
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
      "Adresse": "",
      "Tél.": "",
      "Réservation": "Non",
      "Commentaires": "Créations artisanales uniques, collaboration avec les mâalems traditionnels"
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
    }
  ]
};

const categoryColors = {
  "Guide Abdoul": "bg-accent/10 border-accent/20",
  "Culture & Musées": "bg-primary/10 border-primary/20",
  "Visites & découvertes": "bg-gradient-to-r from-primary/5 to-accent/5 border-primary/15",
  "Bien-être & détente": "bg-secondary/50 border-secondary/30",
  "Se sustenter & Apéros & Tea Time": "bg-gradient-to-r from-accent/10 to-primary/5 border-accent/20",
  "Shopping & design": "bg-primary-glow/10 border-primary-glow/20",
  "Nuit & détente": "bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20"
};

const categoryEmojis = {
  "Guide Abdoul": "🕌",
  "Culture & Musées": "🎨",
  "Visites & découvertes": "🗺️",
  "Bien-être & détente": "🧘‍♀️",
  "Se sustenter & Apéros & Tea Time": "🍃",
  "Shopping & design": "🛍️",
  "Nuit & détente": "🌙"
};

export default function MarrakechGuide() {
  const [selectedCategory, setSelectedCategory
  ] = useState<string | null>(null);

  const categories = Object.keys(guideData);

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
      { /* Hero Section */}
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
            Guide de Marrakech
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-slide-up opacity-90">
            Découvrez une sélection curatée de nos adresses favorites pour un séjour inoubliable dans la Ville Rouge
          </p>
          <Button 
            onClick={() => setSelectedCategory(categories[
      1
    ])
  }
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-warm animate-slide-up"
          >
            Commencer l'exploration
          </Button>
        </div>
      </div>

      { /* Navigation */}
      <div className="bg-card/95 backdrop-blur-sm sticky top-0 z-40 border-b border-border/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category
    }
                variant={selectedCategory === category ? "default": "outline"
    }
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)
    }
                className={`
                  transition-all duration-300 
                  ${selectedCategory === category 
                    ? "bg-primary text-primary-foreground shadow-warm": "hover:bg-primary/10 hover:border-primary/30"
      }
                `
    }
              >
                <span className="mr-2">{categoryEmojis[category as keyof typeof categoryEmojis
      ]
    }</span>
                {category
    }
              </Button>
            ))
  }
          </div>
        </div>
      </div>

      { /* Content */}
      <div className="container mx-auto px-6 py-12">
        {selectedCategory ? (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                <span className="text-5xl">{categoryEmojis[selectedCategory as keyof typeof categoryEmojis
      ]
    }</span>
                {selectedCategory
    }
              </h2>
              <div className="h-1 w-24 bg-gradient-primary mx-auto rounded-full"></div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {guideData[selectedCategory as keyof typeof guideData
      ].map((activity: Activity, index) => (
                activity.Activité && (
                  <Card key={index
      } className={`
                    group hover:shadow-warm transition-all duration-300 hover:-translate-y-1 
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
                          <Clock className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-accent">Réservation : </span>
                            <span className="text-muted-foreground">{activity.Réservation
        }</span>
                          </div>
                        </div>
                      )
      }

                      {activity.Commentaires && (
                        <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary/30">
                          <div className="flex items-start gap-2 mb-2">
                            <Lightbulb className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                            <span className="font-medium text-accent text-sm">Le petit plus</span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {activity.Commentaires
        }
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
              Choisissez une thématique pour commencer votre découverte
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Chaque catégorie regroupe nos recommandations testées et approuvées pour vous faire vivre la vraie magie de Marrakech
            </p>
          </div>
        )
  }
      </div>

      { /* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg opacity-90">
            Guide curated de Marrakech - Découvrez l'authenticité de la Ville Rouge
          </p>
        </div>
      </footer>
    </div>
  );
}
