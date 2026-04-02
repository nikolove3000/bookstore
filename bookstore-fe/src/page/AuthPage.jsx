import { useState, useEffect } from "react";
import { books } from "../data/books";
import BookPanel from "../component/auth/BookPanel";
import LoginForm from "../component/auth/LoginForm";
import RegisterForm from "../component/auth/RegisterForm";
import { useNavigate, useLocation } from "react-router-dom";
import useBookCarousel from "../hooks/useBookCarousel";

const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isFlipped, setIsFlipped] = useState(location.pathname === "/register");
    const [displayedBg, setDisplayedBg] = useState(books[0].bg);
    const [bgOpacity, setBgOpacity] = useState(1);

    const carouselProps = useBookCarousel(12);

    const { current } = carouselProps;

    const flipToRegister = () => {
        setIsFlipped(true);
        navigate("/register");
    };

    const flipToLogin = () => {
        setIsFlipped(false);
        navigate("/login");
    };

    useEffect(() => {
        let mounted = true;
        const timer1 = setTimeout(() => {
            if (mounted) setBgOpacity(0);
        }, 0);
        const timer2 = setTimeout(() => {
            if (mounted) {
                setDisplayedBg(books[current].bg);
                setBgOpacity(1);
            }
        }, 200);
        return () => {
            mounted = false;
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [current]);

    useEffect(() => {
        const handlePopState = () => {
            setIsFlipped(window.location.pathname === "/register");
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const sharedProps = { current, displayedBg, bgOpacity };

    return (
        <div style={{
            width: "100vw", height: "100vh",
            background: "#0d0b0b",
            fontFamily: "Georgia, serif",
            position: "relative",
        }}>
            <div style={{ perspective: "1400px", width: "100%", height: "100%" }}>
                <div style={{
                    width: "100%", height: "100%",
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transition: "transform 0.9s cubic-bezier(0.645, 0.045, 0.355, 1.000)",
                    position: "relative",
                    willChange: "transform",
                }}>

                    {/* FRONT — Login */}
                    <div style={{
                        position: "absolute", inset: 0,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        display: "flex",
                        pointerEvents: isFlipped ? "none" : "auto",
                    }}>
                        <BookPanel carouselProps={carouselProps} dustCanvasId="dust-login" />
                        <LoginForm {...sharedProps} onFlip={flipToRegister} />
                    </div>

                    {/* BACK — Register */}
                    <div style={{
                        position: "absolute", inset: 0,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        display: "flex",
                        pointerEvents: isFlipped ? "auto" : "none",
                    }}>
                        <RegisterForm {...sharedProps} onFlip={flipToLogin} />
                        <BookPanel carouselProps={carouselProps} dustCanvasId="dust-register" />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuthPage;