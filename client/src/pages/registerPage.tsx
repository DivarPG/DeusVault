import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/registerPage.css';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import AppHeader from '../components/appHeader';
import Footer from '../components/footer';
import ButtonLike from '../components/buttonLike';
import FormInput from '../components/formInput';
import {registerFetch} from '../api/auth/auth.api';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (username.length < 5 || username.length > 10) {
            setError('Логин должен быть от 5 до 10 символов');
            return;
        }
        if (password.length < 6 || password.length > 10) {
            setError('Пароль должен быть от 6 до 10 символов');
            return;
        }

        try {
            const response = await registerFetch(username, password);
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Ошибка регистрации');
            }
            navigate('/signIn', {state: {registered: true}});
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
                        <h2>Регистрация</h2>
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
                        Зарегистрироваться
                    </button>
                </form>
                <ButtonLike text="Войти" to="/signIn" subText="Уже есть аккаунт?" className="signIn"/>
            </div>
            <Footer/>
        </section>
    );
}

export default RegisterPage;