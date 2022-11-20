import React, { useState, useContext, createContext, useEffect } from 'react'
import toast from 'react-hot-toast'


const Context = createContext()

export const StateContext = ({ children }) => {

    const [showCart, setShowCart] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQuantities, setTotalQuantities] = useState(0)
    const [qty, setQty] = useState(1)

    const incQty = () => {
        setQty((prevQty) => (prevQty + 1))
    }

    const decQty = () => {
        if (qty === 1) return
        setQty((prevQty) => (prevQty - 1))
    }

    const toggleCartItemQuanitity = (id, value) => {

        const index = cartItems.findIndex((item) => item._id === id)
        const product = cartItems[index]
        
        let updatedCartItem = product
        let val = 0

        if(value == 'inc') {
            val = 1
        } else if(value == 'dec') {
          if (product.quantity > 1) {
            val = -1
          }
        }

        updatedCartItem = {...product, quantity: product.quantity + val }
        setTotalPrice((currentPrice) => (currentPrice += val * product.price))
        setCartItems([...cartItems.slice(0, index), updatedCartItem, ...cartItems.slice(index+1)])
      }
      
    

    const onAdd = (product, quaantity) => {
        const productAlreadyInCart = cartItems.find((item) => product._id === item._id)
        
        setTotalPrice((prevPrice) => prevPrice + product.price * quaantity)
         
        if (productAlreadyInCart) {

            const updatedCartItem = {...productAlreadyInCart, quantity: productAlreadyInCart.quantity + quaantity }

            const index = cartItems.findIndex((item) => item._id === product._id)

            setCartItems([...cartItems.slice(0, index), updatedCartItem, ...cartItems.slice(index+1)])
        }
        else {
            setTotalQuantities((prevTotalQuantitites) => prevTotalQuantitites + 1)
            product.quantity = quaantity

            setCartItems([...cartItems, {...product}])
        }

        toast.success(`${quaantity} ${product.name} added`)
    }

    const onRemove = (product) => {
        const updatedCart = cartItems.filter((item) => item._id != product._id)

        setTotalQuantities((currentQuantity) => currentQuantity -= 1)
        setTotalPrice((currentPrice) => currentPrice -= product.price * product.quantity)

        setCartItems(updatedCart) 
    }

    return (
    <Context.Provider
    value={{
        qty, setQty,
        incQty, decQty, onAdd, onRemove,
        showCart, setShowCart, 
        cartItems, setCartItems, toggleCartItemQuanitity, 
        totalPrice, setTotalPrice,
        totalQuantities, setTotalQuantities
    }}>
        {children}  
    </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context)