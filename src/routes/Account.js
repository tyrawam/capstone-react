import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext'
import db from '../appwrite/databases';
import { Query } from 'appwrite';
import { useEffect, useState } from 'react';

function AccountPage() {
    const { user } = useAuth()
    const [registeredEvents, setRegisteredEvents] = useState([]);

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

        fetchRegisteredEvents();
    }, [user.$id]);


    return (
        <>
            {/* <h1>Account Page</h1> */}

            <p>Welcome {`${user.name}`}! | {`${user.$id}`}</p>

            <h2>Your Registered Events</h2>
            {registeredEvents.length > 0 ? (
                <ul>
                    {registeredEvents.map((event) => (
                        <li key={event.$id}>
                            <Link to={`/events/${event.$id}`}>{event.title}</Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have not registered for any events yet. Head over to <Link to='/events'>the Events page</Link> to sign up now!</p>
            )}

            <p>Go back to <Link to='/'>Home Page</Link>.</p>
        </>
)};

export default AccountPage;