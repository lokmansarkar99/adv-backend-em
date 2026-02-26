
import { Request, Response } from "express";
import { StatusCodes }       from "http-status-codes";

import catchAsync   from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ProductService } from "./product.service";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.createProduct(
    req.body,
    req.files,
    req.user?.id
  );

  sendResponse(res, {
    success:    true,
    message:    "Product created successfully",
    statusCode: StatusCodes.CREATED,
    data:       result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getAllProducts(req.query);

  sendResponse(res, {
    success:    true,
    message:    "Products fetched successfully",
    statusCode: StatusCodes.OK,
    data:       result.products,
    meta:       result.meta,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getProductById(req.params.id as string);

  sendResponse(res, {
    success:    true,
    message:    "Product fetched successfully",
    statusCode: StatusCodes.OK,
    data:       result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.updateProduct(
    req.params.id as string,
    req.body,
    req.files
  );

  sendResponse(res, {
    success:    true,
    message:    "Product updated successfully",
    statusCode: StatusCodes.OK,
    data:       result,
  });
});

const updateProductStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.updateProductStatus(
    req.params.id as string,
    req.body
  );

  sendResponse(res, {
    success:    true,
    message:    result.message,
    statusCode: StatusCodes.OK,
    data:       null,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.deleteProduct(req.params.id as string);

  sendResponse(res, {
    success:    true,
    message:    result.message,
    statusCode: StatusCodes.OK,
    data:       null,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
  deleteProduct,
};
