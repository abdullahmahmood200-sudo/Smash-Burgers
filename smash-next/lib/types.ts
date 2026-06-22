export type MenuCategory = "burger" | "flagship";

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  badge: string | null;
  category: MenuCategory | string;
  image_default: string | null;
  image_explode: string | null;
  is_available: boolean;
  sort_order: number;
}

export interface CartLine {
  id: string; // menu item id
  slug: string;
  name: string;
  price: number;
  quantity: number;
}

export type FulfillmentType = "pickup" | "delivery";

export interface CheckoutPayload {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  fulfillment_type: FulfillmentType;
  address?: string;
  notes?: string;
  items: { menu_item_id: string; quantity: number }[];
}
