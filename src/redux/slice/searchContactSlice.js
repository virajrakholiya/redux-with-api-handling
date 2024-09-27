import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const searchContacts = createAsyncThunk(
  'searchContacts/searchContacts',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://service.apikeeda.com/api/v1/contact-book/search?search=${query}`, {
        headers: {
          'x-apikeeda-key': 'y1727425542060mkd173840921ty',
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const searchContactSlice = createSlice({
  name: 'searchContacts',
  initialState: {
    status: 'idle',
    error: null,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchContacts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.data;
      })
      .addCase(searchContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to search contacts';
      });
  },
});

export default searchContactSlice.reducer;
