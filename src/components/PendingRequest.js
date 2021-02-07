import React from 'react';
import '../styles/PendingRequest.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';
export default function PendingRequest(props){
    let {socketId, toastId, username, onHandlePendingRequest} = props;
    const dispatchRequest = (accept) => onHandlePendingRequest(socketId, toastId, username, accept);
    return (
        <div className="pending-request" key={socketId}>
            <div>{username} with id {socketId} wants to join this meeting</div>
            <button className="success" 
                onClick={() => dispatchRequest(true)}>
                <FontAwesomeIcon icon={faCheck} /> Accept
            </button>
            <button className="danger" 
                onClick={() => dispatchRequest(false)}>
                <FontAwesomeIcon icon={faTimes} /> Reject
            </button>
        </div>
    );
};