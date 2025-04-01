// useParams allows grabbing the event ID from the URL to display
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Query } from 'appwrite';
import db from '../appwrite/databases';
import { useAuth } from '../utils/AuthContext'
import defaultImage from '../assets/images/ted-johnsson-h2P_QmHvL-Y-unsplash.jpg';
import DeleteIcon from '../assets/DeleteIcon';
import EventDetailList from '../components/EventDetailList';

function EventDetailPage() {
    const { eventID } = useParams();
    const navigate = useNavigate();
    
    const [event, setEvent] = useState(null);
    const [ userDoc, setUserDoc ] = useState(null);
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // fetch event document
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await db.events.get(eventID);
                setEvent(response);
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
                console.log("Fetched user response:", response); 

                
                if(response.total > 0) {
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
    const handleDelete = async() => {

        if (user.$id !== event.ownerID) {
            alert("You are not the owner of this event");
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
            console.log("Updated event response:", updatedEvent);
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
            console.log("Updated users response:", updatedUserDoc);
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
            console.log("Updated user document after canceling registration:", updatedUserDoc);
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
            console.log("Updated event document after canceling registration:", updatedEvent);
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
            {/* {console.log("Event Volunteer List:", event.volunteerList)} */}
            <div className="row">
                <div className="col-4 offset-2">
                    <div className="card mb-3">
                        <img className="card-img-top" src={defaultImage} alt="Card image cap" />
                        <div className="card-body">

                        {isEditing ? (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const updatedEvent = {
                                        ...event,
                                        title: e.target.title.value,
                                        body: e.target.body.value,
                                        location: e.target.location.value,
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
                                    <span className="input-group-text">Loc.</span>
                                    <input className="form-control" name="location" defaultValue={event.location} required />
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

                                
                                {/* <div className="input-group mb-3">
                                    <span className="input-group-text">Start Time</span>
                                    <input className="form-control" name="startTime" type="time" defaultValue={event.startTime} required />
                                </div> */}

                                <button type="submit" className="btn btn-success me-3">Save</button>
                                <button type="button" className="btn btn-danger" onClick={() => setIsEditing(false)}>Cancel</button>
                            
                            </form>
                        ) : (      
                            <>                  
                            <h5 className="card-title">{event.title}</h5>
                            <p className="card-text">{event.body}</p>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item text-secondary">{event.location}</li>
                                <li className="list-group-item">Submitted by: {event.ownerName}</li>
                                <li className="list-group-item">{event.date} at {event.startTime}</li>
                            </ul>
                        </>
                        )}

                        </div>

                        {/* {user.$id === event.ownerID && (
                            <button onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? "Cancel Edit" : "Edit Event"}
                            </button>
                        )} */}


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
                </div>

            </div>
            </>
        ) : (
            <p>Loading...</p>
        )}
        <p><Link to='..' relative='path'>Back</Link></p>
    </>
)}

export default EventDetailPage;