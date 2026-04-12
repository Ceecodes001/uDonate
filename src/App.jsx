import './App.css';
import ENTRY from './components/entry';
import DONATION from './components/donations/donations-page';
import ADMIN from './components/donations/admin';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ENTRY />} />
        <Route path="/donation" element={<DONATION />} />
        <Route path="/admin/dashboard1" element={<ADMIN />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
