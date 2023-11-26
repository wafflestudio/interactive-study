import { useState } from 'react';

import LeonCanvas from './component/LeonCanvas';

function App() {
  const [text, setText] = useState('Leon Sans');
  return (
    <div>
      <LeonCanvas text={text} />
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </div>
  );
}

export default App;
