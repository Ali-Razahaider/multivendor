import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage, HomePage, RegisterPage, ActivationPage } from './Routes';
import './App.css';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/activation/:activationToken"
          element={<ActivationPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
