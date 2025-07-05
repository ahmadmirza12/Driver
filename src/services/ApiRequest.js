import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

import {ToastMessage} from '../utils/ToastMessage';
import {endPoints} from './ENV';

const baseURL = endPoints.BASE_URL;

const checkInternetConnection = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    ToastMessage('No Internet Connection');
    throw new Error('No Internet Connection');
  }
};
const axiosBaseQuery =
  ({baseUrl}) =>
  async ({url, method, data, params}) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = token
        ? {'x-auth-token': token, 'Content-Type': 'application/json'}
        : {'Content-Type': 'application/json'};
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return {data: result.data};
    } catch (axiosError) {
      // Log the URL and the error message-
      console.log(`Error with URL: ${baseUrl + url}`);
      if (axiosError.response) {
        ToastMessage(axiosError?.response?.data?.message, 'error');
        console.log('Error Message:', axiosError.response.data.message);
      } else {
        ToastMessage(axiosError.message, 'error');
        console.log(
          `API URL==> ${baseUrl + url} Error==> ${axiosError.message}`,
        );
      }
      console.log('================================================');
      const err = axiosError.response
        ? {status: axiosError.response.status, data: axiosError.response.data}
        : axiosError;
      return {error: err};
    }
  };
const createApi = () => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  instance.interceptors.request.use(async config => {
    await checkInternetConnection();
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  });
  const baseQuery = axiosBaseQuery({baseUrl: baseURL});
  const get = (url, params = {}) => baseQuery({url, method: 'get', params});
  const post = (url, data) => baseQuery({url, method: 'post', data});
  const put = (url, data) => baseQuery({url, method: 'put', data});
  const del = url => baseQuery({url, method: 'delete'});
  return {get, post, put, del};
};
export const {get, post, put, del} = createApi();
