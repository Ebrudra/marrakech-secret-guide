import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, Users, Eye, Click, Star, Gift } from "lucide-react";
import { analytics } from "@/lib/analytics";

interface MonetizationMetrics {
  totalRevenue: number;
  affiliateRevenue: number;
  adRevenue: number;
  premiumRevenue: number;
  totalClicks: number;
  conversionRate: number;
  activeUsers: number;
  premiumUsers: number;
  topPerformingAds: any[];
  topAffiliateOffers: any[];
}

interface MonetizationDashboardProps {
  language: 'fr' | 'en';
}

const translations = {
  fr: {
    title: "Tableau de Bord Monétisation",
    overview: "Vue d'ensemble",
    ads: "Publicités",
    affiliates: "Affiliés",
    premium: "Premium",
    totalRevenue: "Revenus totaux",
    affiliateRevenue: "Revenus affiliés",
    adRevenue: "Revenus publicitaires",
    premiumRevenue: "Revenus premium",
    totalClicks: "Clics totaux",
    conversionRate: "Taux de conversion",
    activeUsers: "Utilisateurs actifs",
    premiumUsers: "Utilisateurs premium",
    topAds: "Publicités performantes",
    topOffers: "Offres affiliées performantes",
    performance: "Performance",
    revenue: "Revenus",
    clicks: "Clics",
    impressions: "Impressions",
    ctr: "CTR",
    commission: "Commission",
    thisMonth: "Ce mois",
    lastMonth: "Mois dernier",
    growth: "Croissance"
  },
  en: {
    title: "Monetization Dashboard",
    overview: "Overview",
    ads: "Ads",
    affiliates: "Affiliates",
    premium: "Premium",
    totalRevenue: "Total revenue",
    affiliateRevenue: "Affiliate revenue",
    adRevenue: "Ad revenue",
    premiumRevenue: "Premium revenue",
    totalClicks: "Total clicks",
    conversionRate: "Conversion rate",
    activeUsers: "Active users",
    premiumUsers: "Premium users",
    topAds: "Top performing ads",
    topOffers: "Top affiliate offers",
    performance: "Performance",
    revenue: "Revenue",
    clicks: "Clicks",
    impressions: "Impressions",
    ctr: "CTR",
    commission: "Commission",
    thisMonth: "This month",
    lastMonth: "Last month",
    growth: "Growth"
  }
};

