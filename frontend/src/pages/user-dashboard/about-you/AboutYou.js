import React, { Component } from 'react'
import styled from 'styled-components';
import { centerFlex } from '../../../global-styles/Mixins';


class AboutYou extends Component {
  state = {
    
  }
  render() {
    return (
      <MainFormContainer>
        <h1>About You</h1>
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

export default AboutYou;
