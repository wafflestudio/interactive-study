import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from '../pages/Home';
import InsidePost from '../pages/InsidePost';
import InsideSans from '../pages/InsideSans';
import OutsidePost from '../pages/OutsidePost';
import OutsideSans from '../pages/OutsideSans';
import Receive from '../pages/Receive';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/i-sans" element={<InsideSans />} />
        <Route path="/o-sans" element={<OutsideSans />} />
        <Route path="/i-post" element={<InsidePost />} />
        <Route path="/o-post" element={<OutsidePost />} />
        <Route path="/receive" element={<Receive />} />
      </Routes>
    </BrowserRouter>
  );
}
