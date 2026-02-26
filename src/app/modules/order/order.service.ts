import { StatusCodes }  from "http-status-codes";
import mongoose         from "mongoose";
import ApiError         from "../../../errors/ApiErrors";
import { Product }      from "../product/product.model";
import { Order }        from "./order.model";
import { ORDER_STATUS,  PAYMENT_STATUS } from "../../../enums/oder";

import type {
  CreateOrderPayload,
  UpdateOrderStatusPayload,
} from "./order.validation";

// =====================================================
// CREATE ORDER
// =====================================================
const createOrder = async (
  payload:   CreateOrderPayload,
  userId:    string
) => {
  // ── ① প্রতিটা product validate + stock check ─────
  let subtotal = 0;
  const resolvedItems = [];
  const stockUpdates: { id: string; qty: number }[] = [];
  // rollback-এর জন্য track করবো কোন product-এর stock কমানো হয়েছে

  for (const item of payload.items) {
    const product = await Product.findOne({
      _id:       item.product,
      isDeleted: false,
      status:    "active",
    });

    if (!product) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Product not found: ${item.product}`
      );
    }

    if (product.stock < item.quantity) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Insufficient stock for "${product.name}". Available: ${product.stock}`
      );
    }

    const itemPrice    = product.discountPrice ?? product.price;
    const itemSubtotal = itemPrice * item.quantity;
    subtotal          += itemSubtotal;

    resolvedItems.push({
      product:   product._id,
      name:      product.name,
      thumbnail: product.thumbnail,
      price:     itemPrice,
      quantity:  item.quantity,
      subtotal:  itemSubtotal,
    });

    stockUpdates.push({ id: String(product._id), qty: item.quantity });
  }

  // ── ② Stock কমাও ────────────────────────────────
  // এখানে এসে মানে সব product valid + stock আছে
  for (const s of stockUpdates) {
    await Product.findByIdAndUpdate(s.id, {
      $inc: { stock: -s.qty },
    });
  }

  // ── ③ Pricing ────────────────────────────────────
  const shippingCharge = subtotal >= 1000 ? 0 : 60;
  const discount       = 0;
  const total          = subtotal + shippingCharge - discount;

  // ── ④ Order তৈরি করো ─────────────────────────────
  try {
    const order = await Order.create({
      user:            userId,
      items:           resolvedItems,
      shippingAddress: payload.shippingAddress,
      subtotal,
      shippingCharge,
      discount,
      total,
      paymentMethod:   payload.paymentMethod,
      note:            payload.note,
    });

    return order;

  } catch (error) {
    // ── ⑤ Order create fail হলে stock ফেরত দাও ────
    for (const s of stockUpdates) {
      await Product.findByIdAndUpdate(s.id, {
        $inc: { stock: s.qty },   // stock ফিরিয়ে দাও
      });
    }
    throw error;
  }
};


