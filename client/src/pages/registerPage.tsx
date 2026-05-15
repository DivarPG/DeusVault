import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/registerPage.css';
import '../components/appHeader.tsx';
import AppHeader from "../components/appHeader.tsx";
import Footer from "../components/footer.tsx";
import ButtonLike from "../components/buttonLike.tsx";

function RegisterPage() {

    return (
        <>
            <section id="center">
                <AppHeader />
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
                    <ButtonLike text="Войти" to="/signIn" subText="Уже есть аккаунт?" className="signIn"/>
                </div>
                <Footer/>
            </section>

        </>
    )
}

export default RegisterPage
