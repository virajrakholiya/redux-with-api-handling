import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateContact = createAsyncThunk(
  "updateContact/updateContact",
  async ({ id, contactData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `https://service.apikeeda.com/api/v1/contact-book/${id}`,
        contactData,
        {
          headers: {
            "x-apikeeda-key": "y1727425542060mkd173840921ty",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const updateContactSlice = createSlice({
  name: "updateContact",
  initialState: {
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateContact.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateContact.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update contact";
      });
  },
});

export default updateContactSlice.reducer;
