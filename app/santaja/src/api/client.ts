import axios from 'axios';
import { BASE_URL } from '../../src/api/config';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
});
