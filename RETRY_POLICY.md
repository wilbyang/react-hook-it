## 重试策略说明

本项目对 RTK Query 的 `baseQuery` 进行了自定义封装，实现以下特性：

### 1. 幂等 vs 非幂等
| 方法 | 默认最大重试次数 | 说明 |
|------|------------------|------|
| GET / HEAD / OPTIONS | 3 | 失败后做指数退避 + 抖动重试 |
| 其它 (POST/PUT/PATCH/DELETE) | 0 | 默认不重试 (可手动开启) |

### 2. 可重试错误类型
1. 网络层错误 (`status === 'FETCH_ERROR'`)
2. 5xx 服务端错误 (500–599)
3. 429 (Rate Limit) – 支持 `Retry-After` 解析

### 3. 429 Retry-After 解析逻辑
- 如果 `Retry-After` 为纯数字：按“秒”转换为毫秒延迟
- 如果为 HTTP-Date：计算其与当前时间差
- 无或异常：回退到指数退避

### 4. 指数退避算法
`delay = min(baseDelay * 2^attempt, maxDelay) + jitter`
默认：`baseDelay = 300ms`, `maxDelay = 4000ms`, `jitter <= 30%`

### 5. 调用时覆盖示例
```js
// GET：提升最大重试次数
useGetPlaylistsQuery(undefined, { extraOptions: { maxRetries: 5 } });

// POST：显式允许非幂等重试
const [createPlaylist] = useCreatePlaylistMutation();
createPlaylist(data, { extraOptions: { retryNonIdempotent: true, maxRetries: 2 } });

// 自定义退避参数
useGetPlaylistsQuery(undefined, { extraOptions: { baseDelayMs: 500, maxDelayMs: 5000 } });
```

### 6. 设计权衡
- 避免对非幂等请求的隐式重试导致副作用重复
- 仅在明确需要时开启 `retryNonIdempotent`
- 429 场景优先尊重服务端节流窗口

### 7. 未来可扩展点
- 记录重试日志 / 指标
- 针对特定 error code（如 502 vs 503）动态调整最大重试
- 引入断路器 (circuit breaker) 与熔断恢复策略

---
如需进一步自定义请修改：`src/services/playlistsApi.js` 中 `baseQueryWithRetry`。