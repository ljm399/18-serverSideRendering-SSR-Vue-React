import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import request from '../../service/request.js'

export const fetchHomeInfo = createAsyncThunk('home/fetchHomeInfo', async () => {
  const data = await request.get('/info')
  return data
})

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    homeInfo: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeInfo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHomeInfo.fulfilled, (state, action) => {
        state.loading = false
        state.homeInfo = action.payload
      })
      .addCase(fetchHomeInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
  }
})

export const homeReducer = homeSlice.reducer
