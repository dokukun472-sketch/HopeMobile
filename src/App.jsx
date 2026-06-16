import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "./components/HeroSection";
import CatalogGrid from "./components/CatalogGrid";
import ProductDetailModal from "./components/ProductDetailModal";
import supabase from "./supabaseClient";
import "./index.css";

const LOGO_URL =
  "https://qdvsndvpchzeovlckabo.supabase.co/storage/v1/object/public/Product-image/Admin%20Web/HM%20Logo.png";

const footerLinks = {
  "Shop Parts": [
    "iPhone Parts",
    "Samsung Parts",
    "Google Pixel Parts",
    "OnePlus Parts",
    "Xiaomi Parts",
    "All Categories",
  ],
  Support: [
    "Help Center",
    "Shipping Info",
    "Returns & Warranty",
    "Track Order",
    "Contact Us",
  ],
  Company: ["About Us", "Blog", "Careers", "Press Kit", "Wholesale"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
};

const springConfig = { type: "spring", stiffness: 90, damping: 14, mass: 0.8 };

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Part Request Form State
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handlePartRequestSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);
    setFormSuccess(false);

    const formData = new FormData(e.target);
    const customerName = formData.get("customer_name").trim();
    const phoneNumber = formData.get("phone_number").trim();
    const requestedPart = formData.get("requested_part").trim();

    if (!customerName || !phoneNumber || !requestedPart) {
      setFormError("Please fill in all fields.");
      setFormSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from("part_requests").insert([
        {
          customer_name: customerName,
          phone_number: phoneNumber,
          requested_part: requestedPart,
        },
      ]);

      if (error) throw error;

      setFormSuccess(true);
      e.target.reset();
    } catch (err) {
      console.error("Part request submission error:", err);
      setFormError(
        "\u1010\u1031\u102c\u1004\u103a\u1038\u1006\u102d\u102f\u1019\u103e\u102f \u1019\u1021\u1031\u102c\u1004\u103a\u1019\u103c\u1004\u103a\u1015\u102b\u104b \u1011\u1015\u103a\u1019\u1036\u1000\u103c\u102d\u102f\u1038\u1005\u102c\u1038\u1015\u102b\u104b (Submission failed. Please try again.)",
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-inner flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 md:px-6 h-auto min-h-[56px] sm:min-h-[60px] md:h-16">
          <div className="header-logo flex items-center gap-2 sm:gap-[10px] flex-shrink-0">
            <img
              src={LOGO_URL}
              alt="Hope Mobile Logo"
              className="header-logo-img h-8 sm:h-9 md:h-10 w-auto object-contain"
            />
            <span className="logo-text text-sm sm:text-base md:text-xl">
              Hope Mobile
            </span>
          </div>
          <nav className="header-nav hidden md:flex gap-2">
            <a href="#catalog" className="nav-link">
              Catalog
            </a>
            <a href="#request" className="nav-link">
              Request Parts
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
          </nav>
          <div className="header-actions flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              className="header-icon-btn w-9 h-9 sm:w-10 sm:h-10"
              aria-label="Wishlist"
            >
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
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button
              className="header-icon-btn cart-btn w-9 h-9 sm:w-10 sm:h-10"
              aria-label="Cart"
            >
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
              <span className="cart-count">0</span>
            </button>
          </div>
        </div>
      </header>

      <HeroSection onSearch={handleSearch} searchTerm={searchTerm} />

      {/* Premium Announcement / Apology Notice */}
      <section className="announcement-section">
        <motion.div
          className="announcement-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 80, damping: 16 }}
        >
          <div className="announcement-icon-wrapper">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="announcement-body">
            <h3 className="announcement-title">မေတ္တာရပ်ခံချက်</h3>
            <p className="announcement-text">
              ကျွန်တော်တို့ဆိုင်ခွဲ ဖွင့်လှစ်ထားသည်မှာ ၁ လခန့်သာ ရှိသေးသည့်အတွက်
              ပစ္စည်းအမျိုးအစား စုံလင်စွာ မရှိသေးသည်ကို အနူးညွတ်
              တောင်းပန်အပ်ပါသည်။ လိုအပ်သည်များကို အောက်ပါ Form တွင်
              အကြံပြုတောင်းဆိုနိုင်ပါသည်ခင်ဗျာ။
            </p>
          </div>
        </motion.div>
      </section>

      <CatalogGrid
        onProductClick={handleProductClick}
        searchTerm={searchTerm}
      />

      {selectedProduct && (
        <ProductDetailModal
          isOpen={!!selectedProduct}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      )}

      {/* Customer Part Request & Suggestion Form */}
      <section id="request" className="part-request-section">
        <motion.div
          className="part-request-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 80, damping: 16 }}
        >
          <div className="part-request-header">
            <h2 className="part-request-title">
              လိုအပ်သော ပစ္စည်းတောင်းဆိုရန်
            </h2>
            <p className="part-request-subtitle">
              လိုချင်သော ပစ္စည်းအမည် (သို့) အကြံပြုချက်အား အောက်တွင်
              ဖြည့်သွင်းတောင်းဆိုနိုင်ပါသည်။ ပစ္စည်းရောက်ရှိပါက
              ဖုန်းဆက်အကြောင်းကြားပေးပါမည်။
            </p>
          </div>

          <form
            className="part-request-form"
            onSubmit={handlePartRequestSubmit}
          >
            <div className="form-fields">
              <div className="form-group">
                <label htmlFor="customer_name" className="form-label">
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
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  နာမည်
                </label>
                <input
                  id="customer_name"
                  name="customer_name"
                  type="text"
                  className="form-input"
                  placeholder="သင့်နာမည် ထည့်သွင်းပါ"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone_number" className="form-label">
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
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  ဖုန်းနံပါတ်
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  className="form-input"
                  placeholder="09xxxxxxxxxx"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="requested_part" className="form-label">
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
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                တောင်းဆိုလိုသော ပစ္စည်း သို့မဟုတ် အကြံပြုချက်
              </label>
              <textarea
                id="requested_part"
                name="requested_part"
                className="form-textarea"
                rows="4"
                placeholder="ဥပမာ - iPhone 14 Pro Max Screen, Samsung S23 Ultra Battery..."
                required
              />
            </div>

            <motion.button
              type="submit"
              className="form-submit-btn"
              disabled={formSubmitting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={springConfig}
            >
              {formSubmitting ? (
                <span className="form-submitting">
                  <svg
                    className="spinner"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  တောင်းဆိုနေသည်...
                </span>
              ) : (
                "တောင်းဆိုမည်"
              )}
            </motion.button>
          </form>

          {/* Error Message */}
          <AnimatePresence>
            {formError && (
              <motion.div
                className="form-message form-message-error"
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {formError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message Popup */}
          <AnimatePresence>
            {formSuccess && (
              <motion.div
                className="form-message form-message-success"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                <motion.div
                  className="success-icon-ring"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 12,
                    delay: 0.1,
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>
                <div className="success-text">
                  <h4>တောင်းဆိုမှု အောင်မြင်ပါသည်</h4>
                  <p>ပစ္စည်းရောက်ပါက ဆက်သွယ်ပေးပါမည်။</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Contact / Location Section */}
      <section id="contact" className="contact-section">
        <motion.div
          className="contact-container"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 80, damping: 16 }}
        >
          <h2 className="contact-section-title">ဆက်သွယ်ရန်</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="contact-details">
                <span className="contact-label">ဖုန်းနံပါတ်များ</span>
                <a href="tel:09773811928" className="contact-value">
                  09773811928
                </a>
                <a href="tel:09799822599" className="contact-value">
                  09799822599
                </a>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="contact-details">
                <span className="contact-label">အီးမေးလ်</span>
                <a
                  href="mailto:hopemobile2y@gmail.com"
                  className="contact-value"
                >
                  hopemobile2y@gmail.com
                </a>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="contact-details">
                <span className="contact-label">လိပ်စာ</span>
                <span className="contact-value">
                  Paleik, Lan Sone (ပုလိပ် လမ်းဆုံ)
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="footer-column">
                <h4 className="footer-title">{title}</h4>
                <ul className="footer-links">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <div className="footer-brand">
              <img
                src={LOGO_URL}
                alt="Hope Mobile"
                className="footer-logo-img"
              />
              <span>
                Hope Mobile Spareparts & Service © {new Date().getFullYear()}
              </span>
            </div>
            <div className="footer-payment">
              <span className="payment-icon">VISA</span>
              <span className="payment-icon">MC</span>
              <span className="payment-icon">AMEX</span>
              <span className="payment-icon">PayPal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
