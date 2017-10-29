import React from 'react';
import { Link } from 'react-router';

import FontAwesome from 'react-fontawesome';

class Header extends React.Component {
    render() {
        const whenLoggedIn = (
            <FontAwesome className='account-logo right' name='user-circle' />
        );
        return (
            <div className="App-Header">
	            <Link to="/" className="App-logo">PRESTIGE</Link>
	            { this.props.isLoggedIn ? whenLoggedIn : undefined }
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