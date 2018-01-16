import React from 'react';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';

import './style.scss';

class Header extends React.Component {
    render() {
        const accountButton = (
            <a className="account-button">
                <FontAwesome className='account-logo right header-buttons' name='user-circle' />
            </a>
        );
        const logoutButton = (
            <a onClick={this.props.onLogout} className="logout-button">
                <FontAwesome className='logout-logo right header-buttons' name='sign-out' />
            </a>
        );
        return (
            <div className="App-Header">
	            <a className="App-logo">PRESTIGE</a>
                { this.props.isLoggedIn ? logoutButton  : undefined }
                { this.props.isLoggedIn ? accountButton  : undefined }
            </div>
        );
    }
}

Header.propTypes = {
    isLoggedIn: React.PropTypes.bool,
    onLogout: React.PropTypes.func
};

Header.defaultProps = {
    isLoggedIn: false,
    onLogout: () => { console.error("logout function not defined");}
};

export default Header;