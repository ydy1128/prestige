import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

const iconStyles = {
  marginRight: 24,
};

const Icon = (props) => {
    let {tooltip, style, title} = props;
    return (
        <IconButton tooltip={tooltip}
          tooltipPosition="bottom-right"
         >
            <FontIcon className="material-icons" style={style||iconStyles}>{title}</FontIcon>
         </IconButton>
    )
}

export default Icon
