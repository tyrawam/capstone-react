import { useEffect, useState } from 'react';
import db from '../appwrite/databases';
import EventForm from '../components/EventForm';
import { Query } from 'appwrite';

function EventFormPage() {
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
        <div className="container mt-5">
            <EventForm setEvents={setEvents} />
        </div>
    )
};

export default EventFormPage;