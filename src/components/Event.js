import { useState } from 'react';
import { Link } from 'react-router-dom';

function Event({ eventData }) {
    // initial state
    const [event] = useState(eventData)


    return (
        <div className="card mb-3">
            <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="card-title mb-1">{event.date} | {event.title} </h5>
                    <p className="card-text text-muted">{event.location}</p>
                </div>

                <Link to={`/events/${event.$id}`} className="btn btn-primary">
                    View
                </Link>
            </div>
        </div>
    )
}

export default Event;

