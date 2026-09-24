import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PreferencesPage from './pages/PreferencesPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/preferences" element={<PreferencesPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
