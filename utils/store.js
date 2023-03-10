import Cookies from 'js-cookie';
import { createContext, useReducer } from 'react';

export const Store = createContext();

export const CART_ADD_ITEM = 'CART_ADD_ITEM';
export const CART_REMOVE_ITEM = 'CART_REMOVE_ITEM';
export const CART_RESET = 'CART_RESET';
export const CART_CLEAR_ITEMS = 'CART_CLEAR_ITEMS';
export const SAVE_SHIPPING_ADDRESS = 'SAVE_SHIPPING_ADDRESS';
export const SAVE_PAYMENT_METHOD = 'SAVE_PAYMENT_METHOD';

const initialState = {
  cart: Cookies.get('cart')
    ? JSON.parse(Cookies.get('cart'))
    : { cartItems: [], shippingAddress: {} },
  // cart: { cartItems: [] },
};

function reducer(state, action) {
  switch (action.type) {
    case CART_ADD_ITEM: {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case CART_REMOVE_ITEM: {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );
      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case CART_RESET: {
      return {
        ...state,
        cart: {
          cartItems: {},
          shippingAddress: { location: {} },
          paymentMethod: '',
        },
      };
    }
    case CART_CLEAR_ITEMS: {
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [],
        },
      };
    }
    case SAVE_SHIPPING_ADDRESS: {
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...action.payload,
          },
        },
      };
    }
    case SAVE_PAYMENT_METHOD: {
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    }

    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
