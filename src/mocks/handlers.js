import { http, HttpResponse } from 'msw';

// 模拟播放列表数据
const mockPlaylists = [
  {
    id: 1,
    name: "我的收藏",
    description: "收藏的好听歌曲",
    songs: [
      { id: 1, title: "歌曲1", artist: "歌手1" },
      { id: 2, title: "歌曲2", artist: "歌手2" },
    ]
  },
  {
    id: 2,
    name: "摇滚精选",
    description: "精选摇滚音乐",
    songs: [
      { id: 3, title: "摇滚歌曲1", artist: "摇滚歌手1" },
      { id: 4, title: "摇滚歌曲2", artist: "摇滚歌手2" },
    ]
  },
  {
    id: 3,
    name: "流行金曲",
    description: "热门流行歌曲",
    songs: [
      { id: 5, title: "流行歌曲1", artist: "流行歌手1" },
      { id: 6, title: "流行歌曲2", artist: "流行歌手2" },
    ]
  }
];

export const handlers = [
  // 处理 GET /playlists 请求
  http.get('/playlists', ({ request }) => {
    // 可以根据请求参数返回不同的数据
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit');
    
    let response = mockPlaylists;
    
    if (limit) {
      response = mockPlaylists.slice(0, parseInt(limit));
    }
    
    // 模拟网络延迟
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json(response));
      }, 500); // 500ms延迟
    });
  }),

  // 处理单个播放列表的请求
  http.get('/playlists/:id', ({ params }) => {
    const playlist = mockPlaylists.find(p => p.id === parseInt(params.id));
    
    if (!playlist) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(playlist);
  }),

  // 处理创建新播放列表
  http.post('/playlists', async ({ request }) => {
    const newPlaylist = await request.json();
    const playlist = {
      id: mockPlaylists.length + 1,
      ...newPlaylist,
      songs: []
    };
    
    mockPlaylists.push(playlist);
    
    return HttpResponse.json(playlist, { status: 201 });
  }),
];
