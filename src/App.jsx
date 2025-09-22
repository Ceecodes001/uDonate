import './App.css';
import ENTRY from './components/entry';
import DONATION from './components/donations/donations-page';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ENTRY />} />
        <Route path="/donation" element={<DONATION />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
