const NotificationBadge = ({ count }) => {
    return (
      <span className="notification-badge">
        {count > 9 ? '9+' : count}
      </span>
    );
  };
  
  export default NotificationBadge;