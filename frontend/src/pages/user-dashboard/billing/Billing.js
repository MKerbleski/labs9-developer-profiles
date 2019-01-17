import React, { Component } from 'react'
import axios from 'axios'
import styled from 'styled-components';
import { centerFlex } from '../../../global-styles/Mixins';


class Billing extends Component {
  onClickk = () => {
    var handler = window.StripeCheckout.configure({
      key: 'pk_test_V4TVCnAGCgyfBK9pXODIWhfA',
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: function(token) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        console.log(token.id)
        axios.post('https://developer-profiles.herokuapp.com/api/billing', {stripeToken: token.id}).then(res => console.log(res)).catch(err => console.log(err))
      }
    });
    
    document.getElementById('customButton').addEventListener('click', function(e) {
      // Open Checkout with further options:
      handler.open({
        name: 'Demo Site',
        description: '2 widgets',
        amount: 2000
      });
      e.preventDefault();
    });
  }

  render() {
    return (
      <MainFormContainer>
        <button onClick={this.onClickk}>Click to open Billing section and to GET stripe init</button>
        <button id="customButton">Purchase</button>
      </MainFormContainer>
    )
  }
}

const MainFormContainer = styled.main`
  width: calc(100% - 220px);
  margin-left: 220px;
  margin-bottom: 100px;
  padding-top: 50px;
  ${centerFlex()};
`;

export default Billing;