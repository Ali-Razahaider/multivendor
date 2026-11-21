// Checkout state that survives the hop from /checkout to /payment.

export type ShippingAddress = {
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  country: string;
  zipCode: string;
};

export type QuoteItem = { _id: string; name: string; image?: string; qty: number; price: number; discountedPrice: number; lineTotal: number };
export type QuoteShop = { shopId: string; shopName?: string; items: QuoteItem[]; subTotal: number; discount: number; shipping: number; total: number; couponCode?: string };
export type Quote = { shops: QuoteShop[]; subTotal: number; shipping: number; discount: number; total: number; itemCount: number; couponCode: string | null };

type CheckoutState = { shippingAddress: ShippingAddress; couponCode?: string | null };

const read = <T,>(key: string): T | null => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const write = (key: string, value: unknown) => {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // sessionStorage unavailable; the flow still works within this page.
  }
};

export const loadCheckout = () => read<CheckoutState>('checkout');
export const saveCheckout = (state: CheckoutState | null) => write('checkout', state);
export const loadLastOrders = () => read<any[]>('lastOrders') || [];
export const saveLastOrders = (orders: any[]) => write('lastOrders', orders);

/** Only ids and quantities go to the server; it prices everything itself. */
export const cartPayload = (cart: { _id: string; qty: number }[]) => cart.map((i) => ({ _id: i._id, qty: i.qty }));
