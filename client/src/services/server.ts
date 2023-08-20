import axios from 'axios';
import {ApiService} from "./api.service.ts";

export const server = axios.create({
  baseURL: 'http://localhost:3042',
});

export const api = new ApiService(server);
