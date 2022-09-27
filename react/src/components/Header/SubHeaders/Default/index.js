import React, {Component} from 'react';
import SignIn from "components/User/SignIn";

export class Default extends Component {
    render() {
        return (
            <SignIn {...this.props} />
        )
    }
}

