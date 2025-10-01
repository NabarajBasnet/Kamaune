const BASE_URL = `https://api.nepcash.com`;

export const AUTH_URLS = {
  LOG_IN: `${BASE_URL}/auth/login/`,
  REGISTER: `${BASE_URL}/auth/register/`,
  REFRESH: `${BASE_URL}/auth/token/refresh/`,
  LOG_OUT: `${BASE_URL}/auth/logout/`,
};

export const PRODUCT_URLS = {
  GET_ALL: `${BASE_URL}/store/products`,
  CREATE_PRODUCT: `${BASE_URL}/store/products`,
  DELETE_PRODUCT: `${BASE_URL}/store/products`,
}

export const CATEGORIES_URLS = {
  GET_ALL: `${BASE_URL}/store/category`,
  GET_ALL_SUBCATEGORIES: `${BASE_URL}/store/subcategory`,
}

export const MERCHANTS_URLS = {
  GET_ALL: `${BASE_URL}/store/merchants`
}

export const BRANDS_URLS = {
  GET_ALL: `${BASE_URL}/store/brands`
}

export const OFFER_URLS = {
  GET_ALL: `${BASE_URL}/store/offers`,
  CREATE_OFFER: `${BASE_URL}/store/offers`,
  GET_OFFER_BY_SLUG: `${BASE_URL}/store/offers`,
  UPDATE_OFFER: `${BASE_URL}/store/offers`,
  DELETE_OFFER: `${BASE_URL}/store/offers`,
}

export const USER_PROFILES = {
  GET_PROFILE: `${BASE_URL}/auth/userprofiles`,
  PUT_PROFILE: `${BASE_URL}/auth/userprofiles`
}
