import React from "react";
import {useEffect, useState } from 'react';
import './App.css';

function MyRow({ id, name, email, phone, handleMoreInfo, handleEdit, handleDelete }) {
  const handleMoreInfoClick = () => {
    handleMoreInfo(id);
  };

  const handleEditClick = () => {
    handleEdit(id);
  };

  const handleDeleteClick = () => {
    handleDelete(id);
  };

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{email}</td>
      <td>{phone}</td>
      <td><button onClick={handleMoreInfoClick}>MORE</button></td>
      <td><button onClick={handleEditClick}>EDIT</button></td>
      <td><button onClick={handleDeleteClick}>DELETE</button></td>
    </tr>
  );
}

const URL = 'http://localhost:8080/api/users';

function MyTable() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`${URL}/${userId}`);
      const data = await response.json();
      setSelectedUser(data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleEditUser = async (userId) => {
    setEditingUser(userId);
    const userToEdit = users.find(user => user.id === userId);
    setEditFormData({
      firstName: userToEdit.firstName,
      lastName: userToEdit.lastName,
      email: userToEdit.email,
      phone: userToEdit.phone
    });
  };

  const handleDeleteUser = async (userId) => {
    try {
      await fetch(`${URL}/${userId}`, {
        method: 'DELETE',
      });
      setUsers(users.filter(user => user.id !== userId));
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setEditingUser(null);
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL}/${editingUser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(user => user.id === editingUser ? updatedUser : user));
        setEditingUser(null);
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>User name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <MyRow
              key={user.id}
              id={user.id}
              name={user.firstName}
              email={user.email}
              phone={user.phone}
              handleMoreInfo={() => fetchUserData(user.id)}
              handleEdit={handleEditUser}
              handleDelete={handleDeleteUser}
            />
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className="notification">
          <button className="close" onClick={handleCloseModal}>&times;</button>
          <h2>User Info</h2>
          <p>First Name: {selectedUser.firstName}</p>
          <p>Last Name: {selectedUser.lastName}</p>
          <p>Email: {selectedUser.email}</p>
          <p>Phone: {selectedUser.phone}</p>
        </div>
      )}

      {editingUser && (
        <form className="edit-form" onSubmit={handleEditFormSubmit}>
          <h2>Edit User</h2>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={editFormData.firstName}
              onChange={handleEditFormChange}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={editFormData.lastName}
              onChange={handleEditFormChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={editFormData.email}
              onChange={handleEditFormChange}
            />
          </label>
          <label>
            Phone:
            <input
              type="tel"
              name="phone"
              value={editFormData.phone}
              onChange={handleEditFormChange}
            />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={handleCloseModal}>Cancel</button>
        </form>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <h1 className="h1-header">202 група</h1>
      <div className="down_header"> факультету Інформаційних технологій </div>
      <div className="table">
        <MyTable />
      </div>
    </div>
  );
}

export default App;
