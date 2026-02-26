import { Schema, model } from "mongoose";
import { IOrder, IOrderItem, IShippingAddress, OrderModel } from "./order.interface";
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS  } from "../../../enums/oder";

// ── Sub-schemas ────────────────────────────────────

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type:     Schema.Types.ObjectId,
      ref:      "Product",
      required: true,
    },
    // ⬇ snapshot fields — product পরে delete/update হলেও order history সঠিক থাকবে
    name: {
      type:     String,
      required: true,
    },
    thumbnail: {
      type:    String,
      default: "",
    },
    price: {
      type:     Number,
      required: true,
      min:      0,
    },
    quantity: {
      type:     Number,
      required: true,
      min:      [1, "Quantity must be at least 1"],
    },
    subtotal: {
      type:     Number,
      required: true,
      min:      0,
    },
  },
  { _id: false }  // item-এর আলাদা _id দরকার নেই
);

const shippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: { type: String, required: true, trim: true },
    phone:    { type: String, required: true, trim: true },
    address:  { type: String, required: true, trim: true },
    city:     { type: String, required: true, trim: true },
    zip:      { type: String, required: true, trim: true },
    country:  { type: String, required: true, trim: true, default: "Bangladesh" },
  },
  { _id: false }
);

// ── Main Schema ────────────────────────────────────

const orderSchema = new Schema<IOrder, OrderModel>(
  {
    user: {
      type:     Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },

    items: {
      type:     [orderItemSchema],
      required: true,
      validate: {
        validator: (arr: IOrderItem[]) => arr.length > 0,
        message:   "Order must have at least one item",
      },
    },

    shippingAddress: {
      type:     shippingAddressSchema,
      required: true,
    },

    // ── Pricing ────────────────────────────────
    subtotal: {
      type:     Number,
      required: true,
      min:      0,
    },
    shippingCharge: {
      type:    Number,
      default: 0,
      min:     0,
    },
    discount: {
      type:    Number,
      default: 0,
      min:     0,
    },
    total: {
      type:     Number,
      required: true,
      min:      0,
    },

    // ── Payment ────────────────────────────────
    paymentMethod: {
      type:    String,
      enum:    Object.values(PAYMENT_METHOD),
      default: PAYMENT_METHOD.COD,
    },
    paymentStatus: {
      type:    String,
      enum:    Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
    },
    stripePaymentIntentId: {
      type:    String,
      default: null,
    },

    // ── Order Status ───────────────────────────
    status: {
      type:    String,
      enum:    Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },

    note: {
      type:    String,
      default: "",
      trim:    true,
    },

    isDeleted: {
      type:    Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ── Statics ────────────────────────────────────────

orderSchema.statics.isExistById = async (id: string) => {
  return Order.findById(id);
};

// ── Indexes ────────────────────────────────────────

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });

export const Order = model<IOrder, OrderModel>("Order", orderSchema);
