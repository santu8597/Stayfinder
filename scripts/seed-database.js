import mongoose,{Schema} from "mongoose"
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://santup205:pvCjKk7jZEyxnEGp@restraunt.eqk7p.mongodb.net/stayfinder"

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
    },
    isHost: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)
const PropertySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Property description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    type: {
      type: String,
      required: [true, "Property type is required"],
      enum: ["Apartment", "House", "Villa", "Cabin", "Studio", "Townhouse"],
    },
    location: {
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
      },
      zipCode: {
        type: String,
        required: [true, "Zip code is required"],
      },
      coordinates: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "Must accommodate at least 1 guest"],
    },
    bedrooms: {
      type: Number,
      required: [true, "Number of bedrooms is required"],
      min: [0, "Bedrooms cannot be negative"],
    },
    bathrooms: {
      type: Number,
      required: [true, "Number of bathrooms is required"],
      min: [0, "Bathrooms cannot be negative"],
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
        required: true,
      },
    ],
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, "Review count cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
)
const User = mongoose.models.User || mongoose.model("User", UserSchema)
const Property = mongoose.models.Property || mongoose.model("Property", PropertySchema)
const sampleUsers = [
  {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah@example.com",
    password: "password123",
    isHost: true,
    isVerified: true,
  },
  {
    firstName: "Mike",
    lastName: "Chen",
    email: "mike@example.com",
    password: "password123",
    isHost: true,
    isVerified: true,
  },
  {
    firstName: "Emma",
    lastName: "Wilson",
    email: "emma@example.com",
    password: "password123",
    isHost: false,
    isVerified: true,
  },
]

