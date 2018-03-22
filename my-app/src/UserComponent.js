import React, { Component } from 'react';
import axios from 'axios';

class UserComponent extends Component {
    componentWillMount() {
        axios.get('http://localhost/me')
            .then()
            .catch()
    }
    render() { 
        return ( 
            <div> Try this for now until tomorrow</div>
        );
    }
}
 
export default UserComponent;