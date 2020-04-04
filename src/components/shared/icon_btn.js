import React from 'react';
import PropTypes from 'prop-types';

const IconBtn = ({handleClick, classes, materialIcon}) => {
	return(
		<a 	href="javascript:void(0)"
				className="btn btn-link"
				onClick={handleClick}>
				{ materialIcon ? 
					<i className="material-icons">{materialIcon}</i> :
					<i className={classes}></i>
				}
		</a>
	);
}

IconBtn.propTypes = {
	handleClick: PropTypes.func,
	classes: PropTypes.string,
	materialIcon: PropTypes.string
};

export default IconBtn;