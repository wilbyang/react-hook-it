import logo from './logo.svg';
import './App.css';
import useWindowSize from './useWindowSize';
import { useGetPlaylistsQuery, useCreatePlaylistMutation } from './services/playlistsApi';
function App() {
  const size = useWindowSize();
  const { data: playLists, isLoading, isError, error, refetch } = useGetPlaylistsQuery();
  const [createPlaylist, { isLoading: creating }] = useCreatePlaylistMutation();

  const handleCreate = async () => {
    try {
      await createPlaylist({ name: '新的播放列表', description: '描述', songs: [] }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>React Hook It - RTK Query 示例</h1>
        <div style={{ marginTop: '20px' }}>
          <h2>窗口大小: {size ? `${size.width}x${size.height}` : 'Loading...'}</h2>

          <h2 style={{ marginTop: '16px' }}>播放列表 (RTK Query + MSW)</h2>
          <div style={{ marginBottom: '12px' }}>
            <button onClick={() => refetch()} disabled={isLoading} style={{ marginRight: 8 }}>刷新</button>
            <button onClick={handleCreate} disabled={creating}>{creating ? '创建中...' : '新增播放列表'}</button>
          </div>
          {isLoading && <p>加载中...</p>}
          {isError && <p style={{ color: 'red' }}>加载失败: {error?.status || ''}</p>}
          {playLists && (
            <div style={{ textAlign: 'left', maxWidth: '560px' }}>
              {playLists.map((playlist) => (
                <div key={playlist.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                  <h3>{playlist.name}</h3>
                  <p style={{ marginTop: 4 }}>{playlist.description}</p>
                  <ul style={{ paddingLeft: 20 }}>
                    {playlist.songs.map((song) => (
                      <li key={song.id}>{song.title} - {song.artist}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
