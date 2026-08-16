// components/admin/Header.jsx
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { admin } = useAuth();

  return (
    <header className="admin-header">
      <div className="header-content">
        <h1>Admin Dashboard</h1>
        <div className="admin-info">
          <span className="admin-name">{admin?.username}</span>
          <span className="admin-role">{admin?.role}</span>
        </div>
      </div>
    </header>
  );
}