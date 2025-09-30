import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// RTK Query API slice for playlists
// 基础 fetch baseQuery
const rawBaseQuery = fetchBaseQuery({ baseUrl: '/' });

// 幂等方法：可安全重试
const IDEMPOTENT_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function isIdempotent(method) {
  return IDEMPOTENT_METHODS.has(method.toUpperCase());
}

function parseRetryAfter(value) {
  if (!value) return null;
  // 数字：秒
  if (/^\d+$/.test(value.trim())) {
    return parseInt(value.trim(), 10) * 1000;
  }
  // HTTP-date
  const date = new Date(value);
  const diff = date.getTime() - Date.now();
  if (!isNaN(diff) && diff > 0) return diff;
  return null;
}

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));
    const t = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

// 自定义带策略的 baseQuery：
// 1. 只对幂等方法默认重试 (GET/HEAD/OPTIONS)
// 2. 对 FETCH_ERROR / 5xx / 429 重试
// 3. 429 支持 Retry-After 头，优先用其值，否则指数退避
// 4. extraOptions.maxRetries 覆盖默认 (幂等=3, 非幂等=0)
// 5. extraOptions.retryNonIdempotent=true 可开启对非幂等的重试
const baseQueryWithRetry = async (args, api, extraOptions = {}) => {
  const resolvedArgs = typeof args === 'string' ? { url: args } : args;
  const method = (resolvedArgs.method || 'GET').toUpperCase();
  const {
    maxRetries: overrideMax,
    retryNonIdempotent = false,
    baseDelayMs = 300,
    maxDelayMs = 4000,
  } = extraOptions;

  const defaultMax = isIdempotent(method) ? 3 : 0;
  const maxRetries = typeof overrideMax === 'number' ? overrideMax : (retryNonIdempotent ? 3 : defaultMax);

  let attempt = 0;
  while (true) {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (!result.error) {
      return result; // 成功
    }

    const { error } = result;
    const status = error.status;

    const retryable =
      status === 'FETCH_ERROR' ||
      status === 429 ||
      (typeof status === 'number' && status >= 500 && status < 600);

    if (!retryable || attempt >= maxRetries) {
      return result; // 不重试
    }

    // 429: 解析 Retry-After
    let delay = null;
    if (status === 429 && result.meta?.response) {
      const headerVal = result.meta.response.headers.get('Retry-After');
      delay = parseRetryAfter(headerVal);
    }
    // 指数退避：base * 2^attempt + jitter
    if (delay == null) {
      const backoff = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
      const jitter = Math.random() * 0.3 * backoff; // 30% 抖动
      delay = backoff + jitter;
    }

    attempt += 1;
    try {
      await sleep(delay, api.signal);
    } catch (e) {
      // 中断
      return result;
    }
  }
};

export const playlistsApi = createApi({
  reducerPath: 'playlistsApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Playlists'],
  endpoints: (builder) => ({
    getPlaylists: builder.query({
      query: (limit) => (limit ? `playlists?limit=${limit}` : 'playlists'),
      // 示例：在调用层覆盖重试：useGetPlaylistsQuery(undefined, { extraOptions: { maxRetries: 5 }})
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: 'Playlists', id: p.id })),
              { type: 'Playlists', id: 'LIST' },
            ]
          : [{ type: 'Playlists', id: 'LIST' }],
    }),
    getPlaylist: builder.query({
      query: (id) => `playlists/${id}`,
      providesTags: (result, error, id) => [{ type: 'Playlists', id }],
    }),
    createPlaylist: builder.mutation({
      query: (body) => ({ url: 'playlists', method: 'POST', body }),
      // 非幂等：默认不重试；如需重试在调用时传 extraOptions: { retryNonIdempotent: true, maxRetries: 2 }
      invalidatesTags: [{ type: 'Playlists', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPlaylistsQuery,
  useGetPlaylistQuery,
  useCreatePlaylistMutation,
} = playlistsApi;
