import React from "react";
import { connect } from 'react-redux';

import throwError from 'components/commons/throwError';

var container = (Present) =>{
	class Container extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
            }
        }
        render(){
            let presentState = [];
            let presentProps = [];
            let customProps = {
                classData: this.props.classData,
                lectureData: this.props.lectureData,
                homeworkData: this.props.homeworkData,
            };
            let presentFunctions = {

            }

        	return(
                <Present  
                    props={{...(_.pick(this.props, presentProps)), ...customProps}}
                    state={_.pick(this.state, presentState)}
                    functions={presentFunctions}
                />
        	)
        }

    }
	return connect(mapStateToProps, mapDispatchToProps)(Container);
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}

const mapStateToProps = (state) => {
    return {
        classData: state.makeclass.board.data,

        lectureData: state.lecture.board.data,
        homeworkData: state.homework.board.data,
    }
}
export default container;