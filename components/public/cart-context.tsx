'use client';

import { createContext, useContext, useMemo, useReducer } from 'react';
import type { MenuCategory } from '@/lib/queries';

type CartOption = {
  id: string;
  label: string;
  extra_price: number;
};

type CartItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  options: CartOption[];
};

type CartState = {
  items: CartItem[];
  deliveryFee: number;
};

const CartContext = createContext<{
  state: CartState;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  setDeliveryFee: (fee: number) => void;
}>({
  state: { items: [], deliveryFee: 0 },
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clear: () => {},
  setDeliveryFee: () => {}
});

const reducer = (state: CartState, action: any): CartState => {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.product_id === action.payload.product_id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product_id === action.payload.product_id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'UPDATE':
      return {
        ...state,
        items: state.items.map((item) =>
          item.product_id === action.payload.product_id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'REMOVE':
      return { ...state, items: state.items.filter((item) => item.product_id !== action.payload) };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'DELIVERY_FEE':
      return { ...state, deliveryFee: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { items: [], deliveryFee: 0 });

  const value = useMemo(
    () => ({
      state,
      addItem: (item: CartItem) => dispatch({ type: 'ADD', payload: item }),
      updateQuantity: (productId: string, quantity: number) =>
        dispatch({ type: 'UPDATE', payload: { product_id: productId, quantity } }),
      removeItem: (productId: string) => dispatch({ type: 'REMOVE', payload: productId }),
      clear: () => dispatch({ type: 'CLEAR' }),
      setDeliveryFee: (fee: number) => dispatch({ type: 'DELIVERY_FEE', payload: fee })
    }),
    [state]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);

export const getProductPrice = (product: MenuCategory['products'][number]) =>
  product.discounted_price ?? product.price;

export const calculateTotals = (state: CartState) => {
  const subtotal = state.items.reduce((sum, item) => {
    const optionsTotal = item.options.reduce((acc, option) => acc + option.extra_price, 0);
    return sum + (item.price + optionsTotal) * item.quantity;
  }, 0);
  return {
    subtotal,
    total: subtotal + state.deliveryFee
  };
};
