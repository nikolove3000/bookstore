import { books } from "../../data/books";
import useDust from "../../hooks/useDust";

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
}

const ROMANS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

const BookPanel = ({ carouselProps, dustCanvasId = "dust-book" }) => {
    const { current, slideAnimating, slideDir, coverScale, coverOpacity,
        changeBook, handleCoverClick, pauseAndReset, setIsPaused } = carouselProps;

    const book = books[current];

    useDust(dustCanvasId, hexToRgb(book.accent));

    return (
        <div className="flex flex-col items-center justify-center flex-1 relative border-r p-8"
            style={{ background: "#0F1720", borderColor: "#2a1a1a" }}>

            {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map((pos, i) => (
                <span key={i} className={`absolute ${pos} text-xs`}
                    style={{ color: book.accent, opacity: 0.8, fontSize: "15px" }}>✦</span>
            ))}

            <p style={{ color: book.accent, opacity: 0.8, fontSize: "20px" }}
                className="text-xs tracking-widest mb-3">— ✦ —</p>

            <div
                onMouseEnter={pauseAndReset}
                onMouseLeave={() => setIsPaused(false)}
                style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    transform: slideAnimating
                        ? `translateX(${slideDir === "next" ? -40 : 40}px)`
                        : "translateX(0)",
                    opacity: slideAnimating ? 0 : 1,
                    transition: "transform 0.2s ease, opacity 0.4s ease",
                }}>

                <p className="text-base italic text-center mb-3 tracking-wide"
                    style={{ color: book.titleColor }}>{book.title}</p>

                <div className="mb-3 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); handleCoverClick(); pauseAndReset(); }}
                    style={{
                        width: 180, borderRadius: "4px 10px 10px 4px",
                        border: `0.5px solid ${book.accent}`, overflow: "hidden",
                        transform: `scale(${coverScale})`, opacity: coverOpacity,
                        transition: "transform 0.25s ease, opacity 0.25s ease",
                    }}>
                    <img src={book.cover} alt={book.title} className="w-full h-auto" />
                </div>

                <div className="text-center" style={{ maxWidth: 210 }}>
                    <p className="text-3xl leading-none mb-1" style={{ color: book.accent }}>"</p>
                    <p className="text-sm italic leading-relaxed" style={{ color: book.titleColor }}>{book.quote}</p>
                    <p className="text-xs mt-1 tracking-wide" style={{ color: book.accent, opacity: 0.7 }}>{book.src}</p>
                </div>

                <div className="flex gap-4 justify-center mt-3">
                    {ROMANS.map((roman, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <div style={{
                                width: 10, height: 10, borderRadius: "50%",
                                background: i === current ? book.accent : "#2a1515",
                                border: i === current ? "none" : `0.5px solid ${book.accent}`,
                                opacity: i === current ? 1 : 0.5,
                                transition: "all 0.2s ease",
                            }} />
                            <span onClick={() => { changeBook(i); pauseAndReset(); }}
                                style={{
                                    fontSize: i === current ? "11px" : "9px",
                                    color: i === current ? book.accent : "#4a3030",
                                    cursor: "pointer", fontFamily: "Georgia, serif",
                                    transition: "all 0.2s ease", letterSpacing: "1px",
                                }}>{roman}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookPanel;