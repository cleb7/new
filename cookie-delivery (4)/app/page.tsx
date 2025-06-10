"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  MapPin,
  Search,
  DollarSign,
  ChevronDown,
  Clock,
  ShoppingCart,
  Plus,
  Minus,
  X,
  User,
  CreditCard,
} from "lucide-react"
import { Label } from "@/components/ui/label"

interface LocationData {
  city: string
  state: string
  country: string
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  weight?: string
}

interface CartItem extends Product {
  quantity: number
}

interface CustomerData {
  name: string
  cpf: string
  cep: string
  street: string
  number: string
  complement?: string
}

const statesAndCities = {
  SC: ["Blumenau", "Florianópolis", "Joinville", "Chapecó", "Criciúma", "Itajaí", "Lages", "Balneário Camboriú"],
  SP: ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba", "São José dos Campos", "Guarulhos", "Osasco"],
  RJ: [
    "Rio de Janeiro",
    "Niterói",
    "Petrópolis",
    "Nova Iguaçu",
    "Duque de Caxias",
    "São Gonçalo",
    "Volta Redonda",
    "Campos dos Goytacazes",
  ],
  MG: [
    "Belo Horizonte",
    "Uberlândia",
    "Contagem",
    "Juiz de Fora",
    "Betim",
    "Montes Claros",
    "Ribeirão das Neves",
    "Uberaba",
  ],
  PR: [
    "Curitiba",
    "Londrina",
    "Maringá",
    "Ponta Grossa",
    "Cascavel",
    "São José dos Pinhais",
    "Foz do Iguaçu",
    "Colombo",
  ],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo"],
  BA: [
    "Salvador",
    "Feira de Santana",
    "Vitória da Conquista",
    "Camaçari",
    "Itabuna",
    "Juazeiro",
    "Lauro de Freitas",
    "Ilhéus",
  ],
  GO: [
    "Goiânia",
    "Aparecida de Goiânia",
    "Anápolis",
    "Rio Verde",
    "Luziânia",
    "Águas Lindas de Goiás",
    "Valparaíso de Goiás",
    "Trindade",
  ],
}

