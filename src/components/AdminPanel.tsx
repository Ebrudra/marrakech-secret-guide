import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { Plus, Edit, Trash2, Save, X, Users, Activity, BarChart3 } from 'lucide-react';

interface AdminPanelProps {
  language: 'fr' | 'en';
}

export default function AdminPanel({ language }: AdminPanelProps) {
  const [activities, setActivities] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    category_id: '',
    street_address: '',
    phone_number: '',
    website_url: '',
    reservation_info: '',
    comments: '',
    price_level: 1,
    is_featured: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load activities
      const { data: activitiesData } = await supabase
        .from('activities')
        .select(`
          *,
          categories (name)
        `)
        .order('created_at', { ascending: false });
      
      setActivities(activitiesData || []);

      // Load categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      setCategories(categoriesData || []);

      // Load users (admin only)
      const { data: usersData } = await supabase
        .from('users')
        .select('id, username, first_name, last_name, role, created_at')
        .order('created_at', { ascending: false });
      
      setUsers(usersData || []);

      // Load stats
      const { count: activitiesCount } = await supabase
        .from('activities')
        .select('*', { count: 'exact', head: true });

      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      const { count: reviewsCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });

      setStats({
        activities: activitiesCount || 0,
        users: usersCount || 0,
        reviews: reviewsCount || 0
      });

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast('Erreur lors du chargement des données');
    }
  };

  const handleCreateActivity = async () => {
    try {
      const { error } = await supabase
        .from('activities')
        .insert([newActivity]);

      if (error) throw error;

      toast('Activité créée avec succès');
      setNewActivity({
        name: '',
        description: '',
        category_id: '',
        street_address: '',
        phone_number: '',
        website_url: '',
        reservation_info: '',
        comments: '',
        price_level: 1,
        is_featured: false
      });
      loadData();
    } catch (error) {
      console.error('Error creating activity:', error);
      toast('Erreur lors de la création');
    }
  };

  const handleUpdateActivity = async (activity: any) => {
    try {
      const { error } = await supabase
        .from('activities')
        .update(activity)
        .eq('id', activity.id);

      if (error) throw error;

      toast('Activité mise à jour');
      setEditingActivity(null);
      loadData();
    } catch (error) {
      console.error('Error updating activity:', error);
      toast('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteActivity = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) return;

    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast('Activité supprimée');
      loadData();
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast('Erreur lors de la suppression');
    }
  };

  const toggleActivityApproval = async (id: number, isApproved: boolean) => {
    try {
      const { error } = await supabase
        .from('activities')
        .update({ is_approved: !isApproved })
        .eq('id', id);

      if (error) throw error;

      toast(isApproved ? 'Activité masquée' : 'Activité approuvée');
      loadData();
    } catch (error) {
      console.error('Error toggling approval:', error);
      toast('Erreur lors de la modification');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Panneau d'Administration</h2>
        <p className="text-muted-foreground">Gestion du contenu et des utilisateurs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Activités</p>
                <p className="text-2xl font-bold">{stats.activities}</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
                <p className="text-2xl font-bold">{stats.users}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avis</p>
                <p className="text-2xl font-bold">{stats.reviews}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activities" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activities">Activités</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="create">Créer Activité</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Activités</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="border rounded-lg p-4">
                    {editingActivity?.id === activity.id ? (
                      <div className="space-y-4">
                        <Input
                          value={editingActivity.name}
                          onChange={(e) => setEditingActivity({
                            ...editingActivity,
                            name: e.target.value
                          })}
                          placeholder="Nom de l'activité"
                        />
                        <Textarea
                          value={editingActivity.description}
                          onChange={(e) => setEditingActivity({
                            ...editingActivity,
                            description: e.target.value
                          })}
                          placeholder="Description"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleUpdateActivity(editingActivity)}
                            size="sm"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Sauvegarder
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingActivity(null)}
                            size="sm"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{activity.name}</h4>
                            <Badge variant={activity.is_approved ? "default" : "destructive"}>
                              {activity.is_approved ? "Approuvé" : "En attente"}
                            </Badge>
                            {activity.is_featured && (
                              <Badge variant="secondary">Mis en avant</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {activity.categories?.name}
                          </p>
                          <p className="text-sm line-clamp-2">{activity.description}</p>
                          {activity.street_address && (
                            <p className="text-xs text-muted-foreground mt-1">
                              📍 {activity.street_address}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={activity.is_approved}
                            onCheckedChange={() => toggleActivityApproval(activity.id, activity.is_approved)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingActivity(activity)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteActivity(activity.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">
                        {user.first_name} {user.last_name} ({user.username})
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Inscrit le {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Créer une Nouvelle Activité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom de l'activité</Label>
                  <Input
                    value={newActivity.name}
                    onChange={(e) => setNewActivity({
                      ...newActivity,
                      name: e.target.value
                    })}
                    placeholder="Nom de l'activité"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <select
                    value={newActivity.category_id}
                    onChange={(e) => setNewActivity({
                      ...newActivity,
                      category_id: e.target.value
                    })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input
                    value={newActivity.street_address}
                    onChange={(e) => setNewActivity({
                      ...newActivity,
                      street_address: e.target.value
                    })}
                    placeholder="Adresse complète"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    value={newActivity.phone_number}
                    onChange={(e) => setNewActivity({
                      ...newActivity,
                      phone_number: e.target.value
                    })}
                    placeholder="+212 ..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Site web</Label>
                  <Input
                    value={newActivity.website_url}
                    onChange={(e) => setNewActivity({
                      ...newActivity,
                      website_url: e.target.value
                    })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Niveau de prix (1-4)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="4"
                    value={newActivity.price_level}
                    onChange={(e) => setNewActivity({
                      ...newActivity,
                      price_level: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({
                    ...newActivity,
                    description: e.target.value
                  })}
                  placeholder="Description détaillée de l'activité"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Informations de réservation</Label>
                <Input
                  value={newActivity.reservation_info}
                  onChange={(e) => setNewActivity({
                    ...newActivity,
                    reservation_info: e.target.value
                  })}
                  placeholder="Informations sur les réservations"
                />
              </div>

              <div className="space-y-2">
                <Label>Commentaires/Conseils</Label>
                <Textarea
                  value={newActivity.comments}
                  onChange={(e) => setNewActivity({
                    ...newActivity,
                    comments: e.target.value
                  })}
                  placeholder="Conseils et commentaires supplémentaires"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newActivity.is_featured}
                  onCheckedChange={(checked) => setNewActivity({
                    ...newActivity,
                    is_featured: checked
                  })}
                />
                <Label>Mettre en avant cette activité</Label>
              </div>

              <Button onClick={handleCreateActivity} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Créer l'Activité
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}