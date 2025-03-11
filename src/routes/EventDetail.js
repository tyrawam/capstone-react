// useParams allows grabbing the event ID from the URL to display
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import db from '../appwrite/databases';


function EventDetailPage() {
    const { eventID } = useParams();

    const [event, setEvent] = useState(null);

    useEffect(()=> {
        init()
    }, []);

    const init = async () => {
        const response = await db.events.get(eventID);
        setEvent(response);
    }

    return (
        <>
        <h1>Event Details</h1>
        {event ? (
            <div>
                <h2>{event.title}</h2>
                <p>{event.body}</p>
                {/* Add more event details as needed */}
            </div>
        ) : (
            <p>Loading...</p>
        )}
        <p><Link to='..' relative='path'>Back</Link></p>
    </>
)}

export default EventDetailPage;