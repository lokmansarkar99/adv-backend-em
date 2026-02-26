import { Schema, model } from "mongoose";
import { IProduct, ProductModel } from "./product.interface";
import { PRODUCT_STATUS } from "../../../enums/product";

const productSchema = new Schema<IProduct, ProductModel>(
  {
    name: {
      type:      String,
      required:  true,
      trim:      true,
    },

    description: {
      type:     String,
      required: true,
      trim:     true,
    },

    price: {
      type:     Number,
      required: true,
      min:      0,
    },

    discountPrice: {
      type:    Number,
      default: null,
      min:     0,
    },

    stock: {
      type:    Number,
      default: 0,
      min:     0,
    },

    category: {
      type:      String,
      required:  true,
      lowercase: true,
      trim:      true,
    },

    tags: {
      type:    [String],
      default: [],
    },

    images: {
      type:     [String],
      required: true,
      default:  [],
    },

    thumbnail: {
      type:    String,
      default: "",
    },

    createdBy: {
      type:     Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },

    status: {
      type:    String,
      enum:    Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.ACTIVE,
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

// ── Statics ───────────────────────────────────────

productSchema.statics.isExistById = async (id: string) => {
  const isExist = Product.findById(id);
  return isExist;
};

productSchema.statics.isExistByName = async (name: string) => {
  const isExist = Product.findOne({ name });
  return isExist;
};

// ── Middlewares ───────────────────────────────────

// auto-set thumbnail from first image on create/update
productSchema.pre("save", async function () {
  if (this.images && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }
});

export const Product = model<IProduct, ProductModel>("Product", productSchema);
