import { Routes, Route } from 'react-router-dom';
import StartPage from './pages/startPage';
import SignInPage from './pages/signInPage';
import RegisterPage from './pages/registerPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/signIn" element={<SignInPage />} />
            <Route path="/registration" element={<RegisterPage />} />
        </Routes>
    );
}

export default App;