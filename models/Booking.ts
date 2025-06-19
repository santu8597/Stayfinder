import mongoose, { type Document, Schema } from "mongoose"

export interface IBooking extends Document {
  property: mongoose.Types.ObjectId
  guest: mongoose.Types.ObjectId
  host: mongoose.Types.ObjectId
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  paymentStatus: "pending" | "paid" | "refunded"
  specialRequests?: string
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property is required"],
    },
    guest: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Guest is required"],
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host is required"],
    },
    checkIn: {
      type: Date,
      required: [true, "Check-in date is required"],
    },
    checkOut: {
      type: Date,
      required: [true, "Check-out date is required"],
      validate: {
        validator: function (this: IBooking, value: Date) {
          return value > this.checkIn
        },
        message: "Check-out date must be after check-in date",
      },
    },
    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "Must have at least 1 guest"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    specialRequests: {
      type: String,
      maxlength: [500, "Special requests cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  },
)

// Prevent double booking
BookingSchema.index(
  {
    property: 1,
    checkIn: 1,
    checkOut: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["pending", "confirmed"] },
    },
  },
)

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema)
