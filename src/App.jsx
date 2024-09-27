import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts, removeContact, updateContactInState } from "./redux/slice/contactSlice";
import { createContact } from "./redux/slice/newContactSlice";
import { deleteContact } from "./redux/slice/deleteContactSlice";
import { updateContact } from "./redux/slice/updateContactSlice";
import { searchContacts } from "./redux/slice/searchContactSlice";

function App() {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contacts);
  const newContact = useSelector((state) => state.newContact);
  const deleteContactState = useSelector((state) => state.deleteContact);
  const updateContactState = useSelector((state) => state.updateContact);
  const searchContactState = useSelector((state) => state.searchContacts);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNo: "",
    email: "",
    nickName: "",
  });
  const [editingContact, setEditingContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingContact) {
      dispatch(updateContact({ id: editingContact._id, contactData: formData })).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          dispatch(updateContactInState(result.payload.data));
          setEditingContact(null);
          setFormData({
            firstName: "",
            lastName: "",
            mobileNo: "",
            email: "",
            nickName: "",
          });
        } else {
          // Display error message to the user
          alert(`Failed to update contact: ${result.error.message}`);
        }
      });
    } else {
      dispatch(createContact(formData));
      setFormData({
        firstName: "",
        lastName: "",
        mobileNo: "",
        email: "",
        nickName: "",
      });
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteContact(id)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(removeContact(id));
      }
    });
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      mobileNo: contact.mobileNo,
      email: contact.email,
      nickName: contact.nickName,
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== "") {
      dispatch(searchContacts(e.target.value));
    } else {
      dispatch(fetchContacts());
    }
  };

  const displayedContacts = searchQuery.trim() !== "" ? searchContactState.data : contacts.data;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Contact Book</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search contacts..."
        className="mb-4 w-full p-2 border rounded"
      />
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobileNo">
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobileNo"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            placeholder="Enter mobile number"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nickName">
            Nickname
          </label>
          <input
            type="text"
            id="nickName"
            name="nickName"
            value={formData.nickName}
            onChange={handleChange}
            placeholder="Enter nickname"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            {editingContact ? "Update Contact" : "Add Contact"}
          </button>
        </div>
      </form>

      {newContact.status === "loading" && <p>Creating contact...</p>}
      {newContact.status === "failed" && (
        <p className="text-red-500">
          Error:{" "}
          {typeof newContact.error === "string"
            ? newContact.error
            : JSON.stringify(newContact.error)}
        </p>
      )}

      <h2 className="text-xl font-bold mb-4">All Contacts</h2>
      {contacts.status === "loading" && <p>Loading contacts...</p>}
      {contacts.status === "failed" && (
        <p className="text-red-500">
          Error:{" "}
          {typeof contacts.error === "string"
            ? contacts.error
            : JSON.stringify(contacts.error)}
        </p>
      )}
      {searchContactState.status === "loading" && <p>Searching contacts...</p>}
      {searchContactState.status === "failed" && (
        <p className="text-red-500">
          Error:{" "}
          {typeof searchContactState.error === "string"
            ? searchContactState.error
            : JSON.stringify(searchContactState.error)}
        </p>
      )}
      {contacts.status === "succeeded" && displayedContacts.length > 0 ? (
        <ul className="space-y-4">
          {displayedContacts.map((contact) => (
            <li
              key={contact._id}
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <p className="font-bold text-lg">{contact.firstName} {contact.lastName}</p>
                <p className="text-gray-600">{contact.email}</p>
                <p className="text-gray-600">{contact.mobileNo}</p>
                {contact.nickName && <p className="text-gray-600">Nickname: {contact.nickName}</p>}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(contact)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit contact"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete contact"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No contacts found.</p>
      )}
      {deleteContactState.status === "loading" && <p>Deleting contact...</p>}
      {deleteContactState.status === "failed" && (
        <p className="text-red-500">
          Error deleting contact:{" "}
          {typeof deleteContactState.error === "string"
            ? deleteContactState.error
            : JSON.stringify(deleteContactState.error)}
        </p>
      )}
      {updateContactState.status === "loading" && <p>Updating contact...</p>}
      {updateContactState.status === "failed" && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold mb-4">Error Updating Contact</h3>
            <p className="text-red-500 mb-4">
              {typeof updateContactState.error === "string"
                ? updateContactState.error
                : JSON.stringify(updateContactState.error)}
            </p>
            <button
              onClick={() => dispatch()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
