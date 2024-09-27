import { configureStore } from '@reduxjs/toolkit';
import contactsReducer from './../slice/contactSlice';
import newContactReducer from './../slice/newContactSlice';
import deleteContactReducer from './../slice/deleteContactSlice';
import updateContactReducer from './../slice/updateContactSlice';
import searchContactReducer from './../slice/searchContactSlice';

const store = configureStore({
  reducer: {
    contacts: contactsReducer,
    newContact: newContactReducer,
    deleteContact: deleteContactReducer,
    updateContact: updateContactReducer,
    searchContacts: searchContactReducer,
  },
});

export default store;