const sampleProperties = [
  {
    title: "Modern Downtown Loft",
    description:
      "Experience the heart of the city in this stunning modern loft. Located in downtown with easy access to restaurants, shopping, and entertainment. The space features floor-to-ceiling windows, exposed brick walls, and contemporary furnishings throughout.",
    type: "Apartment",
    location: {
      address: "123 Main St",
      city: "New York",
      state: "NY",
      country: "USA",
      zipCode: "10001",
      coordinates: {
        lat: 40.7128,
        lng: -74.006,
      },
    },
    price: 150,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["Wifi", "Kitchen", "Parking", "Gym", "Laundry"],
    images: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/607574071.jpg?k=b529f3b53ff7fe31fc34dcfb1d4e55da137487ef0c50d3464f1196fbb62a54b7&o=&hp=1","https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc=","https://assets.simplotel.com/simplotel/image/upload/w_5000,h_3335/x_559,y_0,w_4441,h_3333,r_0,c_crop,q_80,fl_progressive/w_1350,f_auto,c_fit/kenilworth-hotel-kolkata/Executive_Room_Twin_Bed_-_Hotel_Rooms_in_Kolkata_-_Kenilworth_Hotel_1","https://blupp.b-cdn.net/eroshotel/bbd0e739-682a-4e30-a1b0-aea296169f28/home-slider-2.jpg?quality=80"],
    isActive: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    title: "Cozy Beach House",
    description:
      "Wake up to ocean views in this charming beach house. Perfect for a relaxing getaway with direct beach access and all the amenities you need for a comfortable stay.",
    type: "House",
    location: {
      address: "456 Ocean Drive",
      city: "Malibu",
      state: "CA",
      country: "USA",
      zipCode: "90265",
      coordinates: {
        lat: 34.0259,
        lng: -118.7798,
      },
    },
    price: 280,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ["Beach Access", "Wifi", "Kitchen", "Parking", "BBQ"],
    images: ["https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=","https://cdn-ijnhp.nitrocdn.com/pywIAllcUPgoWDXtkiXtBgvTOSromKIg/assets/images/optimized/rev-5794eaa/www.jaypeehotels.com/blog/wp-content/uploads/2024/09/Blog-6-scaled.jpg","https://expressinnindia.com/wp-content/uploads/2024/07/Freesia-God-23.jpg","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0JxgI2qCHTsxA7QPfdfjYhu9rf6CT_-1mAA&s"],
    isActive: true,
    rating: 4.9,
    reviewCount: 89,
  },
  {
    title: "Mountain Cabin Retreat",
    description:
      "Escape to the mountains in this cozy cabin surrounded by nature. Perfect for hiking enthusiasts and those seeking peace and tranquility.",
    type: "Cabin",
    location: {
      address: "789 Mountain View Rd",
      city: "Aspen",
      state: "CO",
      country: "USA",
      zipCode: "81611",
      coordinates: {
        lat: 39.1911,
        lng: -106.8175,
      },
    },
    price: 220,
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ["Mountain View", "Fireplace", "Parking", "Wifi", "Hot Tub"],
    images: ["https://3.imimg.com/data3/FM/MD/MY-1906485/hotel-booking-500x500.jpg","https://flh.ca/media/15310/acc-content.jpg?anchor=center&mode=crop&width=700&height=400&rnd=132830010099600000","https://www.theparkhotels.com/images/site-specific/navi-mumbai/rooms_suites/superior_rooms/superior_room.jpg","https://www.kayak.co.in/rimg/himg/09/a3/22/ice-233787600-70630220_3XL-992040.jpg?width=1366&height=768&crop=true","https://www.theparkhotels.com/images/site-specific/navi-mumbai/rooms_suites/accommodation_banner.jpg"],
    isActive: true,
    rating: 4.7,
    reviewCount: 156,
  },
  {
  title: "Cozy Beachside Bungalow",
  description:
    "Relax in this peaceful beachside retreat, just steps away from the ocean. Enjoy breathtaking sunsets, a private patio, and modern comforts.",
  type: "House",
  location: {
    address: "456 Ocean Ave",
    city: "Santa Monica",
    state: "CA",
    country: "USA",
    zipCode: "90401",
    coordinates: {
      lat: 34.0195,
      lng: -118.4912,
    },
  },
  price: 210,
  guests: 2,
  bedrooms: 1,
  bathrooms: 1,
  amenities: ["Wifi", "Beach Access", "Air Conditioning", "Private Patio"],
  images: [
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
  ],
  isActive: true,
  rating: 4.6,
  reviewCount: 89,
},
{
  title: "Luxury Mountain Cabin",
  description:
    "Escape to this luxurious mountain cabin surrounded by nature. Featuring a fireplace, hot tub, and panoramic views of the Rockies.",
  type: "Cabin",
  location: {
    address: "789 Pine Ridge Rd",
    city: "Aspen",
    state: "CO",
    country: "USA",
    zipCode: "81611",
    coordinates: {
      lat: 39.1911,
      lng: -106.8175,
    },
  },
  price: 320,
  guests: 6,
  bedrooms: 3,
  bathrooms: 2,
  amenities: ["Wifi", "Hot Tub", "Fireplace", "Mountain View", "Parking"],
  images: [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    "https://images.unsplash.com/photo-1598928506311-c55dedab0c4c",
    "https://images.unsplash.com/photo-1613977257363-d1e8a441bfb6"
  ],
  isActive: true,
  rating: 4.9,
  reviewCount: 210,
}
,
{
  title: "Urban Penthouse with Skyline Views",
  description:
    "Sleek and sophisticated penthouse in the heart of downtown Chicago. Enjoy rooftop access, luxury interiors, and 360° skyline views.",
  type: "Cabin",
  location: {
    address: "321 Lake Shore Dr",
    city: "Chicago",
    state: "IL",
    country: "USA",
    zipCode: "60601",
    coordinates: {
      lat: 41.8839,
      lng: -87.6196,
    },
  },
  price: 450,
  guests: 5,
  bedrooms: 2,
  bathrooms: 2,
  amenities: ["Wifi", "Rooftop Access", "Elevator", "Gym", "Smart TV"],
  images: [
    "https://thearchitectsdiary.com/wp-content/uploads/2021/04/Urban-Zen-A-Majestic-Penthouse-1024x684.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ13xfvCHHGQQOEmb6Uxc_yUgQ-RURJCxXkGw&s",
    "https://4bhk-duplex-lavish-penthouse-apartment.kolkatahotelsweb.com/data/Pics/OriginalPhoto/14616/1461647/1461647020/kolkata-pic-32.JPEG"
  ],
  isActive: true,
  rating: 4.7,
  reviewCount: 134,
}
,
{
  title: "Rustic Lakeside Cottage",
  description:
    "Charming cottage on the lake, perfect for a peaceful family getaway. Offers fishing gear, BBQ area, and a cozy fireplace.",
  type: "Villa",
  location: {
    address: "101 Lakeview Ln",
    city: "Lake Placid",
    state: "NY",
    country: "USA",
    zipCode: "12946",
    coordinates: {
      lat: 44.2795,
      lng: -73.9799,
    },
  },
  price: 175,
  guests: 4,
  bedrooms: 2,
  bathrooms: 1,
  amenities: ["Fireplace", "Lake Access", "BBQ", "Fishing Gear", "Board Games"],
  images: [
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
    "https://images.unsplash.com/photo-1559599238-72325c746d89",
    "https://images.unsplash.com/photo-1601914535508-bb0dbfda2c2b"
  ],
  isActive: true,
  rating: 4.5,
  reviewCount: 102,
}
,
{
  title: "Boutique Heritage Hotel",
  description:
    "Stay in a beautifully restored heritage hotel blending traditional charm with modern amenities. Located in the heart of Jaipur’s historic district.",
  type: "Apartment",
  location: {
    address: "17 Palace Rd",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    zipCode: "302001",
    coordinates: {
      lat: 26.9124,
      lng: 75.7873,
    },
  },
  price: 120,
  guests: 3,
  bedrooms: 1,
  bathrooms: 1,
  amenities: ["Wifi", "Breakfast", "Air Conditioning", "Cultural Tours"],
  images: [
    "https://cdn1.tripoto.com/media/filter/tst/img/1633963/Image/1675314785_the_eldest.jpeg.webp",
    "https://media-cdn.tripadvisor.com/media/photo-s/16/5a/17/5d/the-tea-lounge.jpg",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/57719811.jpg?k=48feb426398b24a243d52933c8dec4910374d510e24f075968a90e18260b18dc&o=&hp=1"
  ],
  isActive: true,
  rating: 4.3,
  reviewCount: 78,
}



]

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

await mongoose.connection.db.dropDatabase()
    // Import models
    // const User = require("../models/User").default
    // const Property = require("../models/Property").default

    // Clear existing data
    // await User.deleteMany({})
    // await Property.deleteMany({})
    console.log("Cleared existing data")

    // Create users
    const users = await User.create(sampleUsers)
    console.log("Created sample users")

    // Create properties with host references
    const propertiesWithHosts = sampleProperties.map((property, index) => ({
      ...property,
      host: users[index % users.length]._id,
    }))

    await Property.create(propertiesWithHosts)
    console.log("Created sample properties")

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
