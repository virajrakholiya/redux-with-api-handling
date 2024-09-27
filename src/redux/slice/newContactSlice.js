import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addContact } from './contactSlice';


export const createContact = createAsyncThunk(
  'newContact/createContact',
  async (contactData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post('https://service.apikeeda.com/api/v1/contact-book', contactData, {
        headers: {
          'x-apikeeda-key': 'y1727425542060mkd173840921ty'
        }
      });
      dispatch(addContact(response.data.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const newContactSlice = createSlice({
  name: 'newContact',
  initialState: {
    status: 'idle',
    error: null,
    data: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createContact.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.data;
      })
      .addCase(createContact.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create contact';
      });
  },
});

export default newContactSlice.reducer;
