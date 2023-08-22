import axios from 'axios';
import {ApiService} from "./api.service.ts";

export const server = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:3042',
});

export const api = new ApiService(server);
