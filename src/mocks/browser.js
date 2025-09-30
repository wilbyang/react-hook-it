import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// 这会配置一个Service Worker，拦截浏览器中的网络请求
export const worker = setupWorker(...handlers);
