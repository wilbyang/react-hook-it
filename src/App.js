import logo from './logo.svg';
import './App.css';
import useWindowSize from './useWindowSize';
import usePlayLists from './usePlayLists';
function App() {
  const size = useWindowSize();
  const playLists = usePlayLists();
  console.log(playLists);
  console.log(size);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>React Hook It - Mock数据示例</h1>
        <div style={{ marginTop: '20px' }}>
          <h2>窗口大小: {size ? `${size.width}x${size.height}` : 'Loading...'}</h2>
          
          <h2>播放列表 (Mock数据):</h2>
          {playLists ? (
            <div style={{ textAlign: 'left', maxWidth: '500px' }}>
              {playLists.map(playlist => (
                <div key={playlist.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                  <h3>{playlist.name}</h3>
                  <p>{playlist.description}</p>
                  <ul>
                    {playlist.songs.map(song => (
                      <li key={song.id}>{song.title} - {song.artist}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>加载中...</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
