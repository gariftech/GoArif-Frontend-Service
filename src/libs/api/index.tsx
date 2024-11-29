import { IAddAttachment } from '../types/IAttachmentData';
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

/////file to audio
// export const SpeechFileToText = async (
//   body: any,
//   showToasts = true,
// ) => {
//   const api = createApiClient(showToasts);
//   return await api.post('/api/v1/Transcribe/SpeechFileToText/'+ body.languange, body);
// };

export const SpeechFileToText = async ( body ) => {
  const message = {
    success: 'File Successfully Saved',
    error: 'Failed to Save File',
  };
  const api = createApiClient(false, true, message);
  const formData = new FormData();
  formData.append('file', body.file);

  return await api.post(`/api/v1/Transcribe/SpeechFileToText/${body.language}`, formData);
};

export const AttachmentFile = async ( body ) => {
  const message = {
    success: 'File Successfully Saved',
    error: 'Failed to Save File',
  };
  const api = createApiClient(false, true, message);
  const formData = new FormData();
  formData.append('file', body.file);
  return await api.post(`/api/v1/Attachment/Upload`, formData);
};

export const SpeechYoutubeToText = async (
  body: any,
  showToasts = true,
) => {
  const api = createApiClient(showToasts);
  return await api.post(`/api/v1/Transcribe/SpeechYoutubeToText`, body);
};

export const SpeechUrlGeneral = async (
  body: any,
  showToasts = true,
) => {
  const api = createApiClient(showToasts);
  return await api.post(`/api/v1/Transcribe/SpeechUrlGeneralToText`, body);
};

export const SpeechUrlDrive = async (
  body: any,
  showToasts = true,
) => {
  const api = createApiClient(showToasts);
  return await api.post(`/api/v1/Transcribe/SpeechUrlGoogleDriveShareToText`, body);
};

export const apiListPromptFilesum = async () => {
  const api = createApiClient(false);
  return await api.get(`/api/v1/prompt/filesum`);
};

export const apiListPromptTabular = async () => {
  const api = createApiClient(false);
  return await api.get(`/api/v1/prompt/tabular`);
};

export const apiListPromptSentimen = async () => {
  const api = createApiClient(false);
  return await api.get(`/api/v1/prompt/sentimen`);
};

export const apiListRiwayat = async () => {
  const api = createApiClient(false);
  return await api.get(`/api/v1/riwayat`);
};

export const apiListRiwayatDelete = async (id) => {
  const api = createApiClient(false);
  return await api.delete(`/api/v1/riwayat/${id}`);
};

export const apiListRiwayatPost = async (
  body: any,
  showToasts = true,
) => {
  const api = createApiClient(showToasts);
  return await api.post(`/api/v1/riwayat`, body);
};