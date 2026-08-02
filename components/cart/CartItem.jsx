import styles from './CartItem.module.css';

export default function CartItem({ item, onUpdate, onRemove }) {
  const { id, name, price ,discountedPrice, quantity, image } = item;

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (val > 0) onUpdate(id, val);
  };

  return (
    <div className={styles.item}>
      <div className={styles.image}>
        <img src={image || '/placeholder.jpg'} alt={name} />
      </div>
      <div className={styles.details}>
        <h3>{name}</h3>
        <p className={styles.price}>Rs.{discountedPrice.toLocaleString()}</p>
      </div>
      <div className={styles.options}>
        <button className={styles.sizeBtn} >
          {item.size}
        </button>
        <button
          // key={item.color}
          className={styles.colorBtn}
          style={{ backgroundColor: item.color.toLowerCase() }}
          title={item.color}
        />
      </div>
      
      <div className={styles.controls}>
        <div className={styles.quantity}>
          <button onClick={() => onUpdate(id, quantity - 1)} disabled={quantity <= 1}>
            −
          </button>
          <input type="number" min="1" value={quantity} onChange={handleQuantityChange} />
          <button onClick={() => onUpdate(id, quantity + 1)}>+</button>
        </div>
        <button className={styles.removeBtn} onClick={() => onRemove(id)}>
          Remove
        </button>
      </div>
      <div className={styles.subtotal}>
        Rs.{(discountedPrice * quantity).toLocaleString()}
      </div>
    </div>
  );
}