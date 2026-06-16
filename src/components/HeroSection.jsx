import React, { useState } from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "200+", label: "Parts Available" },
  { value: "10+", label: "Brands Supported" },
  { value: "24h", label: "Fast Shipping" },
  { value: "4.8", label: "Customer Rating" },
];

const popularCategories = [
  "iPhone Screens",
  "Samsung Batteries",
  "Charging Ports",
  "Camera Modules",
  "Back Glass",
  "Speaker Assemblies",
];

const springConfig = { type: "spring", stiffness: 90, damping: 14, mass: 0.8 };

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.25 },
  },
};

const springUp = {
  hidden: { y: 60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { ...springConfig, stiffness: 85, damping: 16 },
  },
};

const wordMaskVariant = {
  hidden: { y: "105%" },
  visible: {
    y: "0%",
    transition: {
      type: "spring",
      stiffness: 75,
      damping: 14,
      mass: 0.9,
    },
  },
};

const statsContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.7 },
  },
};

const statVariant = {
  hidden: { scale: 0.6, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 12, mass: 0.6 },
  },
};

function HeroSection({ onSearch, searchTerm }) {
  const [inputValue, setInputValue] = useState(searchTerm || "");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  const handleCategoryClick = (category) => {
    onSearch(category);
    setInputValue(category);
  };

  const titleLine1 = "Hope Mobile";
  const titleLine2 = "Spare Parts";
  const accentWords = ["Catalog"];

  return (
    <motion.section
      className="hero-section px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 lg:py-[80px]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="hero-overlay" />
      <div className="hero-content max-w-[800px] mx-auto px-0">
        {/* --- Badge --- */}
        <motion.div
          className="hero-badge text-xs sm:text-sm md:text-[0.85rem] mb-4 sm:mb-5 md:mb-6"
          variants={springUp}
        >
          <span className="badge-dot" />
          #1 Mobile Parts Supplier
        </motion.div>

        {/* --- Title with Text Mask Reveal --- */}
        <h1 className="hero-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.15] font-extrabold text-white mb-3 sm:mb-4">
          <span
            className="title-mask-line"
            style={{ display: "block", overflow: "hidden" }}
          >
            <motion.span
              style={{ display: "inline-block" }}
              variants={wordMaskVariant}
            >
              {titleLine1}
            </motion.span>
          </span>
          <span
            className="title-mask-line"
            style={{ display: "block", overflow: "hidden" }}
          >
            <motion.span
              className="hero-title-accent"
              style={{ display: "inline-block" }}
              variants={{
                hidden: { y: "105%" },
                visible: {
                  y: "0%",
                  transition: {
                    type: "spring",
                    stiffness: 75,
                    damping: 14,
                    mass: 0.9,
                    delay: 0.1,
                  },
                },
              }}
            >
              {titleLine2}
            </motion.span>{" "}
            <motion.span
              style={{ display: "inline-block", color: "#fff" }}
              variants={{
                hidden: { y: "105%" },
                visible: {
                  y: "0%",
                  transition: {
                    type: "spring",
                    stiffness: 75,
                    damping: 14,
                    mass: 0.9,
                    delay: 0.2,
                  },
                },
              }}
            >
              {accentWords[0]}
            </motion.span>
          </span>
        </h1>

        {/* --- Subtitle --- */}
        <motion.p
          className="hero-subtitle text-sm sm:text-base md:text-[1.15rem] max-w-[580px] mx-auto mb-6 sm:mb-7 md:mb-8"
          variants={{
            hidden: { y: 40, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                ...springConfig,
                stiffness: 80,
                damping: 15,
                delay: 0.35,
              },
            },
          }}
        >
          Genuine OEM and high-quality aftermarket parts for iPhone, Samsung,
          Google Pixel, OnePlus, and more. Fast shipping worldwide.
        </motion.p>

        {/* --- Search Bar --- */}
        <motion.form
          className={`hero-search ${isFocused ? "hero-search-focused" : ""}`}
          onSubmit={handleSubmit}
          variants={{
            hidden: { y: 50, opacity: 0, scale: 0.95 },
            visible: {
              y: 0,
              opacity: 1,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 85,
                damping: 14,
                mass: 0.7,
                delay: 0.45,
              },
            },
          }}
        >
          <svg
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder='Search parts... (e.g. "iPhone 14 screen", "Samsung battery")'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="hero-search-input"
          />
          <motion.button
            type="submit"
            className="hero-search-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={springConfig}
          >
            Search Parts
          </motion.button>
        </motion.form>

        {/* --- Category Chips (Magnetic Buttons) --- */}
        <motion.div
          className="hero-categories"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.06, delayChildren: 0.55 },
            },
          }}
        >
          <motion.span
            className="categories-label"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { ...springConfig, stiffness: 100, damping: 12 },
              },
            }}
          >
            Popular:
          </motion.span>
          {popularCategories.map((cat, i) => (
            <motion.button
              key={cat}
              className="category-chip"
              onClick={() => handleCategoryClick(cat)}
              variants={{
                hidden: { opacity: 0, scale: 0.7 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    ...springConfig,
                    stiffness: 130,
                    damping: 13,
                    delay: 0.55 + i * 0.06,
                  },
                },
              }}
              whileHover={{
                scale: 1.08,
                backgroundColor: "rgba(168,85,247,0.25)",
                borderColor: "rgba(168,85,247,0.5)",
                color: "#ffffff",
                boxShadow: "0 0 15px rgba(168,85,247,0.25)",
                transition: springConfig,
              }}
              whileTap={{ scale: 0.93 }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* --- Stats --- */}
        <motion.div className="hero-stats" variants={statsContainer}>
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="stat-item"
              variants={statVariant}
            >
              <motion.span
                className="stat-value"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                {stat.value}
              </motion.span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default HeroSection;
