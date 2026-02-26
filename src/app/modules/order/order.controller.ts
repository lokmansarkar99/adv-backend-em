import { Request, Response } from "express";
import { StatusCodes }       from "http-status-codes";

import catchAsync   from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { OrderService } from "./order.service";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.createOrder(req.body, req.user?.id);

  sendResponse(res, {
    success:    true,
    message:    "Order placed successfully",
    statusCode: StatusCodes.CREATED,
    data:       result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getMyOrders(req.user?.id, req.query);

  sendResponse(res, {
    success:    true,
    message:    "Orders fetched successfully",
    statusCode: StatusCodes.OK,
    data:       result.orders,
    meta:       result.meta,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrders(req.query);

  sendResponse(res, {
    success:    true,
    message:    "All orders fetched successfully",
    statusCode: StatusCodes.OK,
    data:       result.orders,
    meta:       result.meta,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const isAdmin = req.user?.role === "ADMIN";
  const result  = await OrderService.getOrderById(
    req.params.id as string,
    req.user?.id,
    isAdmin
  );

  sendResponse(res, {
    success:    true,
    message:    "Order fetched successfully",
    statusCode: StatusCodes.OK,
    data:       result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.updateOrderStatus(req.params.id as string, req.body);

  sendResponse(res, {
    success:    true,
    message:    result.message,
    statusCode: StatusCodes.OK,
    data:       null,
  });
});

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.cancelOrder(req.params.id as string, req.user?.id);

  sendResponse(res, {
    success:    true,
    message:    result.message,
    statusCode: StatusCodes.OK,
    data:       null,
  });
});

const getOrderStats = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getOrderStats();

  sendResponse(res, {
    success:    true,
    message:    "Order stats fetched successfully",
    statusCode: StatusCodes.OK,
    data:       result,
  });
});

export const OrderController = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
};
