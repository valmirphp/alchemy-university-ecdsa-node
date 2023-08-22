import axios from 'axios';
import {ApiService} from "./api.service.ts";

export const server = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const api = new ApiService(server);
