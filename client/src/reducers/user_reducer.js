import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  ADD_TO_CART_USER,
  GET_CART_ITEMS_USER,
  REMOVE_CART_ITEM_USER,
  ADD_TO_FAVORITE_USER,
  GET_FAVORITE_ITEMS_USER,
  REMOVE_FAVORITE_ITEM_USER,
  ON_SUCCESS_BUY_USER,
  FETCH_PROFILE,
  UPDATE_PROFILE
} from '../actions/types';

export default function (state = {}, action) {
  switch (action.type) {
      case REGISTER_USER:
          return { ...state, register: action.payload }
      case LOGIN_USER:
          return { ...state, loginSucces: action.payload }
      case AUTH_USER:
          return { ...state, userData: action.payload }
      case LOGOUT_USER:
          return { ...state }
      case FETCH_PROFILE:
          return { ...state, user: action.payload };
      case UPDATE_PROFILE:
          return { ...state, user: action.payload };
      case ADD_TO_CART_USER:
          return {
              ...state, userData: {
                  ...state.userData,
                  cart: action.payload
              }
          }
      case GET_CART_ITEMS_USER:
          return {
              ...state, cartDetail: action.payload
          }
      case REMOVE_CART_ITEM_USER:
          return {
              ...state,
              cartDetail: action.payload.cartDetail,
              userData: {
                  ...state.userData,
                  cart: action.payload.cart
              }

          }
      case ADD_TO_FAVORITE_USER:
          return {
              ...state, userData: {
                  ...state.userData,
                  favorite: action.payload
              }
          }
      case GET_FAVORITE_ITEMS_USER:
          return {
              ...state, favoriteDetail: action.payload
          }
      case REMOVE_FAVORITE_ITEM_USER:
          return {
              ...state,
              favoriteDetail: action.payload.favoriteDetail,
              userData: {
                  ...state.userData,
                  favorite: action.payload.favorite
              }

          }
      case ON_SUCCESS_BUY_USER:
          return {
              ...state,
              userData: {
                  ...state.userData,
                  cart: action.payload.cart
              },
              cartDetail: action.payload.cartDetail
          }
      default:
          return state;
  }
}