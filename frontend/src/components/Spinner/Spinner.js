import React from 'react';
import './Spinner.css';

const spinner = (props) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,.25)',
            }}
        >
            <div className="lds-ripple">
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default spinner;
