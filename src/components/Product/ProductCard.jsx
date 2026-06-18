import React from "react";

const ProductCard = React.memo(({ product }) => {
  const unitPrice = Number(product.unit_price || 0);
  const dealPrice = Number(product.deal_price || 0);

  const hasDeal = dealPrice > 0 && dealPrice < unitPrice;

  return (
    <div className="product-card">
      {/* <img
        loading="lazy"
        src={
          product.image ||
          "/placeholder.jpg"
        }
        alt={product.product_name}
      /> */}

      <div className="product-info">
        <h4>{product.product_name}</h4>

        <p>
          <strong>Box:</strong> {product.box_factor}
        </p>

        {hasDeal ? (
          <div className="price-section">
            <div className="old-price">${unitPrice.toFixed(2)}</div>

            <div className="deal-price">${dealPrice.toFixed(2)}</div>

            <div className="save-badge">
              Save ${(unitPrice - dealPrice).toFixed(2)}
            </div>

            {/* <div className="save-badge">
              {Math.round(((unitPrice - dealPrice) / unitPrice) * 100)}% OFF
            </div> */}
          </div>
        ) : (
          <div className="price">${unitPrice.toFixed(2)}</div>
        )}
      </div>
    </div>
  );
});

export default ProductCard;
