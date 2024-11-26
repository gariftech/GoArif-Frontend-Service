import axios from 'axios';
import {ErrorApiResponseType} from '../types/ErrorApiResponseType';
import Swal from 'sweetalert2'


const defaultTimeout = 1000 * 90;
const createApiClient = (
  showToasts = true,
  isMultipart = false,
  message?: {success: string; error: string},
) => {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: defaultTimeout,
    headers: {
      'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
    },
  });

  axiosInstance.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    response => {
      if (showToasts) {
        // handleShowToast(
        //   {
        //     title: 'Success',
        //     message: response.data.message || 'Action completed successfully.',
        //     type: ToastType.SUCCESS,
        //   }
        // );
        Swal.fire({
          title: 'Success',
          icon: 'success',
          text: response.data.message,
          confirmButtonText: 'Close'
        })
      }
      return response;
    },
    error => {
      const formattedError = getError(error);
      if (showToasts) {
        Swal.fire({
          title: 'Warning!',
          text: formattedError.message.toString(),
          icon: 'warning',
          confirmButtonText: 'Close'
        })
      }
      return Promise.reject(formattedError);
    },
  );

  function getError(error: any): ErrorApiResponseType {
    const code = error?.response?.code ?? null;
    let message =
      error?.response?.data?.errorMessage ?? 'An unknown error occurred';

    if (typeof message === 'object' && message !== null) {
      let newMessage = '';
      for (const key in message) {
        if (message.hasOwnProperty(key)) {
          newMessage += `${message[key] || ''}`.trim() + ' ';
        }
      }
      message = newMessage;
    }

    const validationMap = error?.response?.data?.errorMessage || [];
    if (Array.isArray(validationMap) && validationMap.length > 0) {
      const arrayMsg = validationMap.join('<br />');
      message = arrayMsg || message;
    }

    return {
      title: 'Error',
      message,
      type: 'danger',
      status: code,
      data: error?.response?.data ?? null,
    };
  }

  return axiosInstance;
};

export default createApiClient;
