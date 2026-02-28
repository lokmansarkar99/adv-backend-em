import { http } from "../../shared/api/http";
import type {
  Order,
  OrderListApiResponse,
  OrderSingleApiResponse,
  OrderQuery,
  CreateOrderPayload,
  OrderStats,
} from "./order.types";

// Orders base
const ORDER_BASE = "/orders";
// Stripe base
const STRIPE_BASE = "/stripe";

export const orderApi = {
  // USER
 create(payload: CreateOrderPayload) {
    return http.post<OrderSingleApiResponse>("/orders", payload);
  },

  getMyOrders(query: OrderQuery = {}) {
    return http.get<OrderListApiResponse>(`${ORDER_BASE}/my-orders`, {
      params: query,
    });
  },

  getById(id: string) {
    return http.get<OrderSingleApiResponse>(`${ORDER_BASE}/${id}`);
  },

  cancel(id: string) {
    return http.patch<{ success: boolean; message: string; data: null }>(
      `${ORDER_BASE}/${id}/cancel`,
      {}
    );
  },

  // ADMIN
  getAll(query: OrderQuery = {}) {
    return http.get<OrderListApiResponse>(ORDER_BASE, { params: query });
  },

  updateStatus(id: string, status: string) {
    return http.patch<{ success: boolean; message: string; data: null }>(
      `${ORDER_BASE}/${id}/status`,
      { status }
    );
  },

  getStats() {
    return http.get<{ success: boolean; message: string; data: OrderStats }>(
      `${ORDER_BASE}/stats`
    );
  },
};

export const stripeApi = {
  createCheckoutSession(orderId: string) {
    return http.post<{
      success: boolean;
      message: string;
      data: { sessionId: string; sessionUrl: string | null };
    }>(`${STRIPE_BASE}/create-checkout-session`, { orderId });
  },

  getPaymentStatus(orderId: string) {
    return http.get<{
      success: boolean;
      message: string;
      data: {
        status: string;
        paymentStatus: string;
        paymentMethod: string;
        stripePaymentIntentId?: string;
        total: number;
        createdAt: string;
      };
    }>(`${STRIPE_BASE}/${orderId}/status`);
  },

  verifySession(sessionId: string) {
    return http.get<{
      success: boolean;
      message: string;
      data: {
        session: {
          id: string;
          paymentStatus: string;
          amountTotal: number;
          currency: string;
        };
        order: Order;
      };
    }>(`${STRIPE_BASE}/verify-session`, {
      params: { sessionId },
    });
  },

  refund(orderId: string) {
    return http.post<{
      success: boolean;
      message: string;
      data: {
        message: string;
        refundId: string;
        status: string;
        amount: number;
      };
    }>(`${STRIPE_BASE}/${orderId}/refund`, {});
  },
};
