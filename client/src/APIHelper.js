import axios from "axios";
import constants from "./config/constants";
axios.defaults.baseURL = constants.apiUrl;


export const fetchShortUrl = obj => {
  const requestUrl = "updateitem";
  return axios.post(requestUrl, obj);
};

export const createShortUrl = obj => {
  const requestUrl = "item";
  return axios.post(requestUrl, obj);
};
