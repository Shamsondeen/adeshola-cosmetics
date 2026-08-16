import { NavLink } from "react-router-dom";
export default function Sidebar({ onLogout }) {
  return <aside className="admin-sidebar"><div className="sidebar-header"><h3>Adeshola Cosmetics</h3></div><nav className="sidebar-nav"><ul>
    <li><NavLink to="/admin/dashboard">Dashboard</NavLink></li>
    <li><button onClick={onLogout} className="logout-btn">Logout</button></li>
  </ul></nav></aside>;
}
