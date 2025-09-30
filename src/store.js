import { configureStore } from '@reduxjs/toolkit';
import { playlistsApi } from './services/playlistsApi';
import toastReducer, { addToast } from './features/toast/toastSlice';

// 自定义中间件：捕获 RTK Query 最终失败动作，派发 toast
const rtkQueryErrorToToast = store => next => action => {
  const result = next(action);
  if (action.type.endsWith('/rejected') && action.meta?.arg?.endpointName) {
    const { endpointName } = action.meta.arg;
    const status = action.payload?.status ?? action.error?.originalStatus ?? action.error?.status;
    // 忽略主动取消
    if (action.meta.aborted) return result;
    // 生成可读提示
    let reason = '';
    if (status === 'FETCH_ERROR') reason = '网络连接失败';
    else if (status === 429) reason = '请求过于频繁 (429)';
    else if (typeof status === 'number' && status >= 500) reason = `服务器错误 (${status})`;
    else if (typeof status === 'number') reason = `请求失败 (${status})`;
    else reason = '请求失败';

    store.dispatch(addToast(`接口 ${endpointName} 最终失败：${reason}`));
  }
  return result;
};

// Centralized app store
export const store = configureStore({
  reducer: {
    [playlistsApi.reducerPath]: playlistsApi.reducer,
    toast: toastReducer,
  },
  middleware: (getDefault) => getDefault().concat(playlistsApi.middleware, rtkQueryErrorToToast),
});
