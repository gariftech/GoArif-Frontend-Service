import {IAddAttachment} from '../types/IAttachmentData';
import createApiClient from './apiClient';

export const apiAuthLogin = async (
  body: any,
  showToasts = true,
) => {
  const api = createApiClient(showToasts);
  return await api.post('/api/v1/user-auth/login', body);
};

export const apiAuthCheckEmail = async (
  email: string,
  showToasts = true,
) => {
  const api = createApiClient(showToasts);
  return await api.get(`/api/v1/user-auth/check-mail-registered/${email}`);
};

export const apiOtpSend = async (
  body: any,
  showToasts = true,
) => {
  const api = createApiClient(showToasts);
  return await api.post('/api/v1/otp/send-email', body);
};

export const apiOtpValidate = async (
  body: any,
  showToasts = true,
) => {
  const api = createApiClient(showToasts);
  return await api.post('/api/v1/otp/validate', body);
};

export const apiAuthRegister = async (
  body: any,
  showToasts = true,
) => {
  const api = createApiClient(showToasts);
  return await api.post('/api/v1/user-auth/register', body);
};

export const apiAuthLogout = async (
  showToasts = true,
) => {
  const api = createApiClient(showToasts);
  return await api.post('/api/v1/user-auth/logout');
};

export const apiResetPassword = async (
  body: any,
  showToasts = true,
) => {
  const api = createApiClient(showToasts);
  return await api.post(`/api/v1/user-auth/forgot-password`, body);
};