import { Post } from '../types';
import axios from 'axios';

export const api = {
    getPosts: async (start: number): Promise<Post[]> => {
        const resp = await axios.get(`http://localhost:3001/posts?_start=${start}&_limit=20`)
        return resp.data
    },
    deletePost: async (id: string): Promise<void> => {
        await axios.delete(`http://localhost:3001/posts/${id}`)
    },
    addPost: async (post: Post) => {
        const resp = await axios.post(`http://localhost:3001/posts`, {
            id: post.id,
            title: post.title,
            client: post.client,
            product: post.product,
            IBAN: post.IBAN,
            article: post.article
        })
        return resp.data
    },
    editPost: async (post: Post) => {
        const resp = await axios.put(`http://localhost:3001/posts/${post.id}`, {
            id: post.id,
            title: post.title,
            client: post.client,
            product: post.product,
            IBAN: post.IBAN,
            article: post.article
        })
        return resp.data
    }
}