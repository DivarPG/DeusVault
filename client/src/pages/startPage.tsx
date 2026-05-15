import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/startPage.css'
import pomydorImg from '../assets/pomydor.png';
import AppHeader from "../components/appHeader.tsx";
import Footer from "../components/footer.tsx";
import ButtonLike from "../components/buttonLike.tsx";

function StartPage() {

    return (
        <>
            <section id="center">
                <AppHeader />
                <p className="slogan">Приложение для систематизации информации о коллекциях</p>
                <div className="slider-wrapper">
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={20}
                        slidesPerView={1}
                        pagination={{clickable: true}}
                        loop={true}
                    >
                        <SwiperSlide><img src={pomydorImg} className="slide-img" alt=""/></SwiperSlide>
                        <SwiperSlide><img src={pomydorImg} className="slide-img" alt=""/></SwiperSlide>
                        <SwiperSlide><img src={pomydorImg} className="slide-img" alt=""/></SwiperSlide>
                    </Swiper>
                </div>
                <hr/>
                <ButtonLike text="Регистрация" to="/registration" className="regButton"/>
                <ButtonLike text="Войти" to="/signIn" subText="Уже есть аккаунт?" className="signInButton"/>
                <hr/>
                <section className="description">
                    <h2>Ведите учет своих коллекций</h2>
                    <p>to be added...</p>
                </section>
                <Footer/>
            </section>

        </>
    )
}

export default StartPage
