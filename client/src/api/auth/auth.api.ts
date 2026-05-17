import { BASE_URL } from '../baseUrl';

export const registerFetch = async (username: string, password: string): Promise<Response> => {
    const url = `${BASE_URL}/auth/register`;
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify({ username, password }),
    });
};

export const loginFetch = async (username: string, password: string): Promise<Response> => {
    const url = `${BASE_URL}/auth/login`;
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify({ username, password }),
    });
};