import { Model, Types } from "mongoose";


export type IOrderItem = {
  product:      Types.ObjectId;   
  name:         string;          
  thumbnail:    string;          
  price:        number;         
  quantity:     number;
  subtotal:     number;           
};

export type IShippingAddress = {
  fullName:  string;
  phone:     string;
  address:   string;
  city:      string;
  zip:       string;
  country:   string;
};

export type IOrder = {
  user:            Types.ObjectId;       
  items:           IOrderItem[];
  shippingAddress: IShippingAddress;

  // ── Pricing ──────────────────────────
  subtotal:        number;              
  shippingCharge:  number;
  discount:        number;
  total:           number;             

  // ── Payment ──────────────────────────
  paymentMethod:   string;
  paymentStatus:   string;
  stripePaymentIntentId?: string;         

  // ── Order Status ─────────────────────
  status:          string;
  note?:           string;                

  // ── Soft delete ──────────────────────
  isDeleted:       boolean;
};

export type OrderModel = {
  isExistById(id: string): any;
} & Model<IOrder>;
