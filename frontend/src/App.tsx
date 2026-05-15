import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage, HomePage, RegisterPage } from './Routes';
import './App.css';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