// =====================================================
// GET MY ORDERS (user)
// Aggregation: populate + group + sort
// =====================================================
const getMyOrders = async (
  userId: string,
  query:  Record<string, unknown>
) => {
  const page  = Number(query.page)  || 1;
  const limit = Number(query.limit) || 10;
  const skip  = (page - 1) * limit;

  const matchStage: Record<string, unknown> = {
    user:      new mongoose.Types.ObjectId(userId),
    isDeleted: false,
  };

  if (query.status) matchStage.status = query.status;

  const [result] = await Order.aggregate([
    { $match: matchStage },

    // ── items.product → Product document populate ──
    {
      $lookup: {
        from:         "products",       // collection name (lowercase + plural)
        localField:   "items.product",
        foreignField: "_id",
        as:           "productDetails",
      },
    },

    // ── user → User document populate ─────────────
    {
      $lookup: {
        from:         "users",
        localField:   "user",
        foreignField: "_id",
        as:           "userDetails",
        pipeline: [
          { $project: { name: 1, email: 1, profileImage: 1 } },
        ],
      },
    },
    { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: false } },

    { $sort: { createdAt: -1 } },

    // ── Pagination ─────────────────────────────────
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        meta: [{ $count: "total" }],
      },
    },
  ]);

  const orders     = result?.data  ?? [];
  const totalCount = result?.meta?.[0]?.total ?? 0;

  return {
    orders,
    meta: {
      page,
      limit,
      total:      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

// =====================================================
// GET ALL ORDERS (admin)
// =====================================================
const getAllOrders = async (query: Record<string, unknown>) => {
  const page  = Number(query.page)  || 1;
  const limit = Number(query.limit) || 10;
  const skip  = (page - 1) * limit;

  const matchStage: Record<string, unknown> = { isDeleted: false };

  if (query.status)        matchStage.status        = query.status;
  if (query.paymentStatus) matchStage.paymentStatus = query.paymentStatus;

  // date range filter
  if (query.startDate || query.endDate) {
    matchStage.createdAt = {};
    if (query.startDate)
      (matchStage.createdAt as any).$gte = new Date(query.startDate as string);
    if (query.endDate)
      (matchStage.createdAt as any).$lte = new Date(query.endDate as string);
  }

  const [result] = await Order.aggregate([
    { $match: matchStage },

    // user info populate
    {
      $lookup: {
        from:      "users",
        localField: "user",
        foreignField: "_id",
        as:        "user",
        pipeline: [
          { $project: { name: 1, email: 1, profileImage: 1 } },
        ],
      },
    },
    { $unwind: { path: "$user",        preserveNullAndEmptyArrays: false } },

    // user name/email search
    ...(query.search
      ? [
          {
            $match: {
              $or: [
                { "user.name":  { $regex: query.search, $options: "i" } },
                { "user.email": { $regex: query.search, $options: "i" } },
              ],
            },
          },
        ]
      : []),

    { $sort: { createdAt: -1 } },

    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        meta: [{ $count: "total" }],
      },
    },
  ]);

  const orders     = result?.data  ?? [];
  const totalCount = result?.meta?.[0]?.total ?? 0;

  return {
    orders,
    meta: {
      page,
      limit,
      total:      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

// =====================================================
// GET SINGLE ORDER
// =====================================================
const getOrderById = async (id: string, userId?: string, isAdmin = false) => {
  const order = await Order.findOne({ _id: id, isDeleted: false })
    .populate("user",             "name email profileImage phone")
    .populate("items.product",    "name thumbnail price status")
    .lean();

  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Order not found");
  }

  // user শুধু নিজের order দেখতে পারবে
  if (!isAdmin && order.user.toString() !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You are not allowed to view this order");
  }

  return order;
};

// =====================================================
// UPDATE ORDER STATUS (admin)
// =====================================================
const updateOrderStatus = async (
  id:      string,
  payload: UpdateOrderStatusPayload
) => {
  const order = await Order.isExistById(id);
  if (!order || order.isDeleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Order not found");
  }

  // cancelled/delivered order আর update করা যাবে না
  if (
    order.status === ORDER_STATUS.DELIVERED ||
    order.status === ORDER_STATUS.REFUNDED
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Cannot update a ${order.status} order`
    );
  }

  // status → paid হলে paymentStatus ও update করো
  const extraUpdate: Record<string, unknown> = {};
  if (payload.status === ORDER_STATUS.PAID) {
    extraUpdate.paymentStatus = PAYMENT_STATUS.PAID;
  }
  if (payload.status === ORDER_STATUS.REFUNDED) {
    extraUpdate.paymentStatus = PAYMENT_STATUS.REFUNDED;
  }

  await Order.findByIdAndUpdate(id, {
    $set: { status: payload.status, ...extraUpdate },
  });

  return { message: `Order status updated to ${payload.status}` };
};

// =====================================================
// CANCEL ORDER (user)
// onCascade: stock ফিরিয়ে দাও
// =====================================================

const cancelOrder = async (id: string, userId: string) => {
  const order = await Order.findOne({ _id: id, isDeleted: false });
  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Order not found");
  }

  if (order.user.toString() !== userId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You are not allowed to cancel this order"
    );
  }

  const cancellableStatuses = [ORDER_STATUS.PENDING, ORDER_STATUS.PAID];
  if (!cancellableStatuses.includes(order.status as ORDER_STATUS)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Cannot cancel a ${order.status} order`
    );
  }

  // ── onCascade: stock ফিরিয়ে দাও ─────────────────
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  await Order.findByIdAndUpdate(id, {
    $set: { status: ORDER_STATUS.CANCELLED },
  });

  return { message: "Order cancelled successfully" };
};


// =====================================================
// ORDER STATS (admin dashboard)
// Pure aggregation
// =====================================================
const getOrderStats = async () => {
  const stats = await Order.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id:           "$status",
        count:         { $sum: 1 },
        totalRevenue:  { $sum: "$total" },
      },
    },
    {
      $group: {
        _id: null,
        statuses: {
          $push: {
            status:   "$_id",
            count:    "$count",
            revenue:  "$totalRevenue",
          },
        },
        totalOrders:  { $sum: "$count" },
        totalRevenue: { $sum: "$totalRevenue" },
      },
    },
    {
      $project: {
        _id:          0,
        totalOrders:  1,
        totalRevenue: 1,
        statuses:     1,
      },
    },
  ]);

  return stats[0] ?? {
    totalOrders:  0,
    totalRevenue: 0,
    statuses:     [],
  };
};

export const OrderService = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
};
