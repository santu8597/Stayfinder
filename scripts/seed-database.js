// const mongoose = require("mongoose")
// import mongoose from "mongoose"
// // MongoDB connection
// import User from "../models/User"

import mongoose,{Schema} from "mongoose"
// import User from "../models/js/User"
// import Property from "../models/js/Property"
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/stayfinder"
// // import Property from "../models/Property"
// const User=require("../models/js/User")
// const Property=require("../models/js/Property")
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
    images: ["/placeholder.svg?height=400&width=600"],
    isActive: true,
    rating: 4.7,
    reviewCount: 156,
  },
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
