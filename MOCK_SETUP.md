# React Hook It - Mock数据系统

本项目使用MSW (Mock Service Worker) 来mock API数据，无需搭建真实的后端服务。

## 已配置的Mock API

### GET /playlists
返回播放列表数组，包含以下字段：
- `id`: 播放列表ID
- `name`: 播放列表名称  
- `description`: 描述
- `songs`: 歌曲数组

支持查询参数：
- `limit`: 限制返回的播放列表数量

### GET /playlists/:id
返回单个播放列表详情

### POST /playlists
创建新的播放列表

## 文件结构

```
src/
  mocks/
    handlers.js     # API处理程序，定义mock数据和响应
    browser.js      # MSW浏览器配置
  usePlayLists.js   # 使用fetch获取播放列表数据的hook
  index.js          # 在开发环境启动MSW
```

## 如何使用

1. **查看现有mock数据**: 打开 `src/mocks/handlers.js`
2. **添加新的API mock**: 在handlers数组中添加新的http处理程序
3. **修改mock数据**: 直接编辑 `mockPlaylists` 数组或其他mock数据

## 示例：添加新的API mock

```javascript
// 在 src/mocks/handlers.js 中添加
export const handlers = [
  // 现有的handlers...
  
  // 新增：获取用户信息
  http.get('/users/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: '用户名',
      email: 'user@example.com'
    });
  }),
];
```

## 开发环境 vs 生产环境

- **开发环境**: MSW会自动拦截网络请求并返回mock数据
- **生产环境**: MSW不会启动，网络请求会正常发送到真实API

## 优势

1. **真实的网络行为**: 使用真正的fetch/axios请求
2. **开发友好**: 无需启动后端服务即可开发前端
3. **测试支持**: 可以在测试中使用相同的mock数据
4. **渐进迁移**: 可以逐步将mock API替换为真实API
