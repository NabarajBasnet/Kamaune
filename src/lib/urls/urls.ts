const BASE_URL = `https://api.nepcash.com`;

export const AUTH_URLS = {
  LOG_IN: `${BASE_URL}/auth/login/`,
  REGISTER: `${BASE_URL}/auth/register/`,
  REFRESH: `${BASE_URL}/auth/token/refresh/`,
  LOG_OUT: `${BASE_URL}/auth/logout/`,
};

export const PRODUCT_URLS = {
  GET_ALL: `${BASE_URL}/store/products`
}

export const CATEGORIES_URLS = {
  GET_ALL: `${BASE_URL}/store/category`
}