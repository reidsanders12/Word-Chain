// MessageModal.js

import React, { useEffect } from 'react';
import './MessageModel.css';

const MessageModel = ({ message, onClose }) => {
  // Use useEffect to automatically close the modal after a certain time
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 1000); // Close the modal after 3 seconds (adjust as needed)

    return () => clearTimeout(timeout); // Cleanup the timeout on unmount
  }, [onClose]);

  return (
    <div className="message-modal">
        <p>{message}</p>
    </div>
  );
};

export default MessageModel;
