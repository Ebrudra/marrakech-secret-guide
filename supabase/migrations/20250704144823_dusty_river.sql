/*
  # Seed Data for Marrakech Guide
  
  This migration populates the database with initial categories, tags, and activities
  based on the existing guide data.
*/

-- Insert categories
INSERT INTO categories (name, slug, description) VALUES
('Guide Touristique', 'guide-touristique', 'Guides locaux et services touristiques'),
('Culture & Musées', 'culture-musees', 'Musées, sites culturels et patrimoine'),
('Se sustenter & Apéros & Tea Time', 'restaurants-bars', 'Restaurants, bars, cafés et expériences culinaires'),
('Bien-être & détente', 'bien-etre', 'Spas, hammams et centres de bien-être'),
('Shopping & design', 'shopping', 'Boutiques, souks et shopping'),
('Visites & découvertes', 'visites', 'Excursions, visites guidées et découvertes'),
('Nuit & détente', 'nuit', 'Vie nocturne et divertissement')
ON CONFLICT (slug) DO NOTHING;

-- Insert tags
INSERT INTO tags (name, slug) VALUES
('Authentique', 'authentique'),
('Traditionnel', 'traditionnel'),
('Moderne', 'moderne'),
('Rooftop', 'rooftop'),
('Vue panoramique', 'vue-panoramique'),
('Médina', 'medina'),
('Guéliz', 'gueliz'),
('Hivernage', 'hivernage'),
('Palmeraie', 'palmeraie'),
('Famille', 'famille'),
('Romantique', 'romantique'),
('Luxe', 'luxe'),
('Budget', 'budget'),
('WiFi', 'wifi'),
('Parking', 'parking'),
('Terrasse', 'terrasse'),
('Climatisation', 'climatisation'),
('Piscine', 'piscine'),
('Spa', 'spa'),
('Restaurant', 'restaurant'),
('Bar', 'bar')
ON CONFLICT (slug) DO NOTHING;

-- Insert activities from the existing guide data
INSERT INTO activities (
  name, 
  description, 
  category_id, 
  street_address,
  phone_number,
  reservation_info,
  comments,
  latitude,
  longitude,
  is_approved,
  is_featured
) VALUES
-- Guide Touristique
(
  'Guide local Abdoul',
  'Guide expert de la médina, recommandé pour découvrir les secrets de Marrakech',
  (SELECT id FROM categories WHERE slug = 'guide-touristique'),
  '',
  '212670720118',
  'Appelez de la part de Yann',
  'Guide expert de la médina, recommandé pour découvrir les secrets de Marrakech',
  31.6295,
  -7.9811,
  true,
  true
),

-- Culture & Musées
(
  'Maison de la Photographie',
  'Photos historiques et magnifique rooftop avec vue. Collection unique de photographies du Maroc du 19ème et 20ème siècle.',
  (SELECT id FROM categories WHERE slug = 'culture-musees'),
  'Medina - Rue Ahl Fes, 46 Rue Bin Lafnadek',
  '+212 5243-85721',
  'Non obligatoire, mais conseillé',
  'Photos historiques et magnifique rooftop avec vue. Horaire : 10h à 19h00',
  31.6340,
  -7.9890,
  true,
  true
),

(
  'Musée Yves Saint Laurent + Musée Berbère + Jardin Majorelle',
  'Trio incontournable de Marrakech. Le jardin botanique créé par Jacques Majorelle, le musée dédié au couturier et la collection berbère.',
  (SELECT id FROM categories WHERE slug = 'culture-musees'),
  'Rue Yves Saint Laurent, Guéliz',
  '+212 5243-13047',
  'Oui, en ligne',
  'Trio incontournable de Marrakech. Horaire : 10h à 18h30',
  31.6417,
  -8.0033,
  true,
  true
),

(
  'Palais Bahia',
  'Magnifique palais du 19ème siècle avec ses jardins et ses salles décorées de zellige et de bois peint.',
  (SELECT id FROM categories WHERE slug = 'culture-musees'),
  'Rue Riad Zitoun el Jdid, Médina',
  '+212 524-389564',
  'Non obligatoire',
  'Un des plus beaux palais de Marrakech, exemple parfait de l''architecture marocaine',
  31.6205,
  -7.9844,
  true,
  true
),

(
  'Palais El Badi',
  'Ruines spectaculaires d''un palais du 16ème siècle, surnommé "la merveille du monde".',
  (SELECT id FROM categories WHERE slug = 'culture-musees'),
  'Ksibat Nhass, Médina',
  '+212 524-378116',
  'Non obligatoire',
  'Vue imprenable depuis les terrasses, idéal pour le coucher de soleil',
  31.6158,
  -7.9833,
  true,
  false
),

-- Se sustenter & Apéros & Tea Time
(
  'Nomad – rooftop moderne (tagines fusion)',
  'Restaurant moderne avec une superbe vue sur une oasis de palmiers et un incroyable coucher de soleil.',
  (SELECT id FROM categories WHERE slug = 'restaurants-bars'),
  '1 Derb Aarjane, Médina',
  '+212 524 381 609 / 661 451 519',
  'Oui (groupe ≥ 5)',
  'Avec sa superbe vue sur une oasis de palmiers et son incroyable coucher de soleil en font l''un des spots les plus prisés de la ville de Marrakech.',
  31.6318,
  -7.9890,
  true,
  true
),

(
  'Café des Épices',
  'Café traditionnel au cœur des souks avec terrasse panoramique sur la médina.',
  (SELECT id FROM categories WHERE slug = 'restaurants-bars'),
  '75 Rahba Lakdima, Médina',
  '+212 524-391770',
  'Non obligatoire',
  'Parfait pour une pause thé à la menthe avec vue sur l''agitation des souks',
  31.6318,
  -7.9890,
  true,
  false
),

