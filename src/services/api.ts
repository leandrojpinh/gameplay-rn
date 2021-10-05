import axios from 'axios';
import { BASE_URL } from '../configs/discordAuth';

const api = axios.create({
    baseURL: BASE_URL
});

export { api };