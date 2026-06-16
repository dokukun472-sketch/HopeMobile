import React from "react";

function CatalogGrid({ onProductClick }) {
  const products = [
    {
      name: "Item 1",
      price: 100,
      availability: "In Stock",
      compatibility: "iPhone 12",
    },
    {
      name: "Item 2",
      price: 200,
      availability: "Out of Stock",
      compatibility: "Samsung Galaxy S20",
    },
    // Add more products as needed
  ];

  return (
    <div className="catalog-grid">
      <h2>Spare Parts Catalog</h2>
      <div className="grid">
        {products.map((product) => (
          <div
            className="item"
            key={product.name}
            onClick={() => onProductClick(product)}
          >
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Availability: {product.availability}</p>
            <p>Compatibility: {product.compatibility}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatalogGrid;
