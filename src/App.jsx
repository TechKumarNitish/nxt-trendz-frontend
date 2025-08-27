import { Component } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Admin from './components/Admin'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  addCartItem = product => {
    const { cartList } = this.state
    const existingProduct = cartList.find(item => item.id === product.id)
    if (existingProduct === undefined)
      this.setState(prevState => ({ cartList: [...prevState.cartList, product] }))
    else
      this.setState(prevState => ({
        cartList: prevState.cartList.map(item => {
          if (item.id === product.id) {
            return { ...item, quantity: item.quantity + product.quantity }
          }
          return item
        }),
      }))
    //   TODO: Update the code here to implement addCartItem
  }

  removeCartItem = id => {
    const { cartList } = this.state
    const filteredCartList = cartList.filter(item => item.id !== id)

    this.setState({ cartList: filteredCartList })
  }

  removeAllCartItems = () => {
    this.setState({ cartList: [] })
  }

  incrementCartItemQuantity = id => {
    const { cartList } = this.state
    const updatedCartList = cartList.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 }
      }
      return item
    })
    this.setState({ cartList: updatedCartList })
  }

  decrementCartItemQuantity = id => {
    const { cartList } = this.state
    const existingProduct = cartList.find(item => item.id === id)
    if (existingProduct.quantity === 1) {
      this.removeCartItem(id)
      return
    }

    const updatedCartList = cartList.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity - 1 }
      }
      return item
    })
    this.setState({ cartList: updatedCartList })
  }

  render() {
    const { cartList } = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        <Routes>
          <Route path="/login" element={<LoginForm />} />

          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/products/:id" element={<ProtectedRoute><ProductItemDetails /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />

          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
          <Route path="/admin/*" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>

      </CartContext.Provider>
    )
  }
}

export default App
