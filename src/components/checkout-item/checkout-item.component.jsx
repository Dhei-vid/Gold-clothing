import "./checkout-item.styles.scss";

const CheckoutItem = ({ cartItem, reduce, increase, deleteItem }) => {
  const { name, imageUrl, price, quantity } = cartItem;

  const removeItemHandler = () => reduce(cartItem);
  const addItemHandler = () => increase(cartItem);
  const clearItemHandler = () => deleteItem(cartItem);

  return (
    <div className="checkout-item-container">
      <div className="image-container">
        <img src={imageUrl} alt="added product to cart" />
      </div>
      <span className="name">{name} </span>
      <span className="quantity">
        <div className="arrow" onClick={removeItemHandler}>
          &lt;
        </div>
        <div className="value">{quantity}</div>
        <div className="arrow" onClick={addItemHandler}>
          &gt;
        </div>
      </span>
      <span className="price"> ${price} </span>
      <span className="remove-button" onClick={clearItemHandler}>
        &#10005;
      </span>
    </div>
  );
};

export default CheckoutItem;
