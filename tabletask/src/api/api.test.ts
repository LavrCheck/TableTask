import { api } from './api';
import { Post } from '../types';
import axios from 'axios';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.get.mockResolvedValue({ data: [] });

test('getPosts возвращает массив постов', async () => {
  const posts = await api.getPosts(0);
  expect(posts).toBeInstanceOf(Array);

  posts.forEach((post: Post) => {
    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('client');
    expect(post).toHaveProperty('product');
    expect(post).toHaveProperty('IBAN');
    expect(post).toHaveProperty('article');
  });
});