import { Model, Types } from "mongoose";

export type ProductStatus = "active" | "inactive" | "draft";

export type IProduct = {
  name:          string;
  description:   string;
  price:         number;
  discountPrice?: number;
  stock:         number;
  category:      string;
  tags?:         string[];
  images:        string[];      // ["/product/img1.jpg", "/product/img2.jpg"]
  thumbnail:     string;        // auto-set from images[0]
  createdBy:     Types.ObjectId; // User ref
  status:        ProductStatus;
  isDeleted:     boolean;
};

export type ProductModel = {
  isExistById(id: string): any;
  isExistByName(name: string): any;
} & Model<IProduct>;
