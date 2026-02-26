import express          from "express";
import { checkAuth }    from "../../middlewares/checkAuth";
import validateRequest  from "../../middlewares/validateRequest";
import { USER_ROLES }   from "../../../enums/user";
import { OrderValidation }  from "./order.validation";
import { OrderController }  from "./order.controller";

const router = express.Router();

// ── USER ───────────────────────────────────────────

// POST /api/v1/orders
router.post(
  "/",
  checkAuth(USER_ROLES.USER, USER_ROLES.ADMIN),
  validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.createOrder
);

// GET /api/v1/orders/my-orders
router.get(
  "/my-orders",
  checkAuth(USER_ROLES.USER, USER_ROLES.ADMIN),
  OrderController.getMyOrders
);

// GET /api/v1/orders/:id
router.get(
  "/:id",
  checkAuth(USER_ROLES.USER, USER_ROLES.ADMIN),
  validateRequest(OrderValidation.getOrderByIdZodSchema),
  OrderController.getOrderById
);

// PATCH /api/v1/orders/:id/cancel
router.patch(
  "/:id/cancel",
  checkAuth(USER_ROLES.USER),
  validateRequest(OrderValidation.cancelOrderZodSchema),
  OrderController.cancelOrder
);

// ── ADMIN ──────────────────────────────────────────

// GET /api/v1/orders
router.get(
  "/",
  checkAuth(USER_ROLES.ADMIN),
  OrderController.getAllOrders
);

// GET /api/v1/orders/stats
router.get(
  "/stats",
  checkAuth(USER_ROLES.ADMIN),
  OrderController.getOrderStats
);

// PATCH /api/v1/orders/:id/status
router.patch(
  "/:id/status",
  checkAuth(USER_ROLES.ADMIN),
  validateRequest(OrderValidation.updateOrderStatusZodSchema),
  OrderController.updateOrderStatus
);

export const OrderRoutes = router;
