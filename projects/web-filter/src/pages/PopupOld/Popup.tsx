import { useEffect } from 'react';

import './Popup.css';

export default function () {
  useEffect(() => {
    console.log('Hello from the popup!');
  }, []);

  return (
    <div className="container">
      <div className="header"></div>
      <img src="/coffee-filter.png" />
      <h1>Web Filter</h1>
      <p>by. Team Seoee - Interactive Study</p>
    </div>
  );
}
