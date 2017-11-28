import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import { StudentObj } from 'components';

class StudentBoard extends React.Component{
	constructor(props){
		super(props);
        this.state = {

        }

	}
    render(){
        const boardHeader = (
            <div className="Board-header col m12">
                <div className="col m4"><h4>학생관리</h4></div>
                <div className="icons col m8">
                    <a>
                        <FontAwesome className={'remove-button right inactive'} name="trash-o" />
                    </a>
                </div>
            </div>
        )
        const mapToComponents = data => {
            return data.map((stdobj, i) => {
                let childname = 'stboard-'+stdobj._id;
                return (<StudentObj ref={childname} data={stdobj} key={stdobj._id}/>);
            });
        };
        
        return(
            <div className="Boards">
                { boardHeader }
                <hr className="col m12"/>
                <div className="Board-contents row">
                    {mapToComponents(this.props.studentsData)}
                </div>
            </div>
        )
    }
}

StudentBoard.propTypes = {
    studentsData: React.PropTypes.array,
}
StudentBoard.defaultProps = {
    studentsData: [],
}
export default StudentBoard;