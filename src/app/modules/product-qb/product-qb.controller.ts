// src/app/modules/product/product.controller.ts
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ProductService } from "./product-qb.services";

export const getAllProductsQB = catchAsync(async (req: Request, res: Response) => {
  console.log("\n🚀 QueryBuilder Demo Started!");
  console.log("📋 Request Query:", req.query);
  
  const result = await ProductService.getAllProductsWithQB(req.query);

  // Console logs থেকে সব step দেখতে পাবে
  console.log("\n🎉 QueryBuilder Demo Complete!");
  
  return res.status(200).json({
    success: true,
    message: "Products fetched with QueryBuilder ✅",
    data: result.data,
    meta: result.meta
  });
});
