import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from '../pages/Home';
import Sans from '../pages/Sans';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sans" element={<Sans />} />
      </Routes>
    </BrowserRouter>
  );
}
