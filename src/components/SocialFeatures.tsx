import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, Users, Camera, MapPin, Star, Send } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface SocialPost {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  images: string[];
  location: string;
  activity: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
}

interface SocialFeaturesProps {
  userPlan: 'free' | 'premium' | 'vip';
  language: 'fr' | 'en';
}

const translations = {
  fr: {
    title: "Communauté Marrakech",
    subtitle: "Partagez vos expériences et découvrez celles des autres",
    shareExperience: "Partager une expérience",
    whatHappening: "Que se passe-t-il ?",
    addPhoto: "Ajouter une photo",
    addLocation: "Ajouter un lieu",
    post: "Publier",
    likes: "J'aime",
    comments: "Commentaires",
    shares: "Partages",
    verified: "Vérifié",
    justNow: "À l'instant",
    minutesAgo: "min",
    hoursAgo: "h",
    daysAgo: "j",
    writeComment: "Écrire un commentaire...",
    send: "Envoyer",
    premiumFeature: "Fonctionnalité Premium",
    upgradeToShare: "Passez au Premium pour partager vos expériences",
    trendingSpots: "Lieux Tendance",
    topReviews: "Meilleurs Avis",
    communityTips: "Conseils Communauté"
  },
  en: {
    title: "Marrakech Community",
    subtitle: "Share your experiences and discover others'",
    shareExperience: "Share an experience",
    whatHappening: "What's happening?",
    addPhoto: "Add photo",
    addLocation: "Add location",
    post: "Post",
    likes: "Likes",
    comments: "Comments",
    shares: "Shares",
    verified: "Verified",
    justNow: "Just now",
    minutesAgo: "min",
    hoursAgo: "h",
    daysAgo: "d",
    writeComment: "Write a comment...",
    send: "Send",
    premiumFeature: "Premium Feature",
    upgradeToShare: "Upgrade to Premium to share your experiences",
    trendingSpots: "Trending Spots",
    topReviews: "Top Reviews",
    communityTips: "Community Tips"
  }
};

const mockPosts: SocialPost[] = [
  {
    id: 'post-1',
    user: {
      name: 'Sarah Martinez',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true
    },
    content: 'Incroyable expérience au Jardin Majorelle ! Les couleurs sont encore plus vibrantes en réalité. Le musée YSL vaut vraiment le détour. 🌿✨',
    images: ['https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=400'],
    location: 'Jardin Majorelle',
    activity: 'Culture & Musées',
    timestamp: '2024-03-14T10:30:00Z',
    likes: 47,
    comments: 12,
    shares: 8,
    liked: false
  },
  {
    id: 'post-2',
    user: {
      name: 'Ahmed Benali',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: false
    },
    content: 'Coucher de soleil magique depuis la terrasse du Nomad. La vue sur la médina est à couper le souffle ! Parfait pour un dîner romantique 🌅',
    images: ['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'],
    location: 'Nomad Restaurant',
    activity: 'Se sustenter & Apéros & Tea Time',
    timestamp: '2024-03-14T18:45:00Z',
    likes: 89,
    comments: 23,
    shares: 15,
    liked: true
  },
  {
    id: 'post-3',
    user: {
      name: 'Emma Thompson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true
    },
    content: 'Journée incroyable dans l\'Atlas avec le guide Abdoul ! Randonnée, villages berbères et hospitalité exceptionnelle. Une expérience authentique ! 🏔️',
    images: ['https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=400'],
    location: 'Montagnes de l\'Atlas',
    activity: 'Visites & découvertes',
    timestamp: '2024-03-13T16:20:00Z',
    likes: 156,
    comments: 34,
    shares: 28,
    liked: false
  }
];

export default function SocialFeatures({ userPlan, language }: SocialFeaturesProps) {
  const [posts, setPosts] = useState<SocialPost[]>(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const t = translations[language];

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t.justNow;
    if (diffInMinutes < 60) return `${diffInMinutes}${t.minutesAgo}`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}${t.hoursAgo}`;
    return `${Math.floor(diffInMinutes / 1440)}${t.daysAgo}`;
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked, 
            likes: post.liked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  const handleShare = (post: SocialPost) => {
    const shareText = `Découvrez cette expérience à ${post.location} sur le Guide de Marrakech !`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Guide de Marrakech',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      toast('Lien copié dans le presse-papiers !');
    }
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    
    if (userPlan === 'free') {
      toast(t.upgradeToShare);
      return;
    }

    const post: SocialPost = {
      id: `post-${Date.now()}`,
      user: {
        name: 'Vous',
        avatar: '',
        verified: userPlan === 'vip'
      },
      content: newPost,
      images: [],
      location: selectedLocation,
      activity: '',
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setSelectedLocation('');
    toast('Expérience partagée avec succès !');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          {t.title}
        </h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Share Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {t.shareExperience}
            {userPlan === 'free' && (
              <Badge variant="outline" className="ml-auto">
                {t.premiumFeature}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder={t.whatHappening}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              disabled={userPlan === 'free'}
              className="min-h-[100px]"
            />
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={userPlan === 'free'}
              >
                <Camera className="h-4 w-4 mr-2" />
                {t.addPhoto}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                disabled={userPlan === 'free'}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {t.addLocation}
              </Button>
              
              <Button 
                onClick={handlePost}
                disabled={userPlan === 'free' || !newPost.trim()}
                className="ml-auto"
              >
                {t.post}
              </Button>
            </div>
            
            {userPlan === 'free' && (
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{t.upgradeToShare}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={post.user.avatar} />
                  <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{post.user.name}</span>
                    {post.user.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        {t.verified}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatTimestamp(post.timestamp)}</span>
                    {post.location && (
                      <>
                        <span>•</span>
                        <MapPin className="h-3 w-3" />
                        <span>{post.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <p className="mb-4">{post.content}</p>

              {/* Images */}
              {post.images.length > 0 && (
                <div className="mb-4">
                  <img 
                    src={post.images[0]} 
                    alt="Post image"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Activity Badge */}
              {post.activity && (
                <Badge variant="outline" className="mb-4">
                  {post.activity}
                </Badge>
              )}

              {/* Actions */}
              <div className="flex items-center gap-6 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={post.liked ? 'text-red-500' : ''}
                >
                  <Heart className={`h-4 w-4 mr-2 ${post.liked ? 'fill-current' : ''}`} />
                  {post.likes} {t.likes}
                </Button>

                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {post.comments} {t.comments}
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleShare(post)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {post.shares} {t.shares}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trending Sidebar */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t.trendingSpots}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Jardin Majorelle</span>
                <Badge variant="secondary">156 posts</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Place Jemaa el-Fnaa</span>
                <Badge variant="secondary">134 posts</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Palais Bahia</span>
                <Badge variant="secondary">98 posts</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t.topReviews}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.9</span>
                </div>
                <p className="text-muted-foreground">Riad Kniza - Service exceptionnel</p>
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8</span>
                </div>
                <p className="text-muted-foreground">Nomad - Vue magnifique</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t.communityTips}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>"Visitez les souks tôt le matin pour éviter la foule"</p>
              <p>"Négociez toujours les prix dans les souks"</p>
              <p>"Goûtez le thé à la menthe chez Bacha Coffee"</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}