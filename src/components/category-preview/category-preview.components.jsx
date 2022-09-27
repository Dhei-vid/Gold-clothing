import ProductCard from "../product-card/product-card.component";
import "./category-preview.styles.scss";

const CategoryPreview = ({ title, products }) => {
  return (
    <div className="category-preview-container">
      <h2>
        <span className="title">{title}</span>
      </h2>
      <div className="preview">
        {products
          .filter((_, index) => index < 4)
          .map((prod) => (
            <ProductCard key={prod.id} products={prod} />
          ))}
      </div>
    </div>
  );
};

export default CategoryPreview;