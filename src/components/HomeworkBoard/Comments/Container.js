import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import axios from 'axios';

import { log } from "util";

import {
  getCommentsByHomeworkId,
  appendCommentByHomeworkId
} from 'actions/comment';

var contain = (Present)  => {
  class Container extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        newComment: ''
      };
    }

    async componentWillMount() {
      let requestResult = await this.props.getCommentsByHomeworkId(this.props.homeworkId);
      if (!requestResult.success) {
        console.log('fail to get comments' + JSON.stringify(requestResult));      
      }
    }

    render() {
      let presentState = ['newComment'];
      let presentProps = ['comments'];
      let customProps = {};
      let presentFunctions = {
        changeNewComment: this.changeNewComment.bind(this),
        appendComment: this.appendComment.bind(this),
      };

      return (
        <Present
          props={{...(_.pick(this.props, presentProps)), ...customProps}}
          state={_.pick(this.state, presentState)}
          functions={presentFunctions}
        />
      );
    }

    changeNewComment(e) {
      this.setState({newComment: e.target.value});
    }

    appendComment(e) {
      this.props.appendCommentByHomeworkId(this.props.homeworkId, {content: this.state.newComment});
      this.setState({newComment: ''});
    }
  }

  Container.propTypes = {
  }

  Container.defaultProps = {
  }

  return connect(mapStateToProps, mapDispatchToProps)(Container);
}

const mapStateToProps = (state) => {
  let comments = state.comment.data;
  let userInfo = state.authentication.status.currentUser;
  return { comments, userInfo }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCommentsByHomeworkId: (homeworkId) => {
      return dispatch(getCommentsByHomeworkId(homeworkId));
    },
    appendCommentByHomeworkId: (homeworkId, comment) => {
      return dispatch(appendCommentByHomeworkId(homeworkId, comment));
    }
  };
};

export default contain