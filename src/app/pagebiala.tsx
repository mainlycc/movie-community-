'use client'

import { useState, useRef, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Film, MessageSquare, ImageIcon, Upload, User, Mail, Star, Youtube, Instagram, Facebook, Twitter, Camera, Hash } from 'lucide-react'

type User = {
  username: string;
  email: string;
  bio: string;
  profilePicture: string;
  favoriteMovies: string[];
}

type MemeTemplate = {
  id: string;
  name: string;
  url: string;
}

type PopularMovie = {
  id: number;
  title: string;
  rating: number;
}

type MovieQuote = {
  id: number;
  quote: string;
  movie: string;
  character: string;
}

type UpcomingPremiere = {
  id: number;
  title: string;
  releaseDate: string;
  genre: string;
}

type Meme = {
  id: string;
  imageUrl: string;
  text: string;
  hashtags: string[];
  author: string;
}

const memeTemplates: MemeTemplate[] = [
  { id: '1', name: 'Drake Hotline Bling', url: '/placeholder.svg?height=300&width=300' },
  { id: '2', name: 'Two Buttons', url: '/placeholder.svg?height=300&width=300' },
  { id: '3', name: 'Distracted Boyfriend', url: '/placeholder.svg?height=300&width=300' },
  { id: '4', name: 'Running Away Balloon', url: '/placeholder.svg?height=300&width=300' },
  { id: '5', name: 'Left Exit 12 Off Ramp', url: '/placeholder.svg?height=300&width=300' },
]

const popularMovies: PopularMovie[] = [
  { id: 1, title: "Skazani na Shawshank", rating: 9.3 },
  { id: 2, title: "Ojciec chrzestny", rating: 9.2 },
  { id: 3, title: "Mroczny Rycerz", rating: 9.0 },
  { id: 4, title: "Dwunastu gniewnych ludzi", rating: 8.9 },
  { id: 5, title: "Lista Schindlera", rating: 8.9 },
]

const favoriteQuotes: MovieQuote[] = [
  { id: 1, quote: "Niech Moc będzie z tobą.", movie: "Gwiezdne wojny", character: "Różne postacie" },
  { id: 2, quote: "Zrobię mu propozycję nie do odrzucenia.", movie: "Ojciec chrzestny", character: "Vito Corleone" },
  { id: 3, quote: "Do mnie mówisz?", movie: "Taksówkarz", character: "Travis Bickle" },
  { id: 4, quote: "Patrz mi w oczy, maleńka.", movie: "Casablanca", character: "Rick Blaine" },
  { id: 5, quote: "Wrócę.", movie: "Terminator", character: "Terminator" },
]

const upcomingPremieres: UpcomingPremiere[] = [
  { id: 1, title: "Diuna: Część druga", releaseDate: "1 marca 2024", genre: "Sci-Fi" },
  { id: 2, title: "Godzilla x Kong: Nowe imperium", releaseDate: "12 kwietnia 2024", genre: "Akcja" },
  { id: 3, title: "Furiosa: Saga Mad Max", releaseDate: "24 maja 2024", genre: "Akcja" },
  { id: 4, title: "W głowie się nie mieści 2", releaseDate: "14 czerwca 2024", genre: "Animacja" },
  { id: 5, title: "Deadpool 3", releaseDate: "26 lipca 2024", genre: "Akcja/Komedia" },
]

