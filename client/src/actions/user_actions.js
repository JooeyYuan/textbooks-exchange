import axios from 'axios';
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
} from './types';

export function registerUser(dataToSubmit) {
    const request = axios.post(`${'/api/users'}/register`, dataToSubmit)
        .then(response => response.data);
    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function facebookLogin(dataToSubmit) {
    const request = axios.post(`${'/api/users'}/facebook`, dataToSubmit)
        .then(response => response.data);
    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit) {
    const request = axios.post(`${'/api/users'}/login`, dataToSubmit)
        .then(response => response.data);
    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth() {
    const request = axios.get(`${'/api/users'}/auth`)
        .then(response => response.data);
    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser() {
    const request = axios.get(`${'/api/users'}/logout`)
        .then(response => response.data);
    return {
        type: LOGOUT_USER,
        payload: request
    }
}

export function addToCart(_id) {
    const request = axios.get(`${'/api/users'}/addToCart?productId=${_id}`)
        .then(response => response.data);
    return {
        type: ADD_TO_CART_USER,
        payload: request
    }
}

export function getCartItems(cartItems, userCart) {
    const request = axios.get(`/api/product/products_by_id?id=${cartItems}&type=array`)
        .then(response => {
            userCart.forEach(cartItem => {
                response.data.forEach((productDetail, i) => {
                    if (cartItem.id === productDetail._id) {
                        response.data[i].quantity = cartItem.quantity;
                    }
                })
            })
            return response.data;
        });
    return {
        type: GET_CART_ITEMS_USER,
        payload: request
    }
}

export function removeCartItem(id) {
    const request = axios.get(`/api/users/removeFromCart?_id=${id}`)
        .then(response => {
            response.data.cart.forEach(item => {
                response.data.cartDetail.forEach((k, i) => {
                    if (item.id === k._id) {
                        response.data.cartDetail[i].quantity = item.quantity
                    }
                })
            })
            return response.data;
        });
    return {
        type: REMOVE_CART_ITEM_USER,
        payload: request
    }
}

export function onSuccessBuy(data) {
    return {
        type: ON_SUCCESS_BUY_USER,
        payload:data
    }
}

export function addToFavorite(_id) {
    const request = axios.get(`${'/api/users'}/addToFavorite?productId=${_id}`)
        .then(response => response.data);
    return {
        type: ADD_TO_FAVORITE_USER,
        payload: request
    }
}

export function getFavoriteItems(favoriteItems) {
    const request = axios.get(`/api/product/products_by_id?id=${favoriteItems}&type=array`)
        .then(response => response.data);
    return {
        type: GET_FAVORITE_ITEMS_USER,
        payload: request
    }
}

export function removeFavoriteItem(id) {
    const request = axios.get(`/api/users/removeFromFavorite?_id=${id}`)
        .then(response =>  response.data);
    return {
        type: REMOVE_FAVORITE_ITEM_USER,
        payload: request
    }
}

export function fetchProfile() {
    const request = axios.get(`${'/api/users'}/profile`)
        .then(response => response.data);
    return {
        type: FETCH_PROFILE,
        payload: request
    }
}

export function updateProfile(dataToSubmit) {
    const request = axios.put(`${'/api/users'}/profile`, dataToSubmit)
    .then(response => response.data);
    return {
    type: UPDATE_PROFILE,
    payload: request
    }
  }

export function changePassword(dataToSubmit) {
    axios.put(`${'/api/users'}/resetpassword`, dataToSubmit)
}