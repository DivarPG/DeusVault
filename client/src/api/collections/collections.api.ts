import {BASE_URL} from '../baseUrl';
import {STORAGE_KEYS} from '../../utils/constants';
import type {CollectionTemplate} from './collections.dto';

const authHeaders = () => {
    const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
    return {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const getCollectionsFetch = (): Promise<Response> => {
    const url = `${BASE_URL}/collections`;
    return fetch(url, {
        method: 'GET',
        headers: authHeaders(),
    });
};

export const createCollectionFetch = (data: {
    name: string;
    description?: string;
    template: CollectionTemplate;                       // ← больше не any
}): Promise<Response> => {
    const url = `${BASE_URL}/collections`;
    return fetch(url, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
};

export const deleteCollectionFetch = (id: string): Promise<Response> => {
    const url = `${BASE_URL}/collections/${id}`;
    return fetch(url, {
        method: 'DELETE',
        headers: authHeaders(),
    });
};

export const addItemFetch = (collectionId: string, data: {
    status: string;
    values: Record<string, unknown>;                    // ← больше не any
}): Promise<Response> => {
    const url = `${BASE_URL}/collections/${collectionId}/items`;
    return fetch(url, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
};

export const updateItemFetch = (collectionId: string, itemId: string, data: {
    status?: string;
    values?: Record<string, unknown>;                   // ← больше не any
}): Promise<Response> => {
    const url = `${BASE_URL}/collections/${collectionId}/items/${itemId}`;
    return fetch(url, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
};

export const deleteItemFetch = (collectionId: string, itemId: string): Promise<Response> => {
    const url = `${BASE_URL}/collections/${collectionId}/items/${itemId}`;
    return fetch(url, {
        method: 'DELETE',
        headers: authHeaders(),
    });
};

export const updateTemplateFetch = (collectionId: string, template: CollectionTemplate): Promise<Response> => {
    const url = `${BASE_URL}/collections/${collectionId}/template`;
    return fetch(url, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({template}),
    });
};