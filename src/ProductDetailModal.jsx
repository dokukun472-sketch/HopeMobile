import React from "react";

function ProductDetailModal({ isOpen, onClose, product }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Product Details</h2>
        <button onClick={onClose}>Close</button>
        <div>
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
          <p>Availability: {product.availability}</p>
          <p>Compatibility: {product.compatibility}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
