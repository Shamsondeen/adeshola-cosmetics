import React, { Component } from 'react'

// components/admin/AdminTable.jsx
export default function AdminTable({ admins, onDelete }) {
    return (
      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin._id}>
                <td>{admin.username}</td>
                <td className="capitalize">{admin.role.replace('-', ' ')}</td>
                <td>
                  <button 
                    onClick={() => onDelete(admin._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
