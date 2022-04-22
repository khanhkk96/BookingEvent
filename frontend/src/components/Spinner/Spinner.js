import React from 'react';
import './Spinner.css';

const spinner = (props) => {
    return (
        <div className="lds-ripple">
            <div></div>
            <div></div>
        </div>
    );
};

export default spinner;
