import React, { useEffect, useRef } from "react";

function ProductDetailModal({ isOpen, onClose, product }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const stockClass =
    product.availability === "In Stock"
      ? "in-stock"
      : product.availability === "Low Stock"
        ? "low-stock"
        : "out-of-stock";

  return (
    <div
      className="modal-overlay p-3 sm:p-4 md:p-6"
      onClick={handleOverlayClick}
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Product details"
    >
      <div className="modal-container w-[92%] sm:w-[88%] md:max-w-[820px] md:w-full max-h-[90vh] overflow-y-auto mx-auto rounded-2xl">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-body">
          <div className="modal-image-area">
            <div className="modal-product-image">
              {product.image &&
              typeof product.image === "string" &&
              product.image.startsWith("http") ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-xl bg-slate-900/50 p-2"
                />
              ) : (
                <span className="modal-placeholder-emoji">{product.image}</span>
              )}
            </div>
            {product.badge && (
              <span
                className={`modal-badge badge-${product.badge.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {product.badge}
              </span>
            )}
          </div>

          <div className="modal-details">
            <span className="modal-brand">{product.brand}</span>
            <h2 className="modal-title">{product.name}</h2>

            {product.rating && (
              <div className="modal-rating-row">
                <div className="modal-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={
                        star <= Math.round(product.rating)
                          ? "#c084fc"
                          : "#18181b"
                      }
                      stroke={
                        star <= Math.round(product.rating)
                          ? "#c084fc"
                          : "#27272a"
                      }
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="modal-rating-text">
                  {product.rating} out of 5 ({product.reviews} reviews)
                </span>
              </div>
            )}

            <div className="modal-price-row">
              <span className="modal-price">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="modal-original-price">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.originalPrice && (
                <span className="modal-savings">
                  Save ${(product.originalPrice - product.price).toFixed(2)} (
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100,
                  )}
                  %)
                </span>
              )}
            </div>

            <div className="modal-meta-row">
              <span className={`modal-stock ${stockClass}`}>
                <span className="stock-dot" />
                {product.availability === "In Stock"
                  ? "In Stock - Ready to Ship"
                  : product.availability === "Low Stock"
                    ? "Low Stock - Order Soon"
                    : "Out of Stock"}
              </span>
              <span className="modal-compatibility">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                Compatible: {product.compatibility}
              </span>
            </div>

            {product.description && (
              <div className="modal-description">
                <h4>Description</h4>
                <p>{product.description}</p>
              </div>
            )}

            {product.specifications && (
              <div className="modal-specs">
                <h4>Specifications</h4>
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <tr key={key}>
                          <td className="spec-key">{key}</td>
                          <td className="spec-value">{value}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="modal-actions">
              <div className="modal-quantity">
                <button className="qty-btn" aria-label="Decrease quantity">
                  −
                </button>
                <span className="qty-value">1</span>
                <button className="qty-btn" aria-label="Increase quantity">
                  +
                </button>
              </div>
              <button className="btn-add-to-cart">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Add to Cart
              </button>
              <button className="btn-buy-now">Buy It Now</button>
            </div>

            <div className="modal-trust">
              <div className="trust-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                90-Day Warranty
              </div>
              <div className="trust-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Quality Tested
              </div>
              <div className="trust-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="23 7 16 12 23 17 23 7" />
                </svg>
                Free Returns
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
