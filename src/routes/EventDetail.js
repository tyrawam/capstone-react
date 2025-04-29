// useParams allows grabbing the event ID from the URL to display
import { Link, useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, useLoadScript, Autocomplete } from '@react-google-maps/api';
import { useEffect, useState, useRef } from 'react';
import { Query } from 'appwrite';
import db from '../appwrite/databases';
import { useAuth } from '../utils/AuthContext'
import defaultImage from '../assets/images/ted-johnsson-h2P_QmHvL-Y-unsplash.jpg';
import DeleteIcon from '../assets/DeleteIcon';
import EventDetailList from '../components/EventDetailList';

function EventDetailPage() {
    const { user } = useAuth();
    const { eventID } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [userDoc, setUserDoc] = useState(null);
    const [ownerEmail, setOwnerEmail] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const autocompleteRef = useRef(null);

    // Load Google Maps script
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS,
        libraries: ['places'],
    });

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
            const photoReference = place.photos && place.photos.length > 0 ? place.photos[0].getUrl() : null;
            setEvent((prevEvent) => ({
                ...prevEvent,
                location: place.formatted_address,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                image: photoReference || defaultImage
            }));
        }
    };

    // fetch event document
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await db.events.get(eventID);
                setEvent(response);

                // Fetch the owner's email
                const ownerEmail = await db.users.list([Query.equal('accountID', response.ownerID)]);
                if (ownerEmail.total > 0) {
                    setOwnerEmail(ownerEmail.documents[0].email);

                }
            } catch (error) {
                console.error("Failed to fetch event details:", error);
            }
        };

        fetchEvent();
    }, [eventID]);

    // fetch user document
    useEffect(() => {
        const fetchUserDoc = async () => {
            try {
                const response = await db.users.list([Query.equal('accountID', user.$id)])

                if (response.total > 0) {
                    setUserDoc(response.documents[0]);
                } else {
                    console.log("No user found");
                }
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            }
        };

        fetchUserDoc();
    }, []);

    // Delete an event
    const handleDelete = async () => {

        if (user.$id !== event.ownerID) {
            alert("You are not the owner of this event");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this event?");
        if (!confirmDelete) {
            return;
        }

        try {
            // Iterate through the volunteerList and update each user's events array
            if (event.volunteerList && event.volunteerList.length > 0) {
                for (const accountId of event.volunteerList) {
                    try {
                        // Fetch the user document by account ID
                        const response = await db.users.list([Query.equal('accountID', accountId)]);
                        if (response.total > 0) {
                            const userDoc = response.documents[0];

                            // Remove the event ID from the user's events array
                            const updatedEvents = userDoc.events
                                ? userDoc.events.filter(eventId => eventId !== event.$id)
                                : [];

                            // Create a new object without Appwrite metadeta to prevent error
                            const { $databaseId, $collectionId, ...updatedUserDoc } = {
                                ...userDoc,
                                events: updatedEvents,
                            };

                            // Update the user document in the database
                            await db.users.update(userDoc.$id, updatedUserDoc);
                        }
                    } catch (error) {
                        console.error(`Failed to update user with accountID: ${accountId}`, error);
                    }
                }
            }

            // Delete the event document
            await db.events.delete(event.$id);
            console.log("Event deleted successfully");
            navigate('/events'); // Redirect to the events page
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    }

    const handleEditSubmit = async (updatedEvent) => {
        try {
            // Create a new object without Appwrite metadata to prevent error
            const { $databaseId, $collectionId, ...eventPayload } = updatedEvent;

            // Update the event document
            await db.events.update(event.$id, eventPayload);
            setEvent(updatedEvent);
            setIsEditing(false);
            console.log("Event updated successfully:", updatedEvent);
        } catch (error) {
            console.error("Failed to update event:", error);
        }
    };

    // Register for an event
    const handleRegister = async () => {
        if (!userDoc || !event) return;

        // Add the current logged-in user's ID to the volunteerList array
        const updatedVolunteerList = event.volunteerList ? [...event.volunteerList, user.$id] : [user.$id];

        // Create a new object without the $databaseId and $collectionId attributes
        const { $databaseId, $collectionId, ...updatedEvent } = { ...event, volunteerList: updatedVolunteerList };

        // Update the event document
        try {
            await db.events.update(event.$id, updatedEvent);
            setEvent(updatedEvent);
        } catch (error) {
            console.error("Failed to update event:", error);
        }

        // Add the new item to the user's events array
        const updatedEvents = userDoc.events ? [...userDoc.events, event.$id] : [event.$id];

        // Create a new object without Appwrite metadata to prevent error
        const { $databaseId: userDbId, $collectionId: userColId, ...updatedUserDoc } = { ...userDoc, events: updatedEvents };

        // Update the users document
        try {
            await db.users.update(userDoc.$id, updatedUserDoc);
            setUserDoc(updatedUserDoc);
        } catch (error) {
            console.error("Failed to update users:", error);
        }
    }

    // Cancel registration for an event
    const handleCancelRegistration = async () => {
        if (!userDoc || !event) return;

        // Remove the current event's ID from the user's events array
        const updatedEvents = userDoc.events ? userDoc.events.filter(eventId => eventId !== event.$id) : [];

        // Create a new object without Appwrite metadata to prevent error
        const { $databaseId: userDbId, $collectionId: userColId, ...updatedUserDoc } = { ...userDoc, events: updatedEvents };

        // Update the user's document
        try {
            await db.users.update(userDoc.$id, updatedUserDoc);
            setUserDoc(updatedUserDoc);
        } catch (error) {
            console.error("Failed to update user document:", error);
        }

        // Remove the user's account ID from the event's volunteerList array
        const updatedVolunteerList = event.volunteerList ? event.volunteerList.filter(accountId => accountId !== user.$id) : [];

        // Create a new object without Appwrite metadata to prevent error
        const { $databaseId, $collectionId, ...updatedEvent } = { ...event, volunteerList: updatedVolunteerList };

        // Update the event document
        try {
            await db.events.update(event.$id, updatedEvent);
            setEvent(updatedEvent);
        } catch (error) {
            console.error("Failed to update event document:", error);
        }
    }

    // Generate time options for the dropdown in 12-hour format with AM/PM
    const generateTimeOptions = () => {
        const times = [];
        for (let i = 0; i < 24; i++) {
            const hour = i % 12 === 0 ? 12 : i % 12;
            const ampm = i < 12 ? 'AM' : 'PM';
            const hourString = hour < 10 ? `0${hour}` : hour;
            times.push(`${hourString}:00 ${ampm}`);
            times.push(`${hourString}:30 ${ampm}`);
        }
        return times;
    };

    return (
        <>
            <h1>Event Details</h1>

            {event ? (
                <>
                    <div className="row">
                        <div className="col-4 offset-2">
                            <div className="card mb-3">
                                <img className="card-img-top" src={event.image} alt="Card image cap" />
                                <div className="card-body">

                                    {isEditing ? (
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();

                                                const updatedSpots = parseInt(e.target.spots.value);
                                                const registeredUsers = event.volunteerList.length;

                                                if (updatedSpots < 1) {
                                                    alert("You must have at least one spot available.");
                                                    return;
                                                }
                                                
                                                if (updatedSpots < registeredUsers) {
                                                    alert("You cannot reduce the number of spots below the number of registered users.");
                                                    return;
                                                }

                                                const updatedEvent = {
                                                    ...event,
                                                    title: e.target.title.value,
                                                    body: e.target.body.value,
                                                    location: e.target.location.value,
                                                    lat: event.lat,
                                                    lng: event.lng,
                                                    spots: parseInt(e.target.spots.value),
                                                    date: e.target.date.value,
                                                    startTime: e.target.startTime.value,
                                                };
                                                handleEditSubmit(updatedEvent);
                                            }}
                                        >
                                            <div className="input-group mb-3">
                                                <span className="input-group-text">Title</span>
                                                <input className="form-control" name="title" defaultValue={event.title} required />
                                            </div>

                                            <div className="input-group mb-3">
                                                <span className="input-group-text">Desc.</span>
                                                <textarea className="form-control" name="body" defaultValue={event.body} required />
                                            </div>

                                            <div className="input-group mb-3">
                                                <span className="input-group-text">Location</span>
                                                <div style={{ flex: 1 }}>
                                                    <Autocomplete
                                                        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                                                        onPlaceChanged={handlePlaceChanged}
                                                    >
                                                        <input
                                                            className="form-control"
                                                            name="location"
                                                            placeholder="Search for a location"
                                                            defaultValue={event.location}
                                                            required
                                                        />
                                                    </Autocomplete>
                                                </div>
                                            </div>

                                            <div className="input-group mb-3">
                                                <span className="input-group-text">Spots</span>
                                                <input className="form-control" name="spots" defaultValue={event.spots} required />
                                            </div>

                                            <div className="input-group mb-3">
                                                <span className="input-group-text">Date</span>
                                                <input className="form-control" name="date" type="date" defaultValue={event.date} required />
                                            </div>


                                            <div className="input-group mb-3">
                                                <span className="input-group-text">Time</span>
                                                <select name="startTime" className="form-control" defaultValue={event.startTime} required>
                                                    {generateTimeOptions().map((time) => (
                                                        <option key={time} value={time}>{time}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <button type="submit" className="btn btn-success me-3">Save</button>
                                            <button type="button" className="btn btn-danger" onClick={() => setIsEditing(false)}>Cancel</button>

                                        </form>
                                    ) : (
                                        <>
                                            <h5 className="card-title"><b>{event.title}</b></h5>
                                            <p className="card-text">{event.body}</p>
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item">{event.location}</li>
                                                <li className="list-group-item">{event.date} at {event.startTime}</li>
                                                <li className="list-group-item text-secondary">Submitted by: {event.ownerName} {" "} 
                                                    <a href={`mailto:${ownerEmail}?subject=Inquiry about your event: ${event.title}`}>{"(Send them an email!)"}</a></li>

                                            </ul>
                                        </>
                                    )}

                                </div>

                                {user.$id === event.ownerID && !isEditing && (
                                    <button onClick={() => setIsEditing(true)}>
                                        Edit Event
                                    </button>
                                )}

                                {user.$id === event.ownerID && !isEditing && (
                                    <div onClick={handleDelete}>
                                        <DeleteIcon />
                                    </div>
                                )}

                                {user.$id !== event.ownerID && event.volunteerList.length < event.spots && userDoc && !(userDoc.events || []).includes(event.$id) && (
                                    <div>
                                        <button onClick={() => handleRegister(eventID)}>Register for this event</button>
                                    </div>
                                )}

                                {user.$id !== event.ownerID && userDoc && (userDoc.events || []).includes(event.$id) && (
                                    <div>
                                        <button onClick={handleCancelRegistration}>Cancel Registration</button>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Event Detail List */}

                        <div className="col-4">
                            <EventDetailList volunteerList={event.volunteerList} spots={event.spots} />
                            <div className="mt-5" style={{ height: '400px', width: '100%' }}>
                                <GoogleMap
                                    mapContainerStyle={{ width: '100%', height: '100%' }}
                                    center={{
                                        lat: event.lat || 0,
                                        lng: event.lng || 0,
                                    }}
                                    zoom={15}
                                >
                                    <Marker
                                        position={{
                                            lat: event.lat || 0,
                                            lng: event.lng || 0,
                                        }}
                                    />
                                </GoogleMap>
                            </div>

                            {/* Get Directions Button */}
                            <div className="mt-3">
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                >
                                    Get Directions
                                </a>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
            <p><Link to='..' relative='path' className="btn btn-secondary">Back</Link></p>
        </>
    )
}

export default EventDetailPage;