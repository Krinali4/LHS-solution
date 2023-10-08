import React from 'react';
import { history } from '../../store';
import {removeSession} from '../../action'

class Redirect extends React.Component {
    componentDidMount = () => {
        // history.push('/login');
        removeSession();
    }
  render() {
    return (
        <h1> Redirect </h1>
    );
  }
}

export default Redirect;