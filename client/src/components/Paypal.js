import React from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';

export default class Paypal extends React.Component {
    render() {
        const onSuccess = (payment) => {
            // Congratulation, it came here means everything's fine!
            console.log("The payment was succeeded!", payment);
            // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
            this.props.onSuccess(payment);
        
        }
        const onCancel = (data) => {
            // User pressed "cancel" or close Paypal's popup!
            console.log('The payment was cancelled!', data);
            // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
        }
        const onError = (err) => {
            console.log("Error!", err);
           
        }
        let env = 'sandbox'; // you can set here to 'production' for production
        let currency = 'USD'; // or you can set this value from your props or state
        let total = this.props.toPay; // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
        const client = {
            sandbox: 'AQ0qhKSi01VWHdGNE3mOjxipP_NOr6yKS84cV-J6_SpOsoxtWEIkolqjY_ePlq40RDpKCONuYkElt8qc',
            production: 'AQ0qhKSi01VWHdGNE3mOjxipP_NOr6yKS84cV-J6_SpOsoxtWEIkolqjY_ePlq40RDpKCONuYkElt8qc',
        }
        
        return (
            <PaypalExpressBtn
                env={env}
                client={client}
                currency={currency}
                total={total}
                onError={onError}
                onSuccess={onSuccess}
                onCancel={onCancel}
                style={{ 
                    size:'large',
                    color:'blue',
                    shape: 'rect',
                    label: 'checkout'
                }}
            />
        );
    }
}