export default function CytatyZFilmow() {
  const [activeTab, setActiveTab] = useState('home')
  const [memeText, setMemeText] = useState('')
  const [memeImage, setMemeImage] = useState<string | null>(null)
  const [createdMemes, setCreatedMemes] = useState<Meme[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerUsername, setRegisterUsername] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [textPosition, setTextPosition] = useState('bottom')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [imageScale, setImageScale] = useState(100)
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [favoriteMovies, setFavoriteMovies] = useState<string[]>(['', '', '', '', ''])
  const [memeHashtags, setMemeHashtags] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (canvasRef.current && (memeImage || selectedTemplate)) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        const img = new Image()
        img.onload = () => {
          ctx.clearRect(0, 0, 300, 300)
          const scale = imageScale / 100
          const scaledWidth = img.width * scale
          const scaledHeight = img.height * scale
          const x = (300 - scaledWidth) / 2
          const y = (300 - scaledHeight) / 2
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
          ctx.font = '20px Arial'
          ctx.fillStyle = '#ffffff'
          ctx.strokeStyle = '#000000'
          ctx.lineWidth = 2
          ctx.textAlign = 'center'
          let textY
          switch (textPosition) {
            case 'top':
              textY = 30
              break
            case 'middle':
              textY = 150
              break
            default:
              textY = 280
          }
          ctx.strokeText(memeText, 150, textY)
          ctx.fillText(memeText, 150, textY)
        }
        img.src = memeImage || (selectedTemplate ? memeTemplates.find(t => t.id === selectedTemplate)?.url || '' : '')
      }
    }
  }, [memeText, memeImage, selectedTemplate, textPosition, imageScale])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setMemeImage(e.target?.result as string)
        setSelectedTemplate(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerateMeme = () => {
    if (canvasRef.current && user) {
      const memeDataUrl = canvasRef.current.toDataURL()
      const newMeme: Meme = {
        id: Date.now().toString(),
        imageUrl: memeDataUrl,
        text: memeText,
        hashtags: memeHashtags,
        author: user.username
      }
      setCreatedMemes(prevMemes => [...prevMemes, newMeme])
      setMemeText('')
      setMemeHashtags([])
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggedIn(true)
    setUser({
      username: loginUsername,
      email: `${loginUsername}@example.com`,
      bio: 'Miłośnik filmów',
      profilePicture: '',
      favoriteMovies: []
    })
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggedIn(true)
    setUser({
      username: registerUsername,
      email: registerEmail,
      bio: 'Nowy na Cytaty z filmów',
      profilePicture: '',
      favoriteMovies: []
    })
    setActiveTab('profile-setup')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
  }

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && user) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUser({
          ...user,
          profilePicture: e.target?.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEmailChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      setUser({
        ...user,
        email: newEmail
      })
      setNewEmail('')
    }
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword === confirmPassword) {
      // Here you would typically update the password in your backend
      setNewPassword('')
      setConfirmPassword('')
    } else {
      alert("Hasła nie pasują do siebie")
    }
  }

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (user) {
      setUser({
        ...user,
        bio: e.target.value
      })
    }
  }

  const handleFavoriteMovieChange = (index: number, value: string) => {
    const newFavoriteMovies = [...favoriteMovies]
    newFavoriteMovies[index] = value
    setFavoriteMovies(newFavoriteMovies)
  }

  const handleProfileSetupComplete = () => {
    if (user) {
      setUser({
        ...user,
        favoriteMovies: favoriteMovies.filter(movie => movie !== '')
      })
      setActiveTab('home')
    }
  }

  const handleHashtagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hashtags = e.target.value.split(' ').filter(tag => tag.startsWith('#'))
    setMemeHashtags(hashtags)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Witaj w Cytaty z filmów</CardTitle>
                <CardDescription>Twoja społeczność dla wszystkiego, co związane z kinem</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">Najlepsze filmy tego tygodnia</h3>
                <ul className="space-y-2">
                  {popularMovies.map((movie) => (
                    <li key={movie.id} className="flex items-center justify-between">
                      <span>{movie.title}</span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        {movie.rating}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ulubione cytaty filmowe tygodnia</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {favoriteQuotes.map((quote) => (
                    <li key={quote.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                      <p className="italic">"{quote.quote}"</p>
                      <p className="text-sm text-gray-600">- {quote.character}, {quote.movie}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Nadchodzące premiery</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {upcomingPremieres.map((premiere) => (
                    <li key={premiere.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold">{premiere.title}</span>
                        <span className="text-sm text-gray-600 ml-2">({premiere.genre})</span>
                      </div>
                      <span className="text-sm">{premiere.releaseDate}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )
      case 'discussions':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Najnowsze dyskusje</CardTitle>
              <CardDescription>Dołącz do rozmowy o twoich ulubionych filmach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <DiscussionPreview 
                  title="Najlepszy film Nolana?"
                  author="KinoFan23"
                  replies={42}
                  lastReply="2 godziny temu"
                />
                <DiscussionPreview 
                  title="Niedocenione perełki 2023"
                  author="FilmowiecPL"
                  replies={17}
                  lastReply="1 dzień temu"
                />
                <DiscussionPreview 
                  title="Przewidywania Oscarowe"
                  author="OscarowyObserwator"
                  replies={103}
                  lastReply="3 godziny temu"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Zobacz wszystkie dyskusje</Button>
            </CardFooter>
          </Card>
        )
      case 'meme-generator':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Generator memów</CardTitle>
              <CardDescription>Twórz i udostępniaj memy związane z filmami</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoggedIn ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="meme-template">Wybierz szablon</Label>
                      <Select onValueChange={(value) => {
                        setSelectedTemplate(value)
                        setMemeImage(null)
                      }}>
                        <SelectTrigger id="meme-template">
                          <SelectValue placeholder="Wybierz szablon" />
                        </SelectTrigger>
                        <SelectContent>
                          {memeTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="custom-image">Lub wgraj własny</Label>
                      <Input
                        id="custom-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="meme-text">Tekst mema</Label>
                    <Input
                      id="meme-text"
                      placeholder="Wpisz tekst mema"
                      value={memeText}
                      onChange={(e) => setMemeText(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="meme-hashtags">Hashtagi (oddzielone spacjami)</Label>
                    <Input
                      id="meme-hashtags"
                      placeholder="Np. #film #cytat #śmieszne"
                      onChange={handleHashtagChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="text-position">Pozycja tekstu</Label>
                    <Select onValueChange={(value: string) => setTextPosition(value)}>
                      <SelectTrigger id="text-position">
                        <SelectValue placeholder="Wybierz pozycję tekstu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Góra</SelectItem>
                        <SelectItem value="middle">Środek</SelectItem>
                        <SelectItem value="bottom">Dół</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="image-scale">Skala obrazu</Label>
                    <Slider
                      id="image-scale"
                      min={50}
                      max={150}
                      step={1}
                      value={[imageScale]}
                      onValueChange={(value) => setImageScale(value[0])}
                    />
                  </div>
                  <div className="flex justify-center">
                    <canvas ref={canvasRef} width={300} height={300} className="border border-gray-300" />
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p>Musisz być zalogowany, aby tworzyć memy.</p>
                  <Button onClick={() => setActiveTab('login')} className="mt-4">Zaloguj się</Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {isLoggedIn && <Button onClick={handleGenerateMeme}>Generuj mem</Button>}
            </CardFooter>
          </Card>
        )
      case 'meme-wall':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Ściana memów</CardTitle>
              <CardDescription>Zobacz najnowsze memy stworzone przez społeczność</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {createdMemes.map((meme) => (
                  <div key={meme.id} className="space-y-2">
                    <img src={meme.imageUrl} alt={`Mem społeczności ${meme.id}`} className="w-full h-auto rounded-lg shadow-md" />
                    <p className="text-sm text-gray-600">Autor: {meme.author}</p>
                    <p className="text-sm">{meme.hashtags.join(' ')}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      case 'login':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Logowanie</CardTitle>
              <CardDescription>Witaj z powrotem! Zaloguj się na swoje konto.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nazwa użytkownika</Label>
                  <Input
                    id="username"
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Hasło</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit">Zaloguj się</Button>
              </form>
            </CardContent>
          </Card>
        )
      case 'register':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Rejestracja</CardTitle>
              <CardDescription>Stwórz nowe konto, aby dołączyć do naszej społeczności.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-username">Nazwa użytkownika</Label>
                  <Input
                    id="reg-username"
                    type="text"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Hasło</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit">Zarejestruj się</Button>
              </form>
            </CardContent>
          </Card>
        )
      case 'profile':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profil użytkownika</CardTitle>
              <CardDescription>Zarządzaj informacjami o swoim profilu</CardDescription>
            </CardHeader>
            <CardContent>
              {user && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={user.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`} />
                      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-bold">{user.username}</h3>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={user.bio}
                      onChange={handleBioChange}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Ulubione filmy</h4>
                    <ul className="list-disc list-inside">
                      {user.favoriteMovies.map((movie, index) => (
                        <li key={index}>{movie}</li>
                      ))}
                    </ul>
                  </div>
                  <Button onClick={() => setActiveTab('profile-setup')}>Edytuj profil</Button>
                </div>
              )}
            </CardContent>
          </Card>
        )
      case 'profile-setup':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Konfiguracja profilu</CardTitle>
              <CardDescription>Uzupełnij informacje o swoim profilu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user?.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${user?.username}`} />
                    <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                      <Camera className="w-4 h-4 mr-2" />
                      Zmień zdjęcie
                    </Button>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleProfilePictureUpload}
                    />
                  </div>
                </div>
                <form onSubmit={handleEmailChange} className="space-y-2">
                  <Label htmlFor="new-email">Zmień email</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="new-email"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Nowy adres email"
                    />
                    <Button type="submit">Aktualizuj email</Button>
                  </div>
                </form>
                <form onSubmit={handlePasswordChange} className="space-y-2">
                  <Label htmlFor="new-password">Zmień hasło</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nowe hasło"
                  />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Potwierdź nowe hasło"
                  />
                  <Button type="submit">Aktualizuj hasło</Button>
                </form>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={user?.bio}
                    onChange={handleBioChange}
                    placeholder="Opowiedz nam o sobie..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ulubione filmy (maksymalnie 5)</Label>
                  {favoriteMovies.map((movie, index) => (
                    <Input
                      key={index}
                      value={movie}
                      onChange={(e) => handleFavoriteMovieChange(index, e.target.value)}
                      placeholder={`Ulubiony film #${index + 1}`}
                    />
                  ))}
                </div>
                <Button onClick={handleProfileSetupComplete}>Zapisz profil</Button>
              </div>
            </CardContent>
          </Card>
        )
      case 'contact':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Kontakt</CardTitle>
              <CardDescription>Skontaktuj się z zespołem Cytaty z filmów</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Imię</Label>
                  <Input id="contact-name" type="text" placeholder="Twoje imię" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input id="contact-email" type="email" placeholder="Twój email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Wiadomość</Label>
                  <Textarea id="contact-message" placeholder="Twoja wiadomość" required />
                </div>
                <Button type="submit">Wyślij wiadomość</Button>
              </form>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow p-4">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">Cytaty z filmów</h1>
          <div className="flex space-x-4">
            <Button variant="ghost" onClick={() => setActiveTab('home')}>Strona główna</Button>
            <Button variant="ghost" onClick={() => setActiveTab('discussions')}>Forum</Button>
            <Button variant="ghost" onClick={() => setActiveTab('meme-generator')}>Generator memów</Button>
            <Button variant="ghost" onClick={() => setActiveTab('contact')}>Kontakt</Button>
            {isLoggedIn ? (
              <>
                <Button variant="ghost" onClick={() => setActiveTab('profile')}>Profil</Button>
                <Button variant="ghost" onClick={handleLogout}>Wyloguj</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setActiveTab('login')}>Zaloguj</Button>
                <Button variant="ghost" onClick={() => setActiveTab('register')}>Zarejestruj</Button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-grow p-4 max-w-6xl mx-auto w-full">
        {renderContent()}
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Cytaty z filmów</h2>
              <p className="text-sm">Twoja społeczność dla wszystkiego, co związane z kinem</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Szybkie linki</h3>
              <ul className="space-y-2">
                <li><a href="#" onClick={() => setActiveTab('home')} className="hover:text-gray-300">Strona główna</a></li>
                <li><a href="#" onClick={() => setActiveTab('discussions')} className="hover:text-gray-300">Forum</a></li>
                <li><a href="#" onClick={() => setActiveTab('meme-generator')} className="hover:text-gray-300">Generator memów</a></li>
                <li><a href="#" onClick={() => setActiveTab('meme-wall')} className="hover:text-gray-300">Ściana memów</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Informacje prawne</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300">Regulamin</a></li>
                <li><a href="#" className="hover:text-gray-300">Polityka prywatności</a></li>
                <li><a href="#" onClick={() => setActiveTab('contact')} className="hover:text-gray-300">Kontakt</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">YouTube</span>
              <Youtube className="h-6 w-6" />
            </a>
          </div>
          <div className="mt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} Cytaty z filmów. Wszelkie prawa zastrzeżone.
          </div>
        </div>
      </footer>
    </div>
  )
}

function DiscussionPreview({ title, author, replies, lastReply }: { title: string, author: string, replies: number, lastReply: string }) {
  return (
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${author}`} />
        <AvatarFallback>{author.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">autor: {author}</p>
      </div>
      <div className="text-right text-sm text-gray-500">
        <p>{replies} odpowiedzi</p>
        <p>Ostatnia odpowiedź {lastReply}</p>
      </div>
    </div>
  )
}