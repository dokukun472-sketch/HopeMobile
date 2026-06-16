import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import supabase from "../supabaseClient";

const IMAGE_PLACEHOLDERS = ["📱", "🔋", "🔌", "📸", "🔊", "🔧"];

function getPlaceholderImage(category, id) {
  if (category) {
    const lower = category.toLowerCase();
    if (lower.includes("screen") || lower.includes("display")) return "📱";
    if (lower.includes("battery")) return "🔋";
    if (lower.includes("charging") || lower.includes("port")) return "🔌";
    if (lower.includes("camera") || lower.includes("lens")) return "📸";
    if (lower.includes("speaker") || lower.includes("audio")) return "🔊";
    if (lower.includes("hinge") || lower.includes("flex")) return "🔧";
    if (
      lower.includes("back") ||
      lower.includes("glass") ||
      lower.includes("cover")
    )
      return "📱";
  }
  return IMAGE_PLACEHOLDERS[id % IMAGE_PLACEHOLDERS.length];
}

function mapSupabaseProduct(row) {
  const stockQty = row.stock_quantity ?? 0;
  let availability = "Out of Stock";
  let badge = null;
  if (stockQty > 20) {
    availability = "In Stock";
  } else if (stockQty > 0) {
    availability = "Low Stock";
    badge = "Low Stock";
  }

  return {
    id: row.id,
    name: row.name || "Unnamed Part",
    price: typeof row.price === "number" ? row.price : Number(row.price) || 0,
    availability,
    category: row.category || "General",
    image: row.image_url || getPlaceholderImage(row.category, row.id),
    brand: row.category || "General",
    compatibility: row.category || "",
    rating: null,
    reviews: null,
    originalPrice: null,
    badge,
    description: null,
    specifications: null,
  };
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "name", label: "Name: A-Z" },
];

const categoryFilters = [
  "All Parts",
  "LCD",
  "Battery",
  "Finger",
  "Key",
  "Glass",
  "Back Glass",
];
const availabilityFilters = ["All", "In Stock", "Low Stock", "Out of Stock"];

/* ─── Spring presets ─── */
const springBouncy = { type: "spring", stiffness: 90, damping: 14, mass: 0.8 };
const springCard = { type: "spring", stiffness: 180, damping: 18, mass: 0.7 };
const springBadge = { type: "spring", stiffness: 140, damping: 14, mass: 0.5 };

/* ─── Staggered grid container ─── */
const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/* ─── Individual card slide-up + 3D tilt reveal ─── */
const cardReveal = {
  hidden: {
    opacity: 0,
    y: 50,
    rotateX: 10,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: springCard,
  },
};

/* ─── Shimmer skeleton placeholder ─── */
const shimmerVariants = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      repeat: Infinity,
      repeatType: "loop",
      duration: 1.6,
      ease: "linear",
    },
  },
};

