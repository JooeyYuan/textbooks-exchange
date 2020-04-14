import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import {
    getCartItems,
    removeCartItem,
    onSuccessBuy
} from '../../actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import { Result, Empty, Button } from 'antd';
import Axios from 'axios';
import Paypal from '../../components/Paypal';

function CartPage(props) {
    const dispatch = useDispatch();
    const [Total, setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        let cartItems = [];
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                });
                dispatch(getCartItems(cartItems, props.user.userData.cart))

            }
        }
    }, [props.user.userData])

    useEffect(() => {
        if (props.user.cartDetail && props.user.cartDetail.length > 0) {
            calculateTotal(props.user.cartDetail)
        }
    }, [props.user.cartDetail])

    const calculateTotal = (cartDetail) => {
        let total = 0;
        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity
        });
        setTotal(total)
        setShowTotal(true)
    }

    const removeFromCart = (productId) => {
        dispatch(removeCartItem(productId))
            .then(() => {
                Axios.get('/api/users/userCartInfo')
                    .then(response => {
                        if (response.data.success) {
                            if (response.data.cartDetail.length <= 0) {
                                setShowTotal(false)
                            } else {
                                calculateTotal(response.data.cartDetail)
                            }
                        } else {
                            alert('Failed to get cart info')
                        }
                    })
            })
    }

    const transactionSuccess = (data) => {
        let variables = {
            cartDetail: props.user.cartDetail, paymentData: data
        }
        Axios.post('/api/users/successBuy', variables)
            .then(response => {
                if (response.data.success) {
                    setShowSuccess(true)
                    setShowTotal(false)

                    dispatch(onSuccessBuy({
                        cart: response.data.cart,
                        cartDetail: response.data.cartDetail
                    }))

                } else {
                    alert('Failed to buy it')
                }
            })
        Axios.get(`/api/users/sendemail?recipient=${props.user.userData.email}&sender=noreply@TBooks.com&topic=Purchase Confirmation&text=Thank you for your trust with Textbook Exchange. Your purchase is successful, please keep this email as reference.`)
            .then(response => {
                console.log('confirmation sent!')
        })
    }

    const transactionError = () => {
        console.log('Paypal error')
    }

    const transactionCanceled = () => {
        console.log('Transaction canceled')
    }

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h1>My Cart</h1>
            <div>
                <UserCardBlock
                    products={props.user.cartDetail}
                    removeItem={removeFromCart}
                />
                {ShowTotal ?
                    <div style={{ marginTop: '3rem' }}>
                        <h2>Total amount: ${Total} </h2>
                    </div>
                    :
                    ShowSuccess ?
                        <Result
                            status="success"
                            title="Successfully Purchased Items"
                        /> :
                        <div style={{
                            width: '100%', display: 'flex', flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <br />
                            <Empty description={false} />
                            <p>No Items In the Cart</p>
                        </div>
                }
            </div>

            {ShowTotal &&
                <div>
                    <Paypal
                        toPay={Total}
                        onSuccess={transactionSuccess}
                        transactionError={transactionError}
                        transactionCanceled={transactionCanceled}
                    />
                    <p>Or</p>
                    <a href="/chat"><Button type="dashed" size="large">Contact seller for in person exchange</Button></a>
                </div>
            }
        </div>
    )
}

export default CartPage