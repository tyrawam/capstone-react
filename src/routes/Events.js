import { useEffect, useState } from 'react';
import db from '../appwrite/databases';
import EventMap from '../components/EventMap';
import { Query } from 'appwrite';
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
        <div className="container mt-5">
            <div className="row">
                {/* Left Column: List Events */}
                <div className="col-md-4">
                    <h2>All Events</h2>
                    <div className="event-list">
                        {events.length > 0 ? (
                            events.map((ev) => (
                                <Event key={ev.$id} setEvents={setEvents} eventData={ev} />
                            ))
                        ) : (
                            <p>No events available. Create one using the form on the left!</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Display all events on map */}
                <div className="col-md-8">
                    <h2>Event Locations</h2>
                    <EventMap events={events} />
                </div>
            </div>
        </div>
    )
}

export default EventsPage;