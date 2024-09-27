import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
;

export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://service.apikeeda.com/api/v1/contact-book', {
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

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    status: 'idle',
    error: null,
    data: [],
  },
  reducers: {
    addContact: (state, action) => {
      state.data.unshift(action.payload);
    },
    removeContact: (state, action) => {
      state.data = state.data.filter(contact => contact._id !== action.payload);
    },
    updateContactInState: (state, action) => {
      const index = state.data.findIndex(contact => contact._id === action.payload._id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.data;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch contacts';
      });
  },
});

export const { addContact, removeContact, updateContactInState } = contactsSlice.actions;
export default contactsSlice.reducer;