"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Share, Heart, Star, MapPin, Users, Wifi, Car, ChefHat } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
    createdAt: string
  }
  rating: number
  reviewCount: number
}

const amenityIcons = {
  Wifi: Wifi,
  Kitchen: ChefHat,
  Parking: Car,
  Gym: Users,
  Laundry: Users,
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    specialRequests: "",
  })
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    fetchProperty()
  }, [params.id])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setProperty(data.property)
      }
    } catch (error) {
      console.error("Error fetching property:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!user) {
      alert("Please login to make a booking")
      return
    }

    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert("Please select check-in and check-out dates")
      return
    }

    setBookingLoading(true)
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: params.id,
          ...bookingData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Booking created successfully!")
        // Reset form
        setBookingData({
          checkIn: "",
          checkOut: "",
          guests: 1,
          specialRequests: "",
        })
      } else {
        alert(data.error || "Booking failed")
      }
    } catch (error) {
      console.error("Booking error:", error)
      alert("Booking failed")
    } finally {
      setBookingLoading(false)
    }
  }

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0
    const checkIn = new Date(bookingData.checkIn)
    const checkOut = new Date(bookingData.checkOut)
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  }

  const calculateTotal = () => {
    if (!property) return 0
    const nights = calculateNights()
    const subtotal = nights * property.price
    const cleaningFee = 50
    const serviceFee = Math.round(subtotal * 0.1)
    return subtotal + cleaningFee + serviceFee
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading property...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Property not found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
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
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Link href="/" className="text-2xl font-bold text-primary">
                StayFinder
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Property Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
          <div className="flex items-center space-x-4 text-muted-foreground">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">{property.rating}</span>
              <span className="ml-1">({property.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {property.location.city}, {property.location.state}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-xl overflow-hidden">
          <div className="md:col-span-2 md:row-span-2">
            <Image
              src={property.images[0] || "/placeholder.svg?height=400&width=600"}
              alt={property.title}
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
          {property.images.slice(1, 5).map((image, index) => (
            <div key={index} className="aspect-square">
              <Image
                src={image || "/placeholder.svg?height=300&width=400"}
                alt={`${property.title} ${index + 2}`}
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {property.type} hosted by {property.host.firstName} {property.host.lastName}
                  </h2>
                  <div className="flex items-center space-x-4 text-muted-foreground mt-1">
                    <span>{property.guests} guests</span>
                    <span>•</span>
                    <span>{property.bedrooms} bedrooms</span>
                    <span>•</span>
                    <span>{property.bathrooms} bathrooms</span>
                  </div>
                </div>
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={property.host.avatar || "/placeholder.svg"}
                    alt={`${property.host.firstName} ${property.host.lastName}`}
                  />
                  <AvatarFallback>
                    {property.host.firstName[0]}
                    {property.host.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Separator />
            </div>

            {/* Description */}
            <div>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity) => {
                  const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons] || Wifi
                  return (
                    <div key={amenity} className="flex items-center space-x-3">
                      <IconComponent className="h-5 w-5" />
                      <span>{amenity}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Host Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Meet your host</h3>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={property.host.avatar || "/placeholder.svg"}
                    alt={`${property.host.firstName} ${property.host.lastName}`}
                  />
                  <AvatarFallback>
                    {property.host.firstName[0]}
                    {property.host.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-lg">
                    {property.host.firstName} {property.host.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Joined {new Date(property.host.createdAt).getFullYear()}
                  </div>
                  <Badge variant="secondary" className="mt-1">
                    Superhost
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    <span className="text-2xl font-bold">${property.price}</span>
                    <span className="text-muted-foreground"> / night</span>
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{property.rating}</span>
                    <span className="text-muted-foreground">({property.reviewCount})</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="checkIn">Check-in</Label>
                    <Input
                      id="checkIn"
                      type="date"
                      value={bookingData.checkIn}
                      onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkOut">Check-out</Label>
                    <Input
                      id="checkOut"
                      type="date"
                      value={bookingData.checkOut}
                      onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests">Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max={property.guests}
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({ ...bookingData, guests: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Any special requests or notes..."
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  />
                </div>

                <Button className="w-full" size="lg" onClick={handleBooking} disabled={bookingLoading || !user}>
                  {bookingLoading ? "Booking..." : user ? "Reserve" : "Login to Book"}
                </Button>

                {!user && (
                  <p className="text-center text-sm text-muted-foreground">
                    <Link href="/login" className="text-primary hover:underline">
                      Login
                    </Link>{" "}
                    to make a booking
                  </p>
                )}

                {bookingData.checkIn && bookingData.checkOut && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        ${property.price} × {calculateNights()} nights
                      </span>
                      <span>${property.price * calculateNights()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cleaning fee</span>
                      <span>$50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service fee</span>
                      <span>${Math.round(property.price * calculateNights() * 0.1)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${calculateTotal()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