/* ─── Product Card Component ─── */
function ProductCard({ product, viewMode, onProductClick, index }) {
  return (
    <motion.div
      className={`product-card ${viewMode === "list" ? "product-card-list" : ""}`}
      onClick={() => onProductClick(product)}
      variants={cardReveal}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow:
          "0 25px 60px -12px rgba(168,85,247,0.15), 0 0 0 1px rgba(168,85,247,0.25)",
        borderColor: "rgba(168,85,247,0.5)",
        transition: springBouncy,
      }}
      whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
    >
      {product.badge && (
        <motion.span
          className={`product-badge badge-${product.badge
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
          whileHover={{ scale: 1.08 }}
          transition={springBadge}
        >
          {product.badge}
        </motion.span>
      )}

      {/* --- Premium Shimmer Image Placeholder --- */}
      <motion.div
        className="product-image"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        style={{
          background:
            "linear-gradient(110deg, #09090b 30%, #18181b 50%, #09090b 70%)",
          backgroundSize: "200% 100%",
        }}
      >
        {product.image &&
        typeof product.image === "string" &&
        product.image.startsWith("http") ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <motion.span
          className="product-image-emoji"
          animate={{ rotate: [0, -3, 3, 0] }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 5,
            ease: "easeInOut",
            delay: index * 0.15,
          }}
          style={{
            display:
              product.image &&
              typeof product.image === "string" &&
              product.image.startsWith("http")
                ? "none"
                : "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {typeof product.image === "string" && product.image.startsWith("http")
            ? null
            : product.image}
        </motion.span>
      </motion.div>

      <div className="product-info">
        <span className="product-brand">{product.brand}</span>
        <h3 className="product-name">{product.name}</h3>
        {viewMode === "list" && product.description && (
          <p className="product-description">
            {product.description.substring(0, 120)}...
          </p>
        )}
        <div className="product-meta">
          <span
            className={`product-stock ${
              product.availability === "In Stock"
                ? "in-stock"
                : product.availability === "Low Stock"
                  ? "low-stock"
                  : "out-of-stock"
            }`}
          >
            <span className="stock-dot" />
            {product.availability}
          </span>
          <span className="product-compatibility">{product.compatibility}</span>
        </div>
        <div className="product-footer">
          <div className="product-pricing">
            <span className="product-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="product-original-price">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {product.rating && (
            <div className="product-rating">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="#c084fc"
                stroke="#c084fc"
                strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{product.rating}</span>
              <span className="review-count">({product.reviews})</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function CatalogGrid({ onProductClick, searchTerm }) {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("All Parts");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const itemsPerPage = 8;

  /* ─── Fetch live products from Supabase ─── */
  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setFetchError(null);

      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, stock_quantity, image_url, category");

      if (cancelled) return;

      if (error) {
        console.error("Supabase fetch error:", error);
        setFetchError(error.message);
        setAllProducts([]);
        setLoading(false);
        return;
      }

      const mapped = (data || []).map(mapSupabaseProduct);
      setAllProducts(mapped);
      setLoading(false);
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedAvailability, sortBy]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    if (searchTerm && searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.compatibility.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query)),
      );
    }
    if (selectedCategory !== "All Parts") {
      result = result.filter((p) => {
        const name = p.name.toLowerCase();
        switch (selectedCategory) {
          case "LCD":
            return name.includes("lcd");
          case "Battery":
            return name.startsWith("b") || name.includes("battery");
          case "Finger":
            return name.includes("finger");
          case "Key":
            return name.includes("key");
          case "Back Glass":
            return name.includes("back glass");
          case "Glass":
            return name.includes("glass") && !name.includes("back glass");
          default:
            return true;
        }
      });
    }
    if (selectedAvailability !== "All") {
      result = result.filter((p) => p.availability === selectedAvailability);
    }
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return result;
  }, [allProducts, searchTerm, selectedCategory, selectedAvailability, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerPage),
  );
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <section className="catalog-section" id="catalog">
      <div className="catalog-header">
        <div className="catalog-header-left">
          <motion.h2
            className="catalog-title"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{
              opacity: 1,
              x: 0,
              transition: springBouncy,
            }}
            viewport={{ once: false, amount: 0.5 }}
          >
            Spare Parts Catalog
          </motion.h2>
          <motion.span
            className="catalog-count"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, transition: { delay: 0.15 } }}
            viewport={{ once: false, amount: 0.5 }}
          >
            {filteredProducts.length} part
            {filteredProducts.length !== 1 ? "s" : ""} found
          </motion.span>
        </div>
        <div className="catalog-header-right">
          <div className="view-toggle">
            <motion.button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={springBouncy}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </motion.button>
            <motion.button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="List View"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={springBouncy}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </motion.button>
          </div>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- Magnetic Brand / Availability Filter Chips --- */}
      <motion.div
        className="catalog-filters"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: springBouncy,
        }}
        viewport={{ once: false, amount: 0.4 }}
      >
        <div className="filter-group">
          <label className="filter-label">Category:</label>
          <div className="filter-chips">
            {categoryFilters.map((category) => (
              <motion.button
                key={category}
                className={`filter-chip ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}
                whileHover={{
                  scale: 1.06,
                  transition: springBouncy,
                }}
                whileTap={{ scale: 0.92 }}
                transition={springBouncy}
                animate={
                  selectedCategory === category
                    ? { scale: [1, 1.04, 1], transition: { duration: 0.35 } }
                    : {}
                }
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label className="filter-label">Availability:</label>
          <div className="filter-chips">
            {availabilityFilters.map((avail) => (
              <motion.button
                key={avail}
                className={`filter-chip ${
                  selectedAvailability === avail ? "active" : ""
                }`}
                onClick={() => setSelectedAvailability(avail)}
                whileHover={{
                  scale: 1.06,
                  transition: springBouncy,
                }}
                whileTap={{ scale: 0.92 }}
                transition={springBouncy}
                animate={
                  selectedAvailability === avail
                    ? { scale: [1, 1.04, 1], transition: { duration: 0.35 } }
                    : {}
                }
              >
                {avail}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {loading ? (
        <motion.div
          className="catalog-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: springBouncy }}
        >
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{
              width: 48,
              height: 48,
              border: "4px solid rgba(168,85,247,0.2)",
              borderTopColor: "rgb(168,85,247)",
              borderRadius: "50%",
              marginBottom: 16,
            }}
          />
          <h3>Loading products...</h3>
          <p>Fetching the latest spare parts inventory from Supabase.</p>
        </motion.div>
      ) : fetchError ? (
        <motion.div
          className="catalog-empty"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, transition: springBouncy }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h3>Failed to load products</h3>
          <p>{fetchError}</p>
          <motion.button
            className="btn-reset-filters"
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={springBouncy}
          >
            Retry
          </motion.button>
        </motion.div>
      ) : filteredProducts.length === 0 ? (
        <motion.div
          className="catalog-empty"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, transition: springBouncy }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <h3>No parts found</h3>
          <p>
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <motion.button
            className="btn-reset-filters"
            onClick={() => {
              setSelectedCategory("All Parts");
              setSelectedAvailability("All");
              setSortBy("featured");
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={springBouncy}
          >
            Reset All Filters
          </motion.button>
        </motion.div>
      ) : (
        <>
          <motion.div
            className={`product-${viewMode} ${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
                : ""
            }`}
            key={currentPage + sortBy + selectedCategory + selectedAvailability}
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.08 }}
          >
            {paginatedProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                onProductClick={onProductClick}
                index={idx}
              />
            ))}
          </motion.div>

          {totalPages > 1 && (
            <motion.div
              className="pagination"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: springBouncy,
              }}
              viewport={{ once: false, amount: 0.5 }}
            >
              <motion.button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                whileHover={currentPage !== 1 ? { scale: 1.08, x: -2 } : {}}
                whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
                transition={springBouncy}
              >
                ← Prev
              </motion.button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <motion.button
                    key={page}
                    className={`page-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                    whileHover={currentPage !== page ? { scale: 1.1 } : {}}
                    whileTap={{ scale: 0.9 }}
                    transition={springBouncy}
                    animate={
                      currentPage === page
                        ? {
                            scale: [1, 1.08, 1],
                            transition: springBouncy,
                          }
                        : {}
                    }
                  >
                    {page}
                  </motion.button>
                ),
              )}
              <motion.button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                whileHover={
                  currentPage !== totalPages ? { scale: 1.08, x: 2 } : {}
                }
                whileTap={currentPage !== totalPages ? { scale: 0.9 } : {}}
                transition={springBouncy}
              >
                Next →
              </motion.button>
            </motion.div>
          )}
        </>
      )}
    </section>
  );
}

export default CatalogGrid;
