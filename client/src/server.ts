import axios from "axios";

export const serverApi = axios.create({
  baseURL: "http://localhost:3042",
});

