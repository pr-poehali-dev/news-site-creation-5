import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { getAuthData, clearAuthData, getRoleLabel, type User } from '@/lib/auth';
import Icon from '@/components/ui/icon';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const authData = getAuthData();
    if (!authData) {
      navigate('/login');
      return;
    }
    setUser(authData.user);
  }, [navigate]);

  const handleLogout = () => {
    clearAuthData();
    toast({
      title: 'Выход выполнен',
      description: 'До скорой встречи!',
    });
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  const initials = user.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : user.username.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Newspaper" size={28} className="text-primary" />
              <h1 className="text-2xl font-bold text-primary">Панель управления</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="animate-scale-in">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{user.full_name || user.username}</CardTitle>
                <Badge className="mt-2">{getRoleLabel(user.role)}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="User" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Логин:</span>
                  <span className="font-medium">{user.username}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="Mail" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="Calendar" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Регистрация:</span>
                  <span className="font-medium">
                    {new Date(user.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                {user.last_login && (
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Clock" size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Последний вход:</span>
                    <span className="font-medium">
                      {new Date(user.last_login).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Shield" size={24} className="text-primary" />
                  Права доступа
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Icon name="CheckCircle2" size={20} className="text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Просмотр материалов</h4>
                      <p className="text-sm text-muted-foreground">
                        Доступ к новостям, фото и видео
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Icon
                      name={
                        user.role === 'junior_moderator' ? 'XCircle' : 'CheckCircle2'
                      }
                      size={20}
                      className={
                        user.role === 'junior_moderator'
                          ? 'text-red-600 mt-1'
                          : 'text-green-600 mt-1'
                      }
                    />
                    <div>
                      <h4 className="font-semibold mb-1">Редактирование</h4>
                      <p className="text-sm text-muted-foreground">
                        Изменение публикаций
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Icon
                      name={
                        ['moderator', 'junior_admin', 'admin', 'deputy_chief_admin', 'chief_admin'].includes(
                          user.role
                        )
                          ? 'CheckCircle2'
                          : 'XCircle'
                      }
                      size={20}
                      className={
                        ['moderator', 'junior_admin', 'admin', 'deputy_chief_admin', 'chief_admin'].includes(
                          user.role
                        )
                          ? 'text-green-600 mt-1'
                          : 'text-red-600 mt-1'
                      }
                    />
                    <div>
                      <h4 className="font-semibold mb-1">Публикация</h4>
                      <p className="text-sm text-muted-foreground">
                        Размещение новых материалов
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Icon
                      name={
                        ['admin', 'deputy_chief_admin', 'chief_admin'].includes(user.role)
                          ? 'CheckCircle2'
                          : 'XCircle'
                      }
                      size={20}
                      className={
                        ['admin', 'deputy_chief_admin', 'chief_admin'].includes(user.role)
                          ? 'text-green-600 mt-1'
                          : 'text-red-600 mt-1'
                      }
                    />
                    <div>
                      <h4 className="font-semibold mb-1">Управление пользователями</h4>
                      <p className="text-sm text-muted-foreground">
                        Добавление и редактирование
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BarChart3" size={24} className="text-primary" />
                  Быстрая статистика
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-1">24</div>
                    <div className="text-sm text-muted-foreground">Новости</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-1">12</div>
                    <div className="text-sm text-muted-foreground">Фоторепортажи</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-1">8</div>
                    <div className="text-sm text-muted-foreground">Видео</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-1">5</div>
                    <div className="text-sm text-muted-foreground">Афиша</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
