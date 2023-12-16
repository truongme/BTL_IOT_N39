import React, { useState, useEffect } from 'react';
import './Chatbot.css';
import { useShowIot } from '../show/ShowIotContext';

const ChatBot = () => {
  const { notification } = useShowIot();
  const [lastNotification, setLastNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const splitIntoSentences = (text) => {
    return text.split(/[.!?]/).filter(sentence => sentence.trim() !== '');
  };

  useEffect(() => {
    if (notification && notification !== lastNotification) {
      const receivedTime = new Date().toLocaleTimeString(); 

      const newNotificationList = splitIntoSentences(notification).map((sentence, index) => ({
        text: sentence,
        id: index,
        receivedTime: receivedTime, 
      }));

      setLastNotification(notification);
      setNotifications((prevNotifications) => [...prevNotifications, ...newNotificationList]);
    }
  }, [notification, lastNotification]);

  return (
    <div className='chatbox_ctn'>
      <div className='header_ctn'>
        <p>Chatbot tự động</p>
      </div>
      <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        {notifications.length > 0 ? (
          notifications.map(({ text, id, receivedTime }) => (
            <div key={id}>
              {text.startsWith('Đã') ? (
                <div>
                  <div className='time-ctn'>
                    <small className='time'>{receivedTime}</small>
                  </div>
                  <div className='notification'>{text}</div>
                </div>
              ) : (
                <div className='notification'>{text}</div>
              )}
            </div>
          ))
        ) : (
          <div className='notification'>No notification available</div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
