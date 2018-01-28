import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

// ACTIONS
import { } from 'actions/homework';

// STORE
function mapStateToProps (state) {
  let homework  = state.homework;
  return { }
}

const mapDispatchToProps = (dispatch) => {
  return {
    homeworkBoardRequest: (isInitial, listType, id, username) => {
      return dispatch(homeworkBoardRequest(isInitial, listType, id, username));
    },
  };
};

var contain = (Present)  => {
  class Container extends React.Component {
    // CLASS INNER FUNCTIONS
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    render() {
      let presentState = [];
      let presentProps = [
      ];
      let customProps = {
      };
      let presentFunctions = {
      }

      return (  // Do not modify!!
        <Present
          props={{...(_.pick(this.props, presentProps)), ...customProps}}
          state={_.pick(this.state, presentState)}
          functions={presentFunctions}
        />
      )
    }

    // COMPONENT LIFE CYCLE
    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {}

    // shouldComponentUpdate(nextProps, nextState) { return true }

    componentWillUpdate(nextProps, nextState) {}

    componentDidMount() {}

    componentDidUpdate() {}

    componentWillUnmount() {}

    // CUSTOM FUNCTIONS
  }

  // PROPS SETTING
  Container.propTypes = {
  }

  Container.defaultProps = {
  }


  return connect(mapStateToProps, mapDispatchToProps)(Container);
}


export default contain
