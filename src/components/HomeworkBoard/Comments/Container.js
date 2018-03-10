import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import axios from 'axios';

// ACTIONS
import {homeworkBoardRequest} from 'actions/homework';
import { log } from "util";

// STORE
function mapStateToProps (state) {
  let homework  = state.homework;
  let userInfo = state.authentication.status.currentUser;
  return { userInfo }
}

const mapDispatchToProps = (dispatch) => {
  return {
    homeworkBoardRequest: (id) => {
      return dispatch(homeworkBoardRequest(id));
    },
  };
};

var contain = (Present)  => {
  class Container extends React.Component {
    // CLASS INNER FUNCTIONS
    constructor(props) {
      super(props);
      this.state = {};      
    }
    break;
    render() {
      let presentState = [];
      let presentProps = ['comments'];
      let customProps = {
      };
      let presentFunctions = {
        updateComment: this._updateComment.bind(this),
        postComment: this._postComment.bind(this),
        deleteComment: this._deleteComment.bind(this)
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

    componentWillReceiveProps(nextProps) {
    }

    // shouldComponentUpdate(nextProps, nextState) { return true }

    componentWillUpdate(nextProps, nextState) {
      return true
    }

    componentDidMount() {}

    componentDidUpdate() {}

    componentWillUnmount() {}

    // CUSTOM FUNCTIONS
    _postComment() {
      return (e) => {
        let content = document.getElementById('comment-poster-textarea').value;
        
        let contents = {
          content,
          homeworkId: this.props.hwId,
        }
        
        axios.post('/api/comments',{ contents }).then((res)=>{
          this.props.homeworkBoardRequest(this.props.hwId);
        })
      }
    }

    _updateComment(id, contents) {
      axios.put('/api/comments/'+id,{ contents }).then((res)=>{
        this.props.homeworkBoardRequest(this.props.hwId);
      })
    }

    _deleteComment(id) {
      return (e) => {
        axios.delete('/api/comments/'+id).then((res)=>{
          console.log(res.data.success);
          this.props.homeworkBoardRequest(this.props.hwId);
        })
      }
    }
  }

  // PROPS SETTING
  Container.propTypes = {
  }

  Container.defaultProps = {
  }


  return connect(mapStateToProps, mapDispatchToProps)(Container);
}


export default contain
