import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';


function LoadingModal(props) {
    return (
        <div className='modal-background' style={{visibility: props.show ? 'visible' : 'hidden'}}>
            <div className='modal'><CircularProgress/></div>
        </div>
    );
}

export default LoadingModal;
