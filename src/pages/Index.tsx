import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const newsData = {
  trending: [
    {
      id: 1,
      title: "Новый парк открылся в центре города",
      category: "Афиша",
      image: "/placeholder.svg",
      views: 12500,
      time: "2 часа назад",
    },
    {
      id: 2,
      title: "Прогноз погоды: теплая неделя впереди",
      category: "Погода",
      image: "/placeholder.svg",
      views: 8900,
      time: "4 часа назад",
    },
    {
      id: 3,
      title: "Фоторепортаж с фестиваля искусств",
      category: "Фоторепортажи",
      image: "/placeholder.svg",
      views: 7200,
      time: "6 часов назад",
    },
  ],
  news: [
    {
      id: 4,
      title: "Городская администрация объявила о новых инициативах",
      excerpt: "Власти представили план развития инфраструктуры на следующий год",
      category: "Новости",
      time: "1 час назад",
    },
    {
      id: 5,
      title: "Местный театр готовит премьеру",
      excerpt: "Спектакль по мотивам классического произведения выйдет в следующем месяце",
      category: "Афиша",
      time: "3 часа назад",
    },
    {
      id: 6,
      title: "Дорожные работы на главной улице завершены",
      excerpt: "Реконструкция заняла три месяца и улучшила транспортную ситуацию",
      category: "Новости",
      time: "5 часов назад",
    },
  ],
  weather: {
    temp: "+18°C",
    condition: "Облачно",
    humidity: "65%",
    wind: "12 км/ч",
  },
  events: [
    {
      id: 7,
      title: "Концерт симфонического оркестра",
      date: "18 ноября",
      location: "Филармония",
    },
    {
      id: 8,
      title: "Выставка современного искусства",
      date: "20 ноября",
      location: "Галерея 'Арт-центр'",
    },
    {
      id: 9,
      title: "Кинопоказ под открытым небом",
      date: "22 ноября",
      location: "Городской парк",
    },
  ],
  videos: [
    {
      id: 10,
      title: "Интервью с мэром города",
      duration: "12:34",
      views: 4500,
    },
    {
      id: 11,
      title: "Как прошел городской марафон",
      duration: "8:15",
      views: 6200,
    },
  ],
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary">Новостной портал</h1>
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex gap-6">
                <a href="#news" className="text-muted-foreground hover:text-foreground transition-colors">
                  Новости
                </a>
                <a href="#weather" className="text-muted-foreground hover:text-foreground transition-colors">
                  Погода
                </a>
                <a href="#events" className="text-muted-foreground hover:text-foreground transition-colors">
                  Афиша
                </a>
                <a href="#photo" className="text-muted-foreground hover:text-foreground transition-colors">
                  Фото
                </a>
                <a href="#video" className="text-muted-foreground hover:text-foreground transition-colors">
                  Видео
                </a>
              </nav>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  <Icon name="LogIn" size={16} className="mr-2" />
                  Вход
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Icon name="TrendingUp" size={28} className="text-primary" />
            <h2 className="text-3xl font-bold">Популярное сейчас</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsData.trending.map((item, index) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 bg-muted">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 left-3">{item.category}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="Eye" size={16} />
                      <span>{item.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Clock" size={16} />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <section id="news" className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Icon name="Newspaper" size={28} className="text-primary" />
                <h2 className="text-3xl font-bold">Новости</h2>
              </div>
              <div className="space-y-4">
                {newsData.news.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow animate-fade-in">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <Badge variant="outline" className="mb-2">
                            {item.category}
                          </Badge>
                          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                          <p className="text-muted-foreground mb-3">{item.excerpt}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Icon name="Clock" size={14} />
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section id="photo" className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Icon name="Camera" size={28} className="text-primary" />
                <h2 className="text-3xl font-bold">Фоторепортажи</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="overflow-hidden hover:shadow-lg transition-all hover:scale-105">
                    <div className="h-48 bg-muted">
                      <img
                        src="/placeholder.svg"
                        alt={`Фоторепортаж ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-3">
                      <p className="font-medium line-clamp-2">Событие дня: репортаж {i}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <Card id="weather" className="animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="CloudSun" size={24} className="text-primary" />
                  Погода
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {newsData.weather.temp}
                  </div>
                  <p className="text-lg text-muted-foreground">{newsData.weather.condition}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Icon name="Droplet" size={18} className="text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Влажность</p>
                      <p className="font-semibold">{newsData.weather.humidity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Wind" size={18} className="text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Ветер</p>
                      <p className="font-semibold">{newsData.weather.wind}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card id="events" className="animate-scale-in" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Calendar" size={24} className="text-primary" />
                  Афиша
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newsData.events.map((event) => (
                    <div key={event.id} className="pb-4 border-b last:border-0 last:pb-0">
                      <h4 className="font-semibold mb-2">{event.title}</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon name="Calendar" size={14} />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="MapPin" size={14} />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card id="video" className="animate-scale-in" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Video" size={24} className="text-primary" />
                  Видео
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newsData.videos.map((video) => (
                    <div key={video.id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                      <div className="w-24 h-16 bg-muted rounded flex-shrink-0 flex items-center justify-center">
                        <Icon name="Play" size={24} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1 line-clamp-2">{video.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{video.duration}</span>
                          <span>👁 {video.views.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <footer className="bg-muted/50 border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Новостной портал. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}