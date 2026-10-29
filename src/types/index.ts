import { Condition, OrderStatus } from "@prisma/client";

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: Condition;
  stock: number;
  image_url: string;
  created_at: Date | string;
}

export interface OrderItemDetail {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: ProductItem;
}

export interface OrderDetail {
  id: string;
  user_id?: string | null;
  customer_name: string;
  phone: string;
  address: string;
  total_amount: number;
  kpay_screenshot_url: string;
  status: OrderStatus;
  created_at: Date | string;
  items?: OrderItemDetail[];
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: Date | string;
}

export interface CurrentUser {
  id: string;
  username: string;
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  role: string;
  created_at: Date | string;
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}
