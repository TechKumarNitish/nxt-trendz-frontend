// Write your code here
import './index.css'
import checkout from "../Razorpay"

const CartSummary = props => {
  const {totalAmount, itemCount} = props
  const onClickHandler=()=>{
    const {cartList}=props
    const items=cartList.map(item=>({
      id:item.id,
      quantity:item.quantity,
      price:item.quantity*item.price
    }))

    checkout(items, totalAmount)
  }
  return (
    <div className="cart-summary">
      <h1 className="total-order">
        Order Total: <span className="total-amount">Rs {totalAmount}/-</span>
      </h1>
      <p className="item-count">{itemCount} Items in cart</p>
      <button className="checkout-btn" type="button" onClick={onClickHandler}>
        Checkout
      </button>
    </div>
  )
}

export default CartSummary
