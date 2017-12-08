import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

// ACTIONS

// STORE
function mapStateToProps ({dataReducer}) {
    //let  {  } = dataReducer
    return { }
}

var contain = (Present)  => {
    class Container extends React.Component {

        // CLASS INNER FUNCTIONS
        constructor(props) {
            super(props);
            this.state = {url: ""};
            this._onClick = this._onClick.bind(this);
        }

        render() {
            let presentState = [];
            let presentProps = [];
            let customProps = {customValue: this.value};
            let presentFunctions = {
                onClick: this._onClick
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
        componentWillMount() {}

        componentWillReceiveProps(nextProps) {}

        // shouldComponentUpdate(nextProps, nextState) { return true }

        componentWillUpdate(nextProps, nextState) {}

        componentDidMount() {}

        componentDidUpdate() {}

        componentWillUnmount() {}

        // CUSTOM FUNCTIONS
        _onClick(action){
            return (e) => {
                switch (action) {
                    case 'new':

                        break;
                    case 'modify':

                        break;
                    default:
                }
            }
        }
    }


    // PROPS SETTING
    Container.propTypes = {
        values: PropTypes.array,
    }

    Container.defaultProps = {
        values: [1,3],
    }


    return connect(mapStateToProps, undefined)(Container);
}


export default contain
