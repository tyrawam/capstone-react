import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext'
import db from '../appwrite/databases';
import { Query } from 'appwrite';
import { useEffect, useState } from 'react';

function AccountPage() {
    const { user } = useAuth()
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [createdEvents, setCreatedEvents] = useState([]);

    useEffect(() => {
        const fetchRegisteredEvents = async () => {
            try {
                // Fetch the user's document to get the registered events
                const userDoc = await db.users.list([Query.equal('accountID', user.$id)]);

                if (userDoc.documents.length > 0) {
                    const eventsList = userDoc.documents[0].events;

                    // Check if the user has registered events
                    if (eventsList && eventsList.length > 0) {
                        
                        // Fetch details of each registered event
                        const events = await Promise.all(
                            eventsList.map(async (eventId) => {
                                const event = await db.events.get(eventId);
                                return event;
                            })
                        );
                        setRegisteredEvents(events);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch registered events:', error);
            }
        };

        const fetchCreatedEvents = async () => {
            try {
                // Fetch events where the ownerID matches the user's accountID
                const response = await db.events.list([Query.equal('ownerID', user.$id)]);
                setCreatedEvents(response.documents);
            } catch (error) {
                console.error('Failed to fetch created events:', error);
            }
        };

        fetchRegisteredEvents();
        fetchCreatedEvents();
    }, [user.$id]);


    return (
        <>
            <div className="container mt-5">
                <h1 className="text-center mb-4">Welcome, {user.name}!</h1>
                <div className="row">
                    {/* Created Events Column */}
                    <div className="col-md-6">
                        <h2>Your Created Events</h2>
                        {createdEvents.length > 0 ? (
                            <div className="row">
                                {createdEvents.map((event) => (
                                    <div className="col-md-12 mb-3" key={event.$id}>
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title">{event.title}</h5>
                                                <p className="card-text">{event.location}</p>
                                                <Link to={`/events/${event.$id}`} className="btn btn-primary">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>You have not created any events yet. Head over to <Link to='/events'>the Events page</Link> to create one now!</p>
                        )}
                    </div>

                    {/* Registered Events Column */}
                    <div className="col-md-6">
                        <h2>Your Registered Events</h2>
                        {registeredEvents.length > 0 ? (
                            <div className="row">
                                {registeredEvents.map((event) => (
                                    <div className="col-md-12 mb-3" key={event.$id}>
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title">{event.title}</h5>
                                                <p className="card-text">{event.location}</p>
                                                <Link to={`/events/${event.$id}`} className="btn btn-primary">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>You have not registered for any events yet. Head over to <Link to='/events'>the Events page</Link> to sign up now!</p>
                        )}
                    </div>
                </div>
                <div className="text-center mt-4">
                    <Link to="/" className="btn btn-secondary">Go Back to Home Page</Link>
                </div>
            </div>
        </>
    )
};

export default AccountPage;