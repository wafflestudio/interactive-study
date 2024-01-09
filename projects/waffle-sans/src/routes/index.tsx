import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from '../pages/Home';
import Post from '../pages/Post';
import Sans from '../pages/Sans';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sans" element={<Sans />} />
        <Route path="/post" element={<Post />} />
      </Routes>
    </BrowserRouter>
  );
}
