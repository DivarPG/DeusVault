import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/registerPage.css';
import '../components/appHeader.tsx';
import AppHeader from "../components/appHeader.tsx";
import Footer from "../components/footer.tsx";
import ButtonLike from "../components/buttonLike.tsx";
import FormInput from "../components/formInput.tsx";

function RegisterPage() {

    return (
        <>
            <section id="center">
                <AppHeader/>
                <div className="registration">
                    <div className="tab">
                        <div className="card registrationTab">
                            <h2> Регистрация</h2>
                        </div>
                    </div>
                    <form className="card registrationCard">
                        <FormInput label="Логин" id="login" type="text"
                                   desc="от 5 до 10 латинских символов"
                                   min={5} max={10}/>
                        <FormInput label="Пароль" id="password" type="password"
                                   desc="от 6 до 10 латинских символов и цифр"
                                   min={6} max={10}/>
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
