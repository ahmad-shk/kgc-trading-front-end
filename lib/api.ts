// lib/api.ts

import axiosInstance from "./axios";

export const apiGet = async <T = any>(url: string, config = {}) => {
  const response = await axiosInstance.get<T>(url, config);
  return response.data;
};

export const apiPost = async <T = any>(url: string, data = {}, config = {}) => {
  const response = await axiosInstance.post<T>(url, data, config);
  return response.data;
};

export const apiPut = async <T = any>(url: string, data = {}, config = {}) => {
  const response = await axiosInstance.put<T>(url, data, config);
  return response.data;
};

export const apiDelete = async <T = any>(url: string, config = {}) => {
  const response = await axiosInstance.delete<T>(url, config);
  return response.data;
};
