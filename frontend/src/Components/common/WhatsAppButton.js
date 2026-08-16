import React from 'react';


function WhatsAppButton({ phoneNumber = "2348000000000" }) {
  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  return (
    <div className="whatsapp-button" onClick={handleClick}>
      <i className="fab fa-whatsapp"></i>
    </div>
  );
}

export default WhatsAppButton;