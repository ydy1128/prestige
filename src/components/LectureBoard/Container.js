import React from "react";
import { connect } from 'react-redux';

let container = (Present) =>{
	class Container extends React.Component {

	    render() {
	        let presentState = [];
	        let presentProps = [];
	        let customProps = {
	        };
	        let presentFunctions = {
	        }

	        return (  // Do not modify!!
	            <Present />
	        )
	    }
	}
	Container.propTypes = {
	    lectureData: React.PropTypes.array,
	}
	Container.defaultProps = {
	    lectureData: [],
	}
	// return connect(mapStateToProps, mapDispatchToProps)(Container);
	return Container;
}

export default container;