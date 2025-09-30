import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// RTK Query API slice for playlists
export const playlistsApi = createApi({
  reducerPath: 'playlistsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Playlists'],
  endpoints: (builder) => ({
    getPlaylists: builder.query({
      query: (limit) => (limit ? `playlists?limit=${limit}` : 'playlists'),
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
      invalidatesTags: [{ type: 'Playlists', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPlaylistsQuery,
  useGetPlaylistQuery,
  useCreatePlaylistMutation,
} = playlistsApi;
