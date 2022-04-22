import React from 'react';

import './EventItem.css';

const eventItem = (props) => {
    return (
        <li key={props.eventId} className="events__list-item">
            <div>
                <h2>{props.title}</h2>
                <h4>{props.price}</h4>
            </div>
            <div>
                {props.userId !== props.creatorId ? (
                    <button className="btn">View Details</button>
                ) : (
                    <p>Your the owner of this event.</p>
                )}
            </div>
        </li>
    );
};

export default eventItem;