const products: Product[] = [
  // BOX Especiais
  {
    id: 1,
    name: "BOX I LOVE YOU",
    description: "Linda Caixa Cartonada contendo 3 Cookies Personalizados de 160g cada com corações 'I LOVE YOU'",
    price: 110.0,
    image: "/images/products/1-box-i-love-you.jpg",
    category: "Boxes",
    weight: "3x160g",
  },
  {
    id: 2,
    name: "Pink Box [ Caixa c/ 6 Cookies 160g ]",
    description: "A Caixa Viral do Tiktok! 6 Cookies Grandes de 160g em linda caixa Rosa com Seda Personalizada",
    price: 120.0,
    image: "/images/products/2-pink-box.jpg",
    category: "Boxes",
    weight: "6x160g",
  },

  // Combos
  {
    id: 3,
    name: "Combo [ 3 Cookies Grandes 150g ]",
    description: "3 deliciosos Cookies de sua escolha, por um valor Promocional",
    price: 54.9,
    originalPrice: 56.7,
    image: "/images/products/3-combo-3-cookies.jpg",
    category: "Combos",
    weight: "3x150g",
  },
  {
    id: 4,
    name: "Combo Double [ 2 Cookies + 2 Bebidas ]",
    description: "2 Deliciosos Cookies Grandes 150g + 2 Bebidas de sua escolha por valor Promocional",
    price: 45.9,
    originalPrice: 47.8,
    image: "/images/products/4-combo-double.jpg",
    category: "Combos",
    weight: "2x150g",
  },

  // New York Cookies
  {
    id: 5,
    name: "Cookie NY Oreo's Cream",
    description: "Cookie Extremamente Gigante com dois Cremes Deliciosos e bolacha Oreo. Surpreendente!",
    price: 24.9,
    image: "/images/products/5-cookie-ny-oreo.jpg",
    category: "New York",
    weight: "215g",
  },

  // Crookies
  {
    id: 6,
    name: "Crookie Lótus Biscoff",
    description: "Diretamente de Paris! Croissant com Cookie, recheado com Creme Lótus Biscoff e Doce de Leite",
    price: 29.9,
    image: "/images/products/6-crookie-lotus.jpg",
    category: "Crookies",
  },
  {
    id: 7,
    name: "Crookie Morantella",
    description: "Crookie com recheio de Nutella com Morango e cobertura de Nutella, Ninho e Morangos",
    price: 29.9,
    image: "/images/products/7-crookie-morantella.jpg",
    category: "Crookies",
  },
  {
    id: 8,
    name: "Crookie Ninho c/ Nutella",
    description: "Diretamente de Paris! Croissant com Cookie, recheio de Ninho e Nutella com fios de Nutella",
    price: 29.9,
    image: "/images/products/8-crookie-ninho.jpg",
    category: "Crookies",
  },

  // Premium Cookies
  {
    id: 9,
    name: "Cookie Rafaello",
    description: "Massa de Coco com Creme Coco Bianco, Rafaello e cobertura de Chocolate Branco e Amêndoas",
    price: 20.9,
    image: "/images/products/9-cookie-rafaello.jpg",
    category: "Premium",
    weight: "150g",
  },
  {
    id: 10,
    name: "Cookie Ferrero",
    description: "Massa de Chocolate 50% com Nutella, Ferrero Rocher e cobertura com Amendoim",
    price: 20.9,
    image: "/images/products/10-cookie-ferrero.jpg",
    category: "Premium",
    weight: "150g",
  },
  {
    id: 11,
    name: "Cookie Ruby",
    description: "Massa Red Velvet com Creme de 4 Leites, Geléia de Frutas Vermelhas e Chocolate Branco",
    price: 20.9,
    image: "/images/products/11-cookie-ruby.jpg",
    category: "Premium",
    weight: "150g",
  },
  {
    id: 12,
    name: "Cookie Supreme Kinder",
    description: "Massa Tradicional com Gotas de Chocolate, Creme de Kinder Bueno e finalizado com Kinder",
    price: 24.9,
    image: "/images/products/12-cookie-supreme-kinder.jpg",
    category: "Premium",
  },
  {
    id: 13,
    name: "Cookie Nutininho",
    description: "Cookie Tradicional de Nutella com cobertura de Creme de Leite Ninho Polvilhado",
    price: 20.9,
    image: "/images/products/13-cookie-nutininho.jpg",
    category: "Premium",
    weight: "180g",
  },
  {
    id: 14,
    name: "Cookie Lótus Biscoff",
    description: "Massa com pedacinhos de Biscoito Lótus e Canela com Recheio de Doce de Leite Artesanal",
    price: 20.9,
    image: "/images/products/14-cookie-lotus-biscoff.jpg",
    category: "Premium",
    weight: "150g",
  },
  {
    id: 15,
    name: "Cookie Alpino",
    description: "Massa dark com pedacinhos de Alpino e recheio com bombom Alpino. A melhor combinação!",
    price: 19.9,
    image: "/images/products/15-cookie-alpino.jpg",
    category: "Premium",
    weight: "150g",
  },
  {
    id: 16,
    name: "Cookie Milka",
    description: "Massa Tradicional, Recheio de Creme de Bombom e pedaços de Milka dentro e fora",
    price: 20.9,
    image: "/images/products/16-cookie-milka.jpg",
    category: "Premium",
    weight: "150g",
  },
  {
    id: 17,
    name: "Cookie Brûlée",
    description: "Massa branca com Baunilha, Recheio de Creme Brûlée Finalizado com Creme Flambado",
    price: 19.9,
    image: "/images/products/17-cookie-brulee.jpg",
    category: "Premium",
    weight: "165g",
  },
  {
    id: 18,
    name: "Cookie Pistache",
    description: "Massa com Gotas de Chocolate Branco, Creme de Pistache e cobertura de Pistache",
    price: 21.9,
    image: "/images/products/18-cookie-pistache.jpg",
    category: "Premium",
    weight: "140g",
  },
  {
    id: 19,
    name: "Cookie Red Milka",
    description: "Red Velvet com Chocolate Branco e Meio Amargo, pedaços de Oreo e Milka Oreo",
    price: 20.9,
    image: "/images/products/19-cookie-red-milka.jpg",
    category: "Premium",
    weight: "150g",
  },

  // Especiais
  {
    id: 20,
    name: "Cookie Nesquik",
    description: "Massa deliciosa de nesquik com sabor de infância e recheio de chocolate branco cremoso",
    price: 19.9,
    image: "/images/products/20-cookie-nesquik.jpg",
    category: "Especiais",
    weight: "150g",
  },
  {
    id: 21,
    name: "Cookie Oreo White",
    description: "Massa Branca com pedaços de Oreo, Gotas de Chocolate Branco e recheio com Bombom Oreo",
    price: 18.9,
    image: "/images/products/21-cookie-oreo-white.jpg",
    category: "Especiais",
  },
  {
    id: 22,
    name: "Cookie Sonho de Valsa",
    description: "Massa de Chocolate com gotas de Chocolate Nobre Preto e recheio cremoso com bombom",
    price: 18.9,
    image: "/images/products/22-cookie-sonho-valsa.jpg",
    category: "Especiais",
  },
  {
    id: 23,
    name: "Cookie Duo",
    description: "Massa 1/2 Tradicional, 1/2 Dark com recheio de Nutella e Ninho. Perfeito para NuteLovers!",
    price: 19.9,
    image: "/images/products/23-cookie-duo.jpg",
    category: "Especiais",
    weight: "150g",
  },
  {
    id: 24,
    name: "Cookie M&M's",
    description: "Saborosa Massa Tradicional com M&M's e Recheio de Nutella",
    price: 19.9,
    image: "/images/products/24-cookie-mms.jpg",
    category: "Especiais",
    weight: "140g",
  },
  {
    id: 25,
    name: "Cookie Choco Dark",
    description: "Massa Intensa de Cacau Black com recheio de Creme de Bombom e Chocolate Meio Amargo",
    price: 18.9,
    image: "/images/products/25-cookie-choco-dark.jpg",
    category: "Especiais",
    weight: "150g",
  },
  {
    id: 26,
    name: "Cookie S'more's",
    description: "Massa com gotas de Chocolate recheado com Hershey's 40% e Marshmallow com base Salt",
    price: 18.9,
    image: "/images/products/26-cookie-smores.jpg",
    category: "Especiais",
    weight: "140g",
  },
  {
    id: 27,
    name: "Cookie Tropical Orange",
    description: "Massa Laranja com Chocolate Branco, recheio de Chocolate Branco e Laranja com raspas",
    price: 18.9,
    image: "/images/products/27-cookie-tropical-orange.jpg",
    category: "Especiais",
    weight: "150g",
  },
  {
    id: 28,
    name: "Cookie Galak",
    description: "Massa Branca com Gotas de Chocolate Nobre Branco e recheio de Galak",
    price: 19.9,
    image: "/images/products/28-cookie-galak.jpg",
    category: "Especiais",
    weight: "150g",
  },
  {
    id: 29,
    name: "Cookie Ouro Branco",
    description: "Massa branca com gotas de Chocolate Nobre Branco e recheio especial de Ouro Branco",
    price: 18.9,
    image: "/images/products/29-cookie-ouro-branco.jpg",
    category: "Especiais",
    weight: "150g",
  },
  {
    id: 30,
    name: "Cookie Churros",
    description: "Massa com toque de Canela, recheio de Doce de Leite, fios de Doce de Leite e Açúcar Crystal",
    price: 18.9,
    image: "/images/products/30-cookie-churros.jpg",
    category: "Especiais",
    weight: "140g",
  },

  // Classic Cookies
  {
    id: 31,
    name: "Cookie Cappuccino",
    description: "Massa Amanteigada Sabor Cappuccino, com gotas de Chocolate Preto e Branco",
    price: 17.9,
    image: "/images/products/31-cookie-cappuccino.jpg",
    category: "Tradicionais",
    weight: "140g",
  },
  {
    id: 32,
    name: "Cookie Choco Chips",
    description: "Deliciosa Massa Amanteigada Tradicional, com Muuuuuuitas Gotas de Chocolate",
    price: 17.9,
    image: "/images/products/32-cookie-choco-chips.jpg",
    category: "Tradicionais",
    weight: "140g",
  },
  {
    id: 33,
    name: "Cookie Chocolate Hazelnut",
    description: "Massa de Cacau 50% com pedacinhos de Chocolate Meio Amargo e Avelãs Tostadas",
    price: 18.9,
    image: "/images/products/33-cookie-chocolate-hazelnut.jpg",
    category: "Tradicionais",
    weight: "150g",
  },
  {
    id: 34,
    name: "Cookie Paçoquinha",
    description: "Massa Tradicional com farelos de Paçoca e Gotas de Chocolate",
    price: 17.9,
    image: "/images/products/34-cookie-pacoquinha.jpg",
    category: "Tradicionais",
    weight: "140g",
  },
  {
    id: 35,
    name: "Cookie Two Lemons",
    description: "Massa com blend de Limão Siciliano e Limão-Taiti e gotas de Chocolate Nobre Branco",
    price: 17.9,
    image: "/images/products/35-cookie-two-lemons.jpg",
    category: "Tradicionais",
    weight: "140g",
  },

  // Bebidas
  {
    id: 36,
    name: "Coca-Cola lata 350ml",
    description: "Refrigerante Coca-Cola gelado",
    price: 6.0,
    image: "/images/products/36-coca-cola.jpg",
    category: "Bebidas",
    weight: "350ml",
  },
  {
    id: 37,
    name: "Guaraná Lata 350ml",
    description: "Refrigerante Guaraná gelado",
    price: 6.0,
    image: "/images/products/37-guarana.jpg",
    category: "Bebidas",
    weight: "350ml",
  },
  {
    id: 38,
    name: "Água com gás",
    description: "Água mineral com gás gelada",
    price: 5.0,
    image: "/images/products/38-agua-com-gas.jpg",
    category: "Bebidas",
    weight: "500ml",
  },
  {
    id: 39,
    name: "Água sem gás",
    description: "Água mineral natural gelada",
    price: 5.0,
    image: "/images/products/39-agua-sem-gas.jpg",
    category: "Bebidas",
    weight: "500ml",
  },

  // Extras
  {
    id: 40,
    name: "Cartãozinho Happy Birthday",
    description: "Lindo Cartãozinho de Feliz Aniversário com Mensagem Curta personalizada",
    price: 1.5,
    image: "/images/products/40-cartao-birthday.jpg",
    category: "Extras",
  },
  {
    id: 41,
    name: "Cartãozinho Para Adoçar Seu Dia!",
    description: "Lindo Cartãozinho com a Mensagem: 'Para Adoçar Seu Dia' com sua mensagem atrás",
    price: 1.5,
    image: "/images/products/41-cartao-adocar.jpg",
    category: "Extras",
  },
]

