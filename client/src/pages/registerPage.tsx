import 'swiper/css';
import 'swiper/css/pagination';
import {Link} from "react-router-dom";
import '../styles/registerPage.css';

function RegisterPage() {

    return (
        <>
            <section id="center">
                <h1 className="main-title">DeusVault</h1>
                <hr/>
                <div className="registration">
                    <div className="tab">
                        <div className="card registrationTab">
                            <h2> Регистрация</h2>
                        </div>
                    </div>
                    <form className="card registrationCard">
                        <div className="regLabels">
                            <label htmlFor="login">Логин</label>
                            <p>от 5 до 10 латинских символов</p>
                        </div>
                        <input className="input" id="login" type="text"
                               minLength={5} maxLength={10} required={true}/>
                        <div className="regLabels">
                            <label htmlFor="password">Пароль</label>
                            <p>от 6 до 10 латинских символов и цифр</p>
                        </div>
                        <input className="input" id="password" type="password"
                               minLength={6} maxLength={10} required={true}/>
                        <button type={"submit"} className="button-like regButton reg">Зарегистрироваться</button>
                    </form>
                    <p id="subText" className="subText">
                        Уже есть аккаунт?
                    </p>
                    <Link className="button-like signIn" to="/signIn">Войти</Link>
                </div>
                <footer>2026@DeusVault</footer>
            </section>

        </>
    )
}

export default RegisterPage
