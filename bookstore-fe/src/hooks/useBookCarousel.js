import { useState, useRef, useEffect } from "react";

const useBookCarousel = (totalBooks) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideAnimating, setSlideAnimating] = useState(false);
  const [slideDir, setSlideDir] = useState("next");
  const [coverScale, setCoverScale] = useState(1);
  const [coverOpacity, setCoverOpacity] = useState(1);

  const currentRef = useRef(0);
  const slideAnimatingRef = useRef(false);
  const coverAnimatingRef = useRef(false);
  const pauseTimerRef = useRef(null);

  // sync currentRef
  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  // changeBook — slide logic
  const changeBook = (directionOrIndex) => {
    if (slideAnimatingRef.current || coverAnimatingRef.current) return;

    let newIndex;
    if (typeof directionOrIndex === "number") {
      const dir = directionOrIndex > currentRef.current ? "next" : "prev";
      setSlideDir(dir);
      newIndex = directionOrIndex;
    } else {
      setSlideDir(directionOrIndex);
      newIndex =
        directionOrIndex === "next"
          ? (currentRef.current + 1) % totalBooks
          : (currentRef.current - 1 + totalBooks) % totalBooks;
    }

    setSlideAnimating(true);
    slideAnimatingRef.current = true;

    setTimeout(() => {
      setCurrent(newIndex);
      setSlideAnimating(false);
      slideAnimatingRef.current = false;
    }, 400);
  };

  // handleCoverClick — zoom logic, không trigger slide
  const handleCoverClick = () => {
    if (coverAnimatingRef.current || slideAnimatingRef.current) return;

    coverAnimatingRef.current = true;
    setCoverScale(0);
    setCoverOpacity(0);

    setTimeout(() => {
      setCurrent((currentRef.current + 1) % totalBooks);
      setCoverScale(1);
      setCoverOpacity(1);

      setTimeout(() => {
        coverAnimatingRef.current = false;
      }, 250);
    }, 250);
  };

  // Auto-play
  useEffect(() => {
    if (isPaused) return;

    const autoPlayTimer = setInterval(() => {
      if (slideAnimatingRef.current || coverAnimatingRef.current) return;
      const next = (currentRef.current + 1) % totalBooks;
      setSlideDir("next");
      setSlideAnimating(true);
      slideAnimatingRef.current = true;
      setTimeout(() => {
        setCurrent(next);
        setSlideAnimating(false);
        slideAnimatingRef.current = false;
      }, 400);
    }, 5000);

    return () => clearInterval(autoPlayTimer);
  }, [isPaused, totalBooks]);

  // Pause and reset
  const pauseAndReset = () => {
    setIsPaused(true);
    clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 8000);
  };

  return {
    current,
    isPaused,
    slideAnimating,
    slideDir,
    coverScale,
    coverOpacity,
    changeBook,
    handleCoverClick,
    pauseAndReset,
    setIsPaused,
  };
};

export default useBookCarousel;