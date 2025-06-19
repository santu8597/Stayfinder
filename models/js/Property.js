import mongoose, {Schema} from "mongoose"


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

// Index for location-based searches
PropertySchema.index({ "location.coordinates": "2dsphere" })
PropertySchema.index({ "location.city": 1, "location.state": 1 })
PropertySchema.index({ price: 1, guests: 1, bedrooms: 1 })

export default mongoose.models.Property || mongoose.model("Property", PropertySchema)
