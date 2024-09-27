import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const deleteContact = createAsyncThunk(
  'deleteContact/deleteContact',
  async (contactId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`https://service.apikeeda.com/api/v1/contact-book/${contactId}`, {
        headers: {
          'x-apikeeda-key': 'y1727425542060mkd173840921ty'
        }
      });
      return { id: contactId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const deleteContactSlice = createSlice({
  name: 'deleteContact',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteContact.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteContact.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete contact';
      });
  },
});

export default deleteContactSlice.reducer;