export default function MonetizationDashboard({ language }: MonetizationDashboardProps) {
  const [metrics, setMetrics] = useState<MonetizationMetrics>({
    totalRevenue: 0,
    affiliateRevenue: 0,
    adRevenue: 0,
    premiumRevenue: 0,
    totalClicks: 0,
    conversionRate: 0,
    activeUsers: 0,
    premiumUsers: 0,
    topPerformingAds: [],
    topAffiliateOffers: []
  });

  const t = translations[language];

  useEffect(() => {
    calculateMetrics();
  }, []);

  const calculateMetrics = () => {
    // Get analytics data
    const analyticsEvents = JSON.parse(localStorage.getItem('marrakech-analytics-events') || '[]');
    const affiliateInteractions = JSON.parse(localStorage.getItem('marrakech-affiliate-interactions') || '[]');
    const adInteractions = JSON.parse(localStorage.getItem('marrakech-ad-interactions') || '[]');
    const userPlan = localStorage.getItem('marrakech-user-plan') || 'free';

    // Calculate revenue (mock data for demonstration)
    const affiliateRevenue = affiliateInteractions.reduce((sum: number, interaction: any) => {
      return sum + (interaction.commission || 0) * 2.5; // Estimated revenue per click
    }, 0);

    const adRevenue = adInteractions.filter((i: any) => i.action === 'click').length * 0.15; // $0.15 per click
    
    const premiumRevenue = userPlan === 'premium' ? 9.99 : userPlan === 'vip' ? 29.99 : 0;

    // Calculate other metrics
    const totalClicks = affiliateInteractions.length + adInteractions.filter((i: any) => i.action === 'click').length;
    const totalImpressions = adInteractions.length + affiliateInteractions.length;
    const conversionRate = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    // Mock user data
    const activeUsers = Math.floor(Math.random() * 1000) + 500;
    const premiumUsers = userPlan !== 'free' ? 1 : 0;

    // Top performing content
    const topAds = adInteractions
      .filter((i: any) => i.action === 'click')
      .reduce((acc: any, interaction: any) => {
        const existing = acc.find((item: any) => item.ad_id === interaction.ad_id);
        if (existing) {
          existing.clicks++;
        } else {
          acc.push({
            ad_id: interaction.ad_id,
            clicks: 1,
            revenue: 0.15
          });
        }
        return acc;
      }, [])
      .sort((a: any, b: any) => b.clicks - a.clicks)
      .slice(0, 5);

    const topOffers = affiliateInteractions
      .reduce((acc: any, interaction: any) => {
        const existing = acc.find((item: any) => item.offer_id === interaction.offer_id);
        if (existing) {
          existing.clicks++;
          existing.revenue += interaction.commission * 2.5;
        } else {
          acc.push({
            offer_id: interaction.offer_id,
            partner: interaction.partner,
            title: interaction.title,
            clicks: 1,
            revenue: interaction.commission * 2.5
          });
        }
        return acc;
      }, [])
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5);

    setMetrics({
      totalRevenue: affiliateRevenue + adRevenue + premiumRevenue,
      affiliateRevenue,
      adRevenue,
      premiumRevenue,
      totalClicks,
      conversionRate,
      activeUsers,
      premiumUsers,
      topPerformingAds: topAds,
      topAffiliateOffers: topOffers
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const MetricCard = ({ title, value, icon: Icon, color = "text-primary", growth }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {growth && (
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+{growth}%</span>
              </div>
            )}
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">{t.title}</h2>
        <p className="text-muted-foreground">
          Suivi des performances et revenus de monétisation
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="ads">{t.ads}</TabsTrigger>
          <TabsTrigger value="affiliates">{t.affiliates}</TabsTrigger>
          <TabsTrigger value="premium">{t.premium}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title={t.totalRevenue}
              value={formatCurrency(metrics.totalRevenue)}
              icon={DollarSign}
              color="text-green-600"
              growth={12.5}
            />
            <MetricCard
              title={t.totalClicks}
              value={metrics.totalClicks.toLocaleString()}
              icon={Click}
              color="text-blue-600"
              growth={8.3}
            />
            <MetricCard
              title={t.activeUsers}
              value={metrics.activeUsers.toLocaleString()}
              icon={Users}
              color="text-purple-600"
              growth={15.2}
            />
            <MetricCard
              title={t.conversionRate}
              value={`${metrics.conversionRate.toFixed(1)}%`}
              icon={TrendingUp}
              color="text-orange-600"
              growth={5.7}
            />
          </div>

          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-blue-500" />
                    <span>{t.affiliateRevenue}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(metrics.affiliateRevenue)}</div>
                    <Progress 
                      value={(metrics.affiliateRevenue / metrics.totalRevenue) * 100} 
                      className="w-24 h-2 mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-green-500" />
                    <span>{t.adRevenue}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(metrics.adRevenue)}</div>
                    <Progress 
                      value={(metrics.adRevenue / metrics.totalRevenue) * 100} 
                      className="w-24 h-2 mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{t.premiumRevenue}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(metrics.premiumRevenue)}</div>
                    <Progress 
                      value={(metrics.premiumRevenue / metrics.totalRevenue) * 100} 
                      className="w-24 h-2 mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.topAds}</CardTitle>
            </CardHeader>
            <CardContent>
              {metrics.topPerformingAds.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Aucune donnée publicitaire disponible
                </p>
              ) : (
                <div className="space-y-3">
                  {metrics.topPerformingAds.map((ad, index) => (
                    <div key={ad.ad_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <div>
                          <div className="font-medium">Publicité {ad.ad_id}</div>
                          <div className="text-sm text-muted-foreground">
                            {ad.clicks} clics
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(ad.revenue)}</div>
                        <div className="text-sm text-muted-foreground">Revenus</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="affiliates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.topOffers}</CardTitle>
            </CardHeader>
            <CardContent>
              {metrics.topAffiliateOffers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Aucune donnée d'affiliation disponible
                </p>
              ) : (
                <div className="space-y-3">
                  {metrics.topAffiliateOffers.map((offer, index) => (
                    <div key={offer.offer_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <div>
                          <div className="font-medium">{offer.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {offer.partner} • {offer.clicks} clics
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(offer.revenue)}</div>
                        <div className="text-sm text-muted-foreground">Commission</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="premium" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Utilisateurs Premium"
              value={metrics.premiumUsers}
              icon={Star}
              color="text-yellow-600"
            />
            <MetricCard
              title="Revenus Premium"
              value={formatCurrency(metrics.premiumRevenue)}
              icon={DollarSign}
              color="text-green-600"
            />
            <MetricCard
              title="Taux de Conversion"
              value={`${((metrics.premiumUsers / metrics.activeUsers) * 100).toFixed(1)}%`}
              icon={TrendingUp}
              color="text-blue-600"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Analyse Premium</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {metrics.premiumUsers === 0 
                      ? "Aucun utilisateur premium actuellement"
                      : `${metrics.premiumUsers} utilisateur(s) premium actif(s)`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}