export default function CookieDelivery() {
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [userLocation, setUserLocation] = useState<LocationData | null>(null)
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [showLocationSelector, setShowLocationSelector] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    cpf: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
  })
  const [showPixModal, setShowPixModal] = useState(false)
  const [pixData, setPixData] = useState<any>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Simular detecção de localização
  useEffect(() => {
    const timer = setTimeout(() => {
      setUserLocation({
        city: "Blumenau",
        state: "SC",
        country: "Brasil",
      })
      setShowLocationModal(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Verificar se está aberto (10:00 às 23:00)
  useEffect(() => {
    const checkIfOpen = () => {
      const now = new Date()
      const currentHour = now.getHours()
      setIsOpen(currentHour >= 10 && currentHour < 23)
    }

    checkIfOpen()
    const interval = setInterval(checkIfOpen, 60000)

    return () => clearInterval(interval)
  }, [])

  const confirmLocation = () => {
    setShowLocationModal(false)
    // Garantir que apenas a cidade seja usada no cabeçalho
    if (userLocation) {
      setUserLocation({
        ...userLocation,
        city: userLocation.city,
      })
    }
  }

  const changeLocation = () => {
    setShowLocationSelector(true)
    setSelectedState("")
    setSelectedCity("")
  }

  const confirmNewLocation = () => {
    if (selectedState && selectedCity) {
      setUserLocation({
        city: selectedCity,
        state: selectedState,
        country: "Brasil",
      })
      setShowLocationModal(false)
      setShowLocationSelector(false)
    } else {
      alert("Por favor, selecione um estado e uma cidade")
    }
  }

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id))
    } else {
      setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCheckout = () => {
    setShowCart(false)
    setShowCheckout(true)
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{5})(\d{3})/, "$1-$2")
  }

  const processPayment = async () => {
    if (!customerData.name || !customerData.cpf || !customerData.cep || !customerData.street || !customerData.number) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setIsProcessingPayment(true)

    try {
      const response = await fetch("/api/pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cpf: customerData.cpf.replace(/\D/g, ""),
          valor: getTotalPrice(),
          nome: customerData.name,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setPixData(result)
        setShowCheckout(false)
        setShowPixModal(true)
      } else {
        alert("Erro ao processar pagamento: " + result.error)
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Location Confirmation Modal */}
      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-500" />
              {showLocationSelector ? "Selecione sua localização" : "Confirme sua localização"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!showLocationSelector ? (
              <>
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Detectamos que você está em:</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-lg">
                      {userLocation?.city}, {userLocation?.state}
                    </p>
                    <p className="text-sm text-gray-500">{userLocation?.country}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={confirmLocation} className="flex-1 bg-pink-500 hover:bg-pink-600">
                    Confirmar localização
                  </Button>
                  <Button onClick={changeLocation} variant="outline" className="flex-1">
                    Alterar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <select
                      id="state"
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value)
                        setSelectedCity("")
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Selecione um estado</option>
                      {Object.keys(statesAndCities).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedState && (
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <select
                        id="city"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      >
                        <option value="">Selecione uma cidade</option>
                        {statesAndCities[selectedState as keyof typeof statesAndCities]?.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={confirmNewLocation}
                    className="flex-1 bg-pink-500 hover:bg-pink-600"
                    disabled={!selectedState || !selectedCity}
                  >
                    Confirmar
                  </Button>
                  <Button onClick={() => setShowLocationSelector(false)} variant="outline" className="flex-1">
                    Voltar
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cart Modal */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-pink-500" />
              Seu Carrinho ({getTotalItems()} {getTotalItems() === 1 ? "item" : "itens"})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Seu carrinho está vazio</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                      <div className="text-2xl">🍪</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-pink-600 font-semibold">R$ {item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 p-0 text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg text-pink-600">R$ {getTotalPrice().toFixed(2)}</span>
                  </div>
                  <Button onClick={handleCheckout} className="w-full bg-pink-500 hover:bg-pink-600">
                    Finalizar Pedido
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-pink-500" />
              Dados para Entrega
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={customerData.cpf}
                  onChange={(e) => setCustomerData({ ...customerData, cpf: formatCPF(e.target.value) })}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  value={customerData.cep}
                  onChange={(e) => setCustomerData({ ...customerData, cep: formatCEP(e.target.value) })}
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>
              <div>
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  value={customerData.number}
                  onChange={(e) => setCustomerData({ ...customerData, number: e.target.value })}
                  placeholder="123"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="street">Rua/Endereço *</Label>
              <Input
                id="street"
                value={customerData.street}
                onChange={(e) => setCustomerData({ ...customerData, street: e.target.value })}
                placeholder="Nome da rua"
              />
            </div>
            <div>
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={customerData.complement}
                onChange={(e) => setCustomerData({ ...customerData, complement: e.target.value })}
                placeholder="Apartamento, bloco, etc. (opcional)"
              />
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total do Pedido:</span>
                <span className="font-bold text-lg text-pink-600">R$ {getTotalPrice().toFixed(2)}</span>
              </div>
              <Button
                onClick={processPayment}
                disabled={isProcessingPayment}
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                {isProcessingPayment ? "Processando..." : "Finalizar Pedido"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PIX Payment Modal */}
      <Dialog open={showPixModal} onOpenChange={setShowPixModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-pink-500" />
              Pagamento PIX
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-gray-600">Escaneie o QR Code abaixo para pagar:</p>
            {pixData?.qrcode_image && (
              <div className="flex justify-center">
                <img src={pixData.qrcode_image || "/placeholder.svg"} alt="QR Code PIX" className="w-64 h-64" />
              </div>
            )}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Código PIX:</p>
              <p className="text-xs font-mono break-all bg-white p-2 rounded border">{pixData?.qrcode_text}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg text-pink-600">R$ {getTotalPrice().toFixed(2)}</p>
              <p className="text-sm text-gray-500">Aguardando pagamento...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-4xl mx-auto">
        {/* Header Rosa */}
        <header className="bg-gradient-to-r from-pink-400 to-pink-600 text-white p-6 shadow-lg">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center relative overflow-hidden shadow-lg">
              <div className="absolute inset-2 bg-amber-600 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-amber-800 rounded-full absolute top-2 left-3"></div>
                <div className="w-2 h-2 bg-amber-800 rounded-full absolute top-4 right-2"></div>
                <div className="w-2 h-2 bg-amber-800 rounded-full absolute bottom-3 left-2"></div>
                <div className="w-3 h-3 bg-amber-800 rounded-full absolute bottom-2 right-3"></div>
                <div className="w-1 h-1 bg-white rounded-full absolute top-3 right-4"></div>
              </div>
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="text-pink-500 text-xs">♥</div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-pink-500 text-white text-xs font-bold text-center py-1 rounded-b-full">
                Cookie pink
              </div>
            </div>

            {/* Business Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold">Cookie Pink</h1>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className={`${isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {isOpen ? "Aberto" : "Fechado"}
                  </Badge>
                  <Button variant="link" className="text-white p-0 h-auto hover:text-pink-100">
                    <span className="flex items-center gap-1">
                      Ver horários
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-pink-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{userLocation?.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">Pedido mínimo R$35,00</span>
                </div>
                {!isOpen && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Abre às 10:00</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400 w-5 h-5" />
            <Input
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 text-base border-gray-200 focus:border-pink-400 focus:ring-pink-400 rounded-full"
            />
          </div>
        </div>

        {/* Categories Header */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Categorias</h2>
            <Button variant="link" className="text-pink-500 p-0 h-auto">
              Ver todas →
            </Button>
          </div>
        </div>

        {/* Products */}
        <div className="px-6 pb-8">
          {/* ESPECIAL DIA DOS NAMORADOS */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold uppercase mb-4">ESPECIAL DIA DOS NAMORADOS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts
                .filter((p) => p.category === "Boxes")
                .map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{product.name}</h3>
                        {product.weight && <span className="text-xs text-gray-500">{product.weight}</span>}
                      </div>
                      <div className="flex">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center mr-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-pink-600 font-semibold text-lg">R$ {product.price.toFixed(2)}</p>
                            {product.originalPrice && (
                              <p className="text-xs text-gray-400 line-through">
                                R$ {product.originalPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-3 mb-2">{product.description}</p>
                          <Button
                            onClick={() => addToCart(product)}
                            size="sm"
                            className="bg-pink-500 hover:bg-pink-600"
                          >
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Que tal um Bilhetinho? (Presente) */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Que tal um Bilhetinho? (Presente)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts
                .filter((p) => p.category === "Extras")
                .map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{product.name}</h3>
                      </div>
                      <div className="flex">
                        <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex items-center justify-center mr-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-pink-600 font-semibold text-lg">R$ {product.price.toFixed(2)}</p>
                            <div className="flex gap-1">
                              <Badge className="bg-pink-100 text-pink-600 text-xs">FRENTE</Badge>
                              <Badge className="bg-pink-100 text-pink-600 text-xs">VERSO</Badge>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-3 mb-2">{product.description}</p>
                          <Button
                            onClick={() => addToCart(product)}
                            size="sm"
                            className="bg-pink-500 hover:bg-pink-600"
                          >
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Combos */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Combos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts
                .filter((p) => p.category === "Combos")
                .map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{product.name}</h3>
                        {product.weight && <span className="text-xs text-gray-500">{product.weight}</span>}
                      </div>
                      <div className="flex">
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center mr-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-pink-600 font-semibold text-lg">R$ {product.price.toFixed(2)}</p>
                            {product.originalPrice && (
                              <p className="text-xs text-gray-400 line-through">
                                R$ {product.originalPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-3 mb-2">{product.description}</p>
                          <Button
                            onClick={() => addToCart(product)}
                            size="sm"
                            className="bg-pink-500 hover:bg-pink-600"
                          >
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* New York Cookies */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">New York Cookies ( 200 a 240g )</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts
                .filter((p) => p.category === "New York")
                .map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{product.name}</h3>
                        {product.weight && <span className="text-xs text-gray-500">{product.weight}</span>}
                      </div>
                      <div className="flex">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-pink-600 font-semibold text-lg mb-1">R$ {product.price.toFixed(2)}</p>
                          <p className="text-xs text-gray-600 line-clamp-3 mb-2">{product.description}</p>
                          <Button
                            onClick={() => addToCart(product)}
                            size="sm"
                            className="bg-pink-500 hover:bg-pink-600"
                          >
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Crookies */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Crookies [ Croissant + Cookie ]</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts
                .filter((p) => p.category === "Crookies")
                .map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{product.name}</h3>
                      </div>
                      <div className="flex">
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center mr-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-pink-600 font-semibold text-lg mb-1">R$ {product.price.toFixed(2)}</p>
                          <p className="text-xs text-gray-600 line-clamp-3 mb-2">{product.description}</p>
                          <Button
                            onClick={() => addToCart(product)}
                            size="sm"
                            className="bg-pink-500 hover:bg-pink-600"
                          >
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Cookies Premium */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Cookies Premium ( 135g a 150g )</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts
                .filter((p) => p.category === "Premium")
                .map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{product.name}</h3>
                        {product.weight && <span className="text-xs text-gray-500">{product.weight}</span>}
                      </div>
                      <div className="flex">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mr-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-pink-600 font-semibold text-lg mb-1">R$ {product.price.toFixed(2)}</p>
                          <p className="text-xs text-gray-600 line-clamp-3 mb-2">{product.description}</p>
                          <Button
                            onClick={() => addToCart(product)}
                            size="sm"
                            className="bg-pink-500 hover:bg-pink-600"
                          >
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Cookies Especiais */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Cookies Especiais ( 135 a 150g )</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts
                .filter((p) => p.category === "Especiais")
                .map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{product.name}</h3>
                        {product.weight && <span className="text-xs text-gray-500">{product.weight}</span>}
                      </div>
                      <div className="flex">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mr-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-pink-600 font-semibold text-lg mb-1">R$ {product.price.toFixed(2)}</p>
                          <p className="text-xs text-gray-600 line-clamp-3 mb-2">{product.description}</p>
                          <Button
                            onClick={() => addToCart(product)}
                            size="sm"
                            className="bg-pink-500 hover:bg-pink-600"
                          >
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Classic Cookies */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Classic Cookies [ Aprox. 140g. ]</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts
                .filter((p) => p.category === "Tradicionais")
                .map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{product.name}</h3>
                        {product.weight && <span className="text-xs text-gray-500">{product.weight}</span>}
                      </div>
                      <div className="flex">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center mr-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-pink-600 font-semibold text-lg mb-1">R$ {product.price.toFixed(2)}</p>
                          <p className="text-xs text-gray-600 line-clamp-3 mb-2">{product.description}</p>
                          <Button
                            onClick={() => addToCart(product)}
                            size="sm"
                            className="bg-pink-500 hover:bg-pink-600"
                          >
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Bebidas */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Bebidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts
                .filter((p) => p.category === "Bebidas")
                .map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{product.name}</h3>
                        {product.weight && <span className="text-xs text-gray-500">{product.weight}</span>}
                      </div>
                      <div className="flex">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-pink-600 font-semibold text-lg mb-1">R$ {product.price.toFixed(2)}</p>
                          <p className="text-xs text-gray-600 line-clamp-3 mb-2">{product.description}</p>
                          <Button
                            onClick={() => addToCart(product)}
                            size="sm"
                            className="bg-pink-500 hover:bg-pink-600"
                          >
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>

        {/* Operating Hours Info */}
        {!isOpen && (
          <div className="mx-6 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <Clock className="w-5 h-5" />
              <div>
                <p className="font-medium">Estamos fechados no momento</p>
                <p className="text-sm">Horário de funcionamento: 10:00 às 23:00</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowCart(true)}
            className="bg-pink-500 hover:bg-pink-600 rounded-full w-16 h-16 shadow-lg relative"
          >
            <ShoppingCart className="w-6 h-6" />
            <Badge className="absolute -top-2 -right-2 w-6 h-6 p-0 flex items-center justify-center bg-red-500">
              {getTotalItems()}
            </Badge>
          </Button>
        </div>
      )}
    </div>
  )
}
