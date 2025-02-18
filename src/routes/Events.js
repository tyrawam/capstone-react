import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import db from '../appwrite/databases';
import EventForm from '../components/EventForm';
import { Query } from 'appwrite';                   // allows ordering of event list
import Event from '../components/Event';

function EventsPage() {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        init()
    }, []);

    const init = async () => {
        const response = await db.events.list(
            // list events by descending order based on creation time (newest listed first)
            [Query.orderDesc('$createdAt')]
        );

        setEvents(response.documents);
    };

    return (
    <>
        <h1>Events Page</h1>
        <EventForm setEvents={setEvents}/>
        <div>
            {events.map(ev => (
                <Event key={ev.$id} setEvents={setEvents} eventData={ev} />
            ))}
        </div>
        <p>Go back to <Link to='/'>Home Page</Link>.</p>
    </>
)}

export default EventsPage;