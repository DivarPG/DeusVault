import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/startPage.css'
import pomydorImg from '../assets/pomydor.png';
import {Link} from "react-router-dom";

function StartPage() {

    return (
        <>
            <section id="center">
                <h1 className="main-title">DeusVault</h1>
                <hr/>
                <p className="slogan">Приложение для систематизации информации о коллекциях</p>
                <div className="slider-wrapper">
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={20}
                        slidesPerView={1}
                        pagination={{clickable: true}}
                        loop={true}
                    >
                        <SwiperSlide><img src={pomydorImg} className="slide-img"/></SwiperSlide>
                        <SwiperSlide><img src={pomydorImg} className="slide-img"/></SwiperSlide>
                        <SwiperSlide><img src={pomydorImg} className="slide-img"/></SwiperSlide>
                    </Swiper>
                </div>
                <hr/>
                <Link to="/registration" className="button-like regButton">
                    Регистрация
                </Link>
                <p className="subText">Уже есть аккаунт?</p>
                <Link to="/signIn" className="button-like signInButton">
                    Вход
                </Link>
                <hr/>
                <section className="description">
                    <h2>Ведите учет своих коллекций</h2>
                    <p>to be added...</p>
                </section>
                <footer>2026@DeusVault</footer>
            </section>

        </>
    )
}

export default StartPage