(
  'La Mamounia - Bar Churchill',
  'Bar légendaire du palace La Mamounia, fréquenté par Winston Churchill.',
  (SELECT id FROM categories WHERE slug = 'restaurants-bars'),
  'Avenue Bab Jdid, Hivernage',
  '+212 524-388600',
  'Oui, tenue correcte exigée',
  'Ambiance feutrée et cocktails d''exception dans un cadre somptueux',
  31.6147,
  -8.0103,
  true,
  true
),

(
  'Terrasse des Épices',
  'Restaurant avec terrasse offrant une vue panoramique sur la médina et l''Atlas.',
  (SELECT id FROM categories WHERE slug = 'restaurants-bars'),
  '15 Souk Cherifia, Sidi Abdelaziz, Médina',
  '+212 524-375904',
  'Recommandée le soir',
  'Cuisine fusion dans un cadre romantique, parfait pour un dîner en amoureux',
  31.6318,
  -7.9890,
  true,
  true
),

-- Bien-être & détente
(
  'Hammam de la Rose',
  'Hammam traditionnel authentique tenu par des femmes, dans un riad historique.',
  (SELECT id FROM categories WHERE slug = 'bien-etre'),
  '124 Derb Chtouka, Kasbah',
  '+212 661-207040',
  'Oui, réservation obligatoire',
  'Expérience authentique avec gommage au savon noir et massage à l''huile d''argan',
  31.6158,
  -7.9833,
  true,
  true
),

(
  'La Mamounia Spa',
  'Spa de luxe du palace La Mamounia, référence mondiale du bien-être.',
  (SELECT id FROM categories WHERE slug = 'bien-etre'),
  'Avenue Bab Jdid, Hivernage',
  '+212 524-388600',
  'Oui, réservation obligatoire',
  'Soins haut de gamme dans un cadre exceptionnel avec piscine et jardins',
  31.6147,
  -8.0103,
  true,
  true
),

-- Shopping & design
(
  'Souk Semmarine',
  'Artère principale des souks de Marrakech, idéale pour découvrir l''artisanat local.',
  (SELECT id FROM categories WHERE slug = 'shopping'),
  'Souk Semmarine, Médina',
  '',
  'Négociation recommandée',
  'Le plus grand souk de Marrakech avec tapis, babouches, épices et artisanat',
  31.6318,
  -7.9890,
  true,
  false
),

(
  'Ensemble Artisanal',
  'Coopérative d''artisans avec prix fixes, parfait pour découvrir l''artisanat sans négocier.',
  (SELECT id FROM categories WHERE slug = 'shopping'),
  'Avenue Mohammed V, Guéliz',
  '+212 524-423063',
  'Non obligatoire',
  'Prix fixes et qualité garantie, idéal pour les achats sans stress',
  31.6295,
  -8.0033,
  true,
  false
),

-- Visites & découvertes
(
  'Excursion Vallée de l''Ourika',
  'Découverte des cascades et villages berbères dans les montagnes de l''Atlas.',
  (SELECT id FROM categories WHERE slug = 'visites'),
  'Départ depuis Marrakech',
  '+212 661-234567',
  'Oui, réservation obligatoire',
  'Journée complète avec guide berbère, déjeuner traditionnel et randonnée facile',
  31.3000,
  -7.7000,
  true,
  true
),

(
  'Jardin Secret',
  'Jardin historique restauré au cœur de la médina avec architecture islamique et andalouse.',
  (SELECT id FROM categories WHERE slug = 'visites'),
  '121 Rue Mouassine, Médina',
  '+212 524-391638',
  'Non obligatoire',
  'Oasis de paix avec jardins exotique et islamique, tour de guet avec vue panoramique',
  31.6340,
  -7.9890,
  true,
  false
)

ON CONFLICT DO NOTHING;

-- Link activities with relevant tags
INSERT INTO activity_tags (activity_id, tag_id)
SELECT a.id, t.id
FROM activities a, tags t
WHERE 
  (a.name = 'Guide local Abdoul' AND t.slug IN ('authentique', 'traditionnel', 'medina')) OR
  (a.name = 'Maison de la Photographie' AND t.slug IN ('culture', 'rooftop', 'vue-panoramique', 'medina')) OR
  (a.name = 'Musée Yves Saint Laurent + Musée Berbère + Jardin Majorelle' AND t.slug IN ('culture', 'moderne', 'gueliz', 'famille')) OR
  (a.name = 'Palais Bahia' AND t.slug IN ('traditionnel', 'authentique', 'medina', 'famille')) OR
  (a.name = 'Nomad – rooftop moderne (tagines fusion)' AND t.slug IN ('moderne', 'rooftop', 'vue-panoramique', 'romantique', 'medina')) OR
  (a.name = 'La Mamounia - Bar Churchill' AND t.slug IN ('luxe', 'hivernage', 'romantique')) OR
  (a.name = 'Terrasse des Épices' AND t.slug IN ('rooftop', 'vue-panoramique', 'romantique', 'medina')) OR
  (a.name = 'Hammam de la Rose' AND t.slug IN ('authentique', 'traditionnel', 'spa')) OR
  (a.name = 'La Mamounia Spa' AND t.slug IN ('luxe', 'spa', 'piscine', 'hivernage')) OR
  (a.name = 'Souk Semmarine' AND t.slug IN ('traditionnel', 'authentique', 'medina')) OR
  (a.name = 'Excursion Vallée de l''Ourika' AND t.slug IN ('authentique', 'famille'))
ON CONFLICT DO NOTHING;

-- Create a default admin user (you'll need to update this with your actual admin email)
-- This will be handled in the application when the first admin signs up