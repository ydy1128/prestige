import React from 'react';
import { connect } from 'react-redux';

// STYLE
let containerStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    border: '#dddddd solid 0.5px',
};

let cssStyle =
<style jsx>{ // put CSS style here
    `
        .hello-world {
            color: green;
        }
    `
}</style>


class TemplateComponentAlone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {

        return (
          <div style={containerStyle}>
            {cssStyle}
            <div className="hello-word"> hello world </div>
          </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { };
};

export default connect(mapStateToProps, undefined)(TemplateComponentAlone);
