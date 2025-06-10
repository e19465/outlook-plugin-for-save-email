import axios from "axios";

/**
 * An Axios instance pre-configured with the application's backend base URL,
 * default JSON content type headers, and a 10-second timeout.
 *
 * Use this client for making HTTP requests to the backend API.
 *
 * @remarks
 * - The `baseURL` is set to `process.env.REACT_APP_BACKEND_BASE_URL (from .env file - REACT_APP_BACKEND_BASE_URL)`.
 * - The `Content-Type` header is set to `application/json` for all requests.
 * - Requests will timeout after 10,000 milliseconds (10 seconds).
 *
 * @see {@link https://axios-http.com/docs/instance}
 */
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default axiosClient;
