"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MapPin, Star, Heart, Users, Bed, Bath, Wifi, Car, ChefHat, Waves } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/useAuth"

interface Property {
  _id: string
  title: string
  description: string
  type: string
  location: {
    address: string
    city: string
    state: string
    country: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  price: number
  guests: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
  images: string[]
  host: {
    _id: string
    firstName: string
    lastName: string
    avatar?: string
  }
  rating: number
  reviewCount: number
}

const amenityIcons = {
  Wifi: Wifi,
  Kitchen: ChefHat,
  Parking: Car,
  "Beach Access": Waves,
  Pool: Waves,
  Chef: ChefHat,
  "Mountain View": MapPin,
  Fireplace: MapPin,
  Historic: MapPin,
  Gym: Users,
  Laundry: Users,
  BBQ: ChefHat,
  "Hot Tub": Waves,
}

export default function HomePage() {
  const { user, logout } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState({
    city: "",
    type: "",
    minPrice: "",
    maxPrice: "",
    guests: "",
    amenities: "",
  })

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const queryParams = new URLSearchParams()
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })

      const response = await fetch(`/api/properties?${queryParams}`)
      const data = await response.json()

      if (response.ok) {
        setProperties(data.properties)
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchProperties()
  }

  const handleLogout = async () => {
    await logout()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              StayFinder
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2 border shadow-sm">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Where are you going?"
                  className="border-0 bg-transparent focus-visible:ring-0 w-48"
                  value={searchParams.city}
                  onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
                />
                <Separator orientation="vertical" className="h-6" />
                <Input placeholder="Check in" className="border-0 bg-transparent focus-visible:ring-0 w-32" />
                <Separator orientation="vertical" className="h-6" />
                <Input placeholder="Check out" className="border-0 bg-transparent focus-visible:ring-0 w-32" />
                <Separator orientation="vertical" className="h-6" />
                <Input
                  placeholder="Guests"
                  className="border-0 bg-transparent focus-visible:ring-0 w-24"
                  value={searchParams.guests}
                  onChange={(e) => setSearchParams({ ...searchParams, guests: e.target.value })}
                />
              </div>
              <Button size="sm" className="rounded-full" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Hello, {user.firstName}</span>
                  <Button variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden p-4 bg-white border-b">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Where are you going?"
            className="flex-1"
            value={searchParams.city}
            onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
          />
          <Button size="sm" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    <div>
                      <h3 className="font-semibold mb-3">Price Range</h3>
                      <div className="space-y-2">
                        <Input
                          placeholder="Min price"
                          value={searchParams.minPrice}
                          onChange={(e) => setSearchParams({ ...searchParams, minPrice: e.target.value })}
                        />
                        <Input
                          placeholder="Max price"
                          value={searchParams.maxPrice}
                          onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Property Type</h3>
                      <Select
                        value={searchParams.type}
                        onValueChange={(value) => setSearchParams({ ...searchParams, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="House">House</SelectItem>
                          <SelectItem value="Villa">Villa</SelectItem>
                          <SelectItem value="Cabin">Cabin</SelectItem>
                          <SelectItem value="Studio">Studio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={handleSearch} className="w-full">
                      Apply Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">{properties.length} properties found</div>
          </div>
        </div>
      </div>

      {/* Property Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <Link key={property._id} href={`/property/${property._id}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={property.images[0] || "/placeholder.svg?height=300&width=400"}
                    alt={property.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button variant="ghost" size="sm" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Badge className="absolute top-2 left-2 bg-white text-black">{property.type}</Badge>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{property.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {property.location.city}, {property.location.state}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {property.guests}
                    </div>
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      {property.bedrooms}
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {property.bathrooms}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    {property.amenities.slice(0, 3).map((amenity) => {
                      const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons] || MapPin
                      return (
                        <div key={amenity} className="flex items-center text-xs text-muted-foreground">
                          <IconComponent className="h-3 w-3 mr-1" />
                          {amenity}
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold">${property.price}</span>
                      <span className="text-muted-foreground"> / night</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{property.reviewCount} reviews</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No properties found. Try adjusting your search criteria.</p>
          </div>
        )}
      </main>
    </div>
  )
}
