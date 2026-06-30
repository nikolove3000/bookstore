import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bookApi from "../api/bookApi";
import { ShelfRow } from "../component/ShelfBook";
import { useCart } from "../context/CartContext";
import reviewApi from "../api/reviewApi";

function Stars({ rating = 0 }) {
  const full = Math.round(rating);
  return (
    <span style={{ color: "#c9a84c", letterSpacing: "1px" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ opacity: i <= full ? 1 : 0.25 }}>★</span>
      ))}
    </span>
  );
}

export default function BookDetailPage() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [eligibility, setEligibility] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    setImgError(false);
    setQty(1);
    setAdded(false);

    bookApi.getById(id).then(res => {
      setBook(res.data);

      Promise.all([
        bookApi.getRelated(id, 6).catch(() => ({ data: [] })),
        bookApi.getReviews(id, { page: 0, size: 10 }).catch(() => ({ data: { content: [] } })),
        user ? reviewApi.checkEligibility(id).catch(() => ({ data: null })) : Promise.resolve({ data: null }),
      ]).then(([relRes, revRes, eligRes]) => {
        setRelated(relRes.data.map((b, i) => ({
          ...b,
          author: b.authorName,
          cover: b.coverUrl,
          price: parseFloat(b.price),
          tag: b.category || "Fiction",
          isNew: i < 2,
        })));
        setReviews(revRes.data.content ?? []);
        setEligibility(eligRes.data);
        if (eligRes.data?.hasReviewed && eligRes.data.myReview) {
          setReviewRating(eligRes.data.myReview.rating);
          setReviewComment(eligRes.data.myReview.comment ?? "");
        }
      });
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (!inStock || adding) return;
    setAdding(true);
    try {
      await addItem(book.id, qty);   // ← đổi từ cartApi.addItem(...)
      setAdded(true);
      setBook(prev => ({ ...prev, stockQuantity: prev.stockQuantity - qty }));
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setBook(prev => ({ ...prev, stockQuantity: prev.stockQuantity + qty })); // rollback
      alert(err.response?.data?.message || "Could not add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleSubmitReview = async () => {
    setSubmittingReview(true);
    try {
      let res;
      if (eligibility.hasReviewed) {
        res = await reviewApi.update(eligibility.myReview.id, reviewRating, reviewComment);
      } else {
        res = await reviewApi.create(id, reviewRating, reviewComment);
      }
      setEligibility(prev => ({ ...prev, hasReviewed: true, canReview: false, myReview: res.data }));
      const eligRes = await reviewApi.checkEligibility(id);
      setEligibility(eligRes.data);
      const revRes = await bookApi.getReviews(id, { page: 0, size: 10 });
      setReviews(revRes.data.content ?? []);
      setShowReviewForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Could not submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!window.confirm("Delete your review?")) return;
    try {
      await reviewApi.remove(eligibility.myReview.id);
      const eligRes = await reviewApi.checkEligibility(id);
      setEligibility(eligRes.data);
      const revRes = await bookApi.getReviews(id, { page: 0, size: 10 });
      setReviews(revRes.data.content ?? []);
      setReviewRating(5);
      setReviewComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete review");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0b0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 11, letterSpacing: "3px", color: "rgba(201,168,76,0.45)", fontFamily: "Georgia,serif", textTransform: "uppercase" }}>✦ &nbsp;Loading&nbsp; ✦</span>
      </div>
    );
  }

  if (!book) return null;

  const inStock = book.stockQuantity != null && book.stockQuantity > 0;
  const primaryCategory = book.categories?.[0]?.name ?? "Fiction";

  return (
    <>
      <style>{`
        .bd-root{min-height:100vh;background:#0d0b0b;font-family:Georgia,serif;color:rgba(255,245,230,0.85);padding:120px 3rem 4rem;}
        .bd-breadcrumb{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.5);margin-bottom:2rem;max-width:1300px;margin-left:auto;margin-right:auto;}
        .bd-breadcrumb a{color:rgba(201,168,76,0.5);text-decoration:none;}
        .bd-breadcrumb a:hover{color:rgba(201,168,76,0.8);}
        .bd-breadcrumb span.sep{color:rgba(201,168,76,0.25);margin:0 6px;}
        .bd-breadcrumb span.current{color:rgba(201,168,76,0.8);}

        .bd-top{display:grid;grid-template-columns:380px 1fr;gap:3.5rem;max-width:1300px;margin:0 auto 5rem;align-items:start;}

        .bd-cover-panel{position:relative;background:#0F1720;border:0.5px solid rgba(201,168,76,0.14);padding:2.5rem;display:flex;align-items:center;justify-content:center;}
        .bd-cover-frame{position:relative;padding:14px;}
        .bd-cover-img{width:260px;height:auto;display:block;border:0.5px solid rgba(201,168,76,0.4);box-shadow:-5px 5px 0 rgba(0,0,0,0.5),0 20px 50px rgba(0,0,0,0.6);}
        .bd-cover-fallback{width:260px;height:390px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:linear-gradient(160deg,#14171c 0%,#0c0a0a 100%);border:0.5px solid rgba(201,168,76,0.25);}

        .bd-tag{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.6);font-style:italic;margin-bottom:14px;}
        .bd-title{font-size:38px;font-weight:normal;line-height:1.1;color:rgba(255,245,230,0.93);margin-bottom:10px;letter-spacing:0.3px;}
        .bd-author{font-size:15px;font-style:italic;color:rgba(201,168,76,0.75);margin-bottom:18px;letter-spacing:0.5px;}

        .bd-rating-row{display:flex;align-items:center;gap:12px;margin-bottom:24px;}
        .bd-rating-text{font-size:12px;color:rgba(201,168,76,0.65);letter-spacing:0.5px;}

        .bd-divider{display:flex;align-items:center;gap:10px;margin:20px 0;}
        .bd-divider-line{flex:1;height:0.5px;background:rgba(201,168,76,0.15);}
        .bd-divider-gem{font-size:10px;color:rgba(201,168,76,0.4);}

        .bd-price-row{display:flex;align-items:baseline;gap:16px;margin-bottom:20px;}
        .bd-price{font-size:28px;color:#c9a84c;letter-spacing:1px;}
        .bd-stock{font-size:13px;letter-spacing:1.5px;text-transform:uppercase;font-style:italic;}
        .bd-stock.in{color:rgba(201,168,76,0.85);}
        .bd-stock.out{color:#c0392b;}

        .bd-buy-row{display:flex;align-items:center;gap:16px;margin-bottom:28px;}
        .bd-qty{display:flex;align-items:center;border:0.5px solid rgba(201,168,76,0.25);}
        .bd-qty button{width:32px;height:36px;background:none;border:none;color:rgba(201,168,76,0.6);cursor:pointer;font-size:14px;font-family:Georgia,serif;transition:color 0.2s;}
        .bd-qty button:hover{color:#c9a84c;}
        .bd-qty button:disabled{opacity:0.25;cursor:default;}
        .bd-qty span{width:36px;text-align:center;font-size:13px;color:rgba(255,245,230,0.8);}
        .bd-add-btn{background:#1a0808;border:0.5px solid #8b2020;padding:11px 28px;font-family:Georgia,serif;font-size:11px;letter-spacing:3px;color:#c0392b;text-transform:uppercase;cursor:pointer;transition:all 0.3s;}
        .bd-add-btn:hover{background:#2a1010;border-color:#c9a84c;color:#c9a84c;}
        .bd-add-btn.added{border-color:#c9a84c;color:#c9a84c;background:rgba(201,168,76,0.08);}
        .bd-add-btn:disabled{opacity: 0.4;cursor: not-allowed;}

        .bd-desc{font-size:14px;line-height:1.85;color:rgba(255,245,230,0.78);max-width:560px;margin-bottom:24px;font-style:italic;}

        .bd-meta-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px 24px;max-width:480px;}
        .bd-meta-item{display:flex;flex-direction:column;gap:3px;}
        .bd-meta-label{font-size:8px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.4);}
        .bd-meta-value{font-size:13px;color:rgba(255,245,230,0.78);font-style:italic;}

        .bd-cat-tags{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;}
        .bd-cat-tag{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(201,168,76,0.65);border:0.5px solid rgba(201,168,76,0.25);padding:4px 10px;text-decoration:none;transition:all 0.2s;}
        .bd-cat-tag:hover{color:#c9a84c;border-color:rgba(201,168,76,0.5);}

        .bd-section{max-width:1300px;margin:0 auto 5rem;}
        .bd-section-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2rem;border-bottom:0.5px solid rgba(201,168,76,0.1);padding-bottom:1rem;}
        .bd-section-kicker{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(201,168,76,0.55);margin-bottom:6px;font-style:italic;}
        .bd-section-title{font-size:22px;font-weight:normal;color:rgba(255,245,230,0.85);}
        .bd-section-title em{font-style:italic;color:rgba(201,168,76,0.62);}

        .bd-review-list{display:flex;flex-direction:column;gap:0;}
        .bd-review-item{padding:1.4rem 0;border-bottom:0.5px solid rgba(201,168,76,0.08);}
        .bd-review-item:last-child{border-bottom:none;}
        .bd-review-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
        .bd-review-name{font-size:14px;color:rgba(255,245,230,0.85);letter-spacing:0.3px;}
        .bd-review-date{font-size:11px;color:rgba(201,168,76,0.55);font-style:italic;}
        .bd-review-comment{font-size:13.5px;line-height:1.8;color:rgba(255,245,230,0.76);font-style:italic;}

        .bd-empty-state{text-align:center;padding:3rem 0;color:rgba(201,168,76,0.48);font-style:italic;font-size:13px;}

        .bd-write-review-btn{background:none;border:0.5px solid rgba(201,168,76,0.35);padding:8px 18px;font-family:Georgia,serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.7);cursor:pointer;transition:all 0.25s;}
        .bd-write-review-btn:hover{border-color:#c9a84c;color:#c9a84c;}
        .bd-review-actions{display:flex;gap:10px;}
        .bd-edit-review-btn,.bd-delete-review-btn{background:none;border:0.5px solid rgba(201,168,76,0.25);padding:7px 16px;font-family:Georgia,serif;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all 0.25s;}
        .bd-edit-review-btn{color:rgba(201,168,76,0.6);}
        .bd-edit-review-btn:hover{border-color:#c9a84c;color:#c9a84c;}
        .bd-delete-review-btn{color:#c0392b;border-color:rgba(192,57,43,0.25);}
        .bd-delete-review-btn:hover{border-color:#c0392b;background:rgba(192,57,43,0.06);}
        .bd-review-locked{font-size:12px;font-style:italic;color:rgba(201,168,76,0.4);margin-bottom:1.5rem;text-align:center;padding:1rem;border:0.5px solid rgba(201,168,76,0.1);}
        .bd-review-form{background:#0F1720;border:0.5px solid rgba(201,168,76,0.18);padding:1.8rem;margin-bottom:2rem;}
        .bd-review-form-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.55);margin-bottom:10px;font-style:italic;}
        .bd-review-stars-input{display:flex;gap:8px;}
        .bd-star-pick{font-size:24px;color:#c9a84c;cursor:pointer;transition:transform 0.15s;}
        .bd-star-pick:hover{transform:scale(1.15);}
        .bd-review-textarea{width:100%;min-height:100px;background:rgba(201,168,76,0.04);border:0.5px solid rgba(201,168,76,0.22);padding:12px 14px;font-family:Georgia,serif;font-size:14px;color:rgba(255,245,230,0.85);outline:none;resize:vertical;line-height:1.6;margin-top:6px;}
        .bd-review-textarea::placeholder{color:rgba(201,168,76,0.3);font-style:italic;}
        .bd-review-form-actions{display:flex;gap:12px;margin-top:16px;}
        .bd-review-cancel-btn{background:none;border:0.5px solid rgba(201,168,76,0.22);padding:10px 22px;font-family:Georgia,serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(201,168,76,0.55);cursor:pointer;transition:all 0.25s;}
        .bd-review-cancel-btn:hover{border-color:rgba(201,168,76,0.45);color:#c9a84c;}
        .bd-review-submit-btn{background:#1a0808;border:0.5px solid #8b2020;padding:10px 24px;font-family:Georgia,serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c0392b;cursor:pointer;transition:all 0.3s;}
        .bd-review-submit-btn:hover{background:#2a1010;border-color:#c9a84c;color:#c9a84c;}
        .bd-review-cancel-btn:disabled,.bd-review-submit-btn:disabled{opacity:0.4;cursor:default;}
      `}</style>

      <div className="bd-root">
        <div className="bd-breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">·</span>
          <Link to={`/category/${primaryCategory.toLowerCase().replace(/\s+/g, "-")}`}>{primaryCategory}</Link>
          <span className="sep">·</span>
          <span className="current">{book.title}</span>
        </div>

        {/* ── TOP: cover + info ── */}
        <div className="bd-top">
          <div className="bd-cover-panel">
            {[{ top: 10, left: 12 }, { top: 10, right: 12 }, { bottom: 10, left: 12 }, { bottom: 10, right: 12 }].map((s, i) => (
              <span key={i} style={{ position: "absolute", ...s, fontSize: 13, color: "#c9a84c", opacity: 0.4 }}>✦</span>
            ))}
            <div className="bd-cover-frame">
              {imgError || !book.coverUrl ? (
                <div className="bd-cover-fallback">
                  <span style={{ fontSize: 22, color: "rgba(201,168,76,0.4)" }}>✦</span>
                  <span style={{ fontSize: 11, color: "rgba(255,245,230,0.5)", fontStyle: "italic", textAlign: "center", padding: "0 20px" }}>{book.title}</span>
                  <span style={{ fontSize: 9, color: "rgba(201,168,76,0.3)", letterSpacing: "2px", textTransform: "uppercase" }}>No Cover</span>
                </div>
              ) : (
                <img className="bd-cover-img" src={book.coverUrl} alt={book.title} onError={() => setImgError(true)} />
              )}
            </div>
          </div>

          <div>
            <div className="bd-tag">— {primaryCategory} &nbsp;·&nbsp; {book.publicationYear}</div>
            <h1 className="bd-title">{book.title}</h1>
            <div className="bd-author">by {book.author?.name ?? "Unknown Author"}</div>

            <div className="bd-rating-row">
              <Stars rating={book.averageRating ?? 0} />
              <span className="bd-rating-text">
                {book.averageRating ? book.averageRating.toFixed(1) : "—"} &nbsp;·&nbsp; {book.reviewCount ?? 0} reviews
              </span>
            </div>

            <div className="bd-divider">
              <div className="bd-divider-line" />
              <span className="bd-divider-gem">✦</span>
              <div className="bd-divider-line" />
            </div>

            <div className="bd-price-row">
              <span className="bd-price">${Number(book.price).toFixed(2)}</span>
              <span className={`bd-stock ${inStock ? "in" : "out"}`}>
                {inStock ? `✦ In Stock (${book.stockQuantity})` : "✦ Out of Stock"}
              </span>
            </div>

            <div className="bd-buy-row">
              <div className="bd-qty">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={!inStock}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(book.stockQuantity ?? 99, q + 1))} disabled={!inStock}>+</button>
              </div>
              <button
                className={`bd-add-btn ${added ? "added" : ""}`}
                onClick={handleAddToCart}
                disabled={(!inStock && !!user) || adding}
              >
                {!user
                  ? "Login to unlock"
                  : added
                    ? "✓ Added to Cart"
                    : adding
                      ? "Adding..."
                      : "⊷ Add to Cart ⊶"}
              </button>
            </div>

            <p className="bd-desc">{book.description}</p>

            <div className="bd-meta-grid">
              <div className="bd-meta-item">
                <span className="bd-meta-label">Publisher</span>
                <span className="bd-meta-value">{book.publisher?.name ?? "—"}</span>
              </div>
              <div className="bd-meta-item">
                <span className="bd-meta-label">ISBN</span>
                <span className="bd-meta-value">{book.isbn ?? "—"}</span>
              </div>
              <div className="bd-meta-item">
                <span className="bd-meta-label">Published</span>
                <span className="bd-meta-value">{book.publicationYear ?? "—"}</span>
              </div>
              <div className="bd-meta-item">
                <span className="bd-meta-label">Pages</span>
                <span className="bd-meta-value">—</span>
              </div>
            </div>

            {book.categories?.length > 0 && (
              <div className="bd-cat-tags">
                {book.categories.map(c => (
                  <Link key={c.id} to={`/category/${c.name.toLowerCase().replace(/\s+/g, "-")}`} className="bd-cat-tag">{c.name}</Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── REVIEWS ── */}
        <section className="bd-section">
          <div className="bd-section-head">
            <div>
              <div className="bd-section-kicker">✦ Reader Reflections</div>
              <h2 className="bd-section-title">What Others <em>Found</em></h2>
            </div>
            {user && eligibility?.canReview && !showReviewForm && (
              <button className="bd-write-review-btn" onClick={() => setShowReviewForm(true)}>
                ✦ Write a Review
              </button>
            )}
            {user && eligibility?.hasReviewed && !showReviewForm && (
              <div className="bd-review-actions">
                <button className="bd-edit-review-btn" onClick={() => setShowReviewForm(true)}>Edit</button>
                <button className="bd-delete-review-btn" onClick={handleDeleteReview}>Delete</button>
              </div>
            )}
          </div>

          {user && !eligibility?.canReview && !eligibility?.hasReviewed && (
            <div className="bd-review-locked">✦ Reviews are open to readers who've received this title</div>
          )}

          {showReviewForm && (
            <div className="bd-review-form">
              <div className="bd-review-form-label">Your Rating</div>
              <div className="bd-review-stars-input">
                {[1, 2, 3, 4, 5].map(n => (
                  <span
                    key={n}
                    className="bd-star-pick"
                    style={{ opacity: n <= reviewRating ? 1 : 0.25 }}
                    onClick={() => setReviewRating(n)}
                  >★</span>
                ))}
              </div>
              <div className="bd-review-form-label" style={{ marginTop: 16 }}>Your Thoughts</div>
              <textarea
                className="bd-review-textarea"
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Share what this book meant to you…"
              />
              <div className="bd-review-form-actions">
                <button className="bd-review-cancel-btn" onClick={() => setShowReviewForm(false)} disabled={submittingReview}>Cancel</button>
                <button className="bd-review-submit-btn" onClick={handleSubmitReview} disabled={submittingReview}>
                  {submittingReview ? "Saving…" : eligibility?.hasReviewed ? "Update Review" : "Submit Review"}
                </button>
              </div>
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="bd-empty-state">✦ No reviews yet — be the first to share your thoughts.</div>
          ) : (
            <div className="bd-review-list">
              {reviews.map((r, i) => (
                <div key={i} className="bd-review-item">
                  <div className="bd-review-head">
                    <span className="bd-review-name">{r.reviewerName}</span>
                    <span className="bd-review-date">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</span>
                  </div>
                  <Stars rating={r.rating} />
                  <p className="bd-review-comment" style={{ marginTop: 8 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── RELATED BOOKS ── */}
        {related.length > 0 && (
          <section className="bd-section">
            <div className="bd-section-head">
              <div>
                <div className="bd-section-kicker">✦ You May Also Like</div>
                <h2 className="bd-section-title">Related <em>Titles</em></h2>
              </div>
            </div>
            <ShelfRow books={related} sectionRef={null} visible={true} />
          </section>
        )}

      </div>
    </>
  );
}