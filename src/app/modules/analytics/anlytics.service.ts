import { Order } from "../order/order.model";
import { Product } from "../product/product.model";
import { User } from "../user/user.model";

// ════════════════════════════════════════════════════════════
// 1️⃣  $match — Filter (find() এর মতো, কিন্তু pipeline এ)
// ════════════════════════════════════════════════════════════
/*
  $match: SQL এর WHERE clause
  ব্যবহার: documents filter করতে
  কখন: pipeline এর শুরুতে দিলে fast (index ব্যবহার করে)
*/


const getActiveUser = async () => {
  return await User.aggregate([
    {
      $match: {
        status: "active",
        verified: true,
        isDeleted: false,
      },
    },
    {
      $project: {
        name: 1,
        email: 1,
        role: 1,
        profileImage: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);
};




export const AnalyticsService = {
    getActiveUser
}