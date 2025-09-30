// 已迁移到 RTK Query。保留文件以避免潜在导入报错，可后续删除。
export default function usePlayLists() {
    if (process.env.NODE_ENV === 'development') {
        console.warn('usePlayLists 已弃用，请使用 useGetPlaylistsQuery (RTK Query)');
    }
    return null;
}