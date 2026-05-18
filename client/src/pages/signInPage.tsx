import 'swiper/css';
import 'swiper/css/pagination';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import AppHeader from '../components/appHeader';
import Footer from '../components/footer';
import FormInput from '../components/formInput';
import {loginFetch} from '../api/auth/auth.api';
import {STORAGE_KEYS} from '../utils/constants';

function SignInPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            const response = await loginFetch(username, password);
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Ошибка входа');
            }
            const data = await response.json();
            localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, data.access_token);
            navigate('/collections');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Неизвестная ошибка');
            }
        }
    };

    return (
        <section id="center">
            <AppHeader/>
            <div className="registration">
                <div className="tab">
                    <div className="card registrationTab">
                        <h2>Вход</h2>
                    </div>
                </div>
                <form className="card registrationCard" onSubmit={handleSubmit}>
                    <FormInput
                        label="Логин"
                        id="login"
                        type="text"
                        desc="от 5 до 10 латинских символов"
                        min={5}
                        max={10}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required ={true}
                    />
                    <FormInput
                        label="Пароль"
                        id="password"
                        type="password"
                        desc="от 6 до 10 латинских символов и цифр"
                        min={6}
                        max={10}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required ={true}
                    />
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <button type="submit" className="button-like regButton reg">
                        Войти
                    </button>
                </form>
            </div>
            <Footer/>
        </section>
    );
}

export default SignInPage;