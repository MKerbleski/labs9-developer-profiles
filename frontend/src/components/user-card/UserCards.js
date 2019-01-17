import React , { Component } from 'react'
import styled from 'styled-components'
import UserCard from '../../components/user-card/UserCard'
import axios from 'axios';

export default class UserCards extends Component {
    constructor(props){
        super(props)
        this.state = {
            users: [],
            raw: [],
        }
    }

    componentDidMount() {
        axios.get('https://developer-profiles.herokuapp.com/users').then(response => {
            this.setState({raw: response.data, users: response.data})
        }).catch(error => {
            console.log(error)
        })
    }

    componentWillReceiveProps(){
        let tempArr = this.state.raw.filter(item => {
            return this.props.params.filters.includes(item.filter)
        })
        if(tempArr.length === 0){
            tempArr = this.state.raw
        }
        this.setState({
            users: tempArr,
        })
        this.props.updateLength(tempArr.length)
    }

    render(){
        return(
            <UserCardsDiv> 
                {this.state.users.map(user => <UserCard 
                    acclaim={user.badge}
                    key={user.id}
                    first_name={user.first_name} 
                    last_name={user.last_name} 
                    image={`https://picsum.photos/200/300/?image=${user.id % 50}`} 
                    summary={user.summary} 
                    title={user.title}
                    location={user.location}/>)}
            </UserCardsDiv>
        )
    }
}

const UserCardsDiv = styled.div`
    border: 1px solid red;
`