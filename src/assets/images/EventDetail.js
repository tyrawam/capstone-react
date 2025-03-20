// useParams allows grabbing the event ID from the URL to display
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Query } from 'appwrite';
import db from '../appwrite/databases';
import { useAuth } from '../utils/AuthContext'
import EventDetail from '../components/EventDetail';
import defaultImage from '../assets/images/ted-johnsson-h2P_QmHvL-Y-unsplash.jpg';
import DeleteIcon from '../assets/DeleteIcon';

function EventDetailPage() {
    const { eventID } = useParams();
    const navigate = useNavigate();
    
    const [event, setEvent] = useState(null);
    const [ userDoc, setUserDoc ] = useState(null)
    const { user, loginUser } = useAuth()

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
                //const response = await db.users.get(user.$id);
                //const response = await db.users.get("67d6380400262efc4974")
                const response = await db.users.list([Query.equal('accountID', user.$id)])
                //const response3 = response2.documents[0];
                console.log("Fetched user response:", response); // Debugging: Log the response
                //console.log("Fetched user response3:", response3); // Debugging: Log the response
                //console.log("Fetched test response:", response); // Debugging: Log the response
                
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

        if(user.$id == event.ownerID) {
            try {
                await db.events.delete(event.$id);
                navigate('/events');
            } catch (error) {
                console.error("Failed to delete event:", error);
            }

            // Update state
            // setEvents((prevState) => prevState.filter((i) => i.$id !== event.$id));
        }
        else {
            alert("You are not the owner of this event")
        }
    }

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

    // Create a new object without the $databaseId and $collectionId attributes
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

    return (
        <>
        <h1>Event Details</h1>
        {event ? (

            <>
            <div className="row">
                <div className="col-6">
                    <div className="card mb-3">
                        <img className="card-img-top" src={defaultImage} alt="Card image cap" />
                        <div className="card-body">
                        <h5 className="card-title">{event.title}</h5>
                        <p className="card-text">{event.body}</p>
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item text-secondary">{event.location}</li>
                            <li className="list-group-item">Submitted by: {event.ownerName}</li>
                            <li className="list-group-item">{event.date} at {event.startTime}</li>
                        </ul>

                        {user.$id === event.ownerID && (
                            <div onClick={handleDelete}>
                                <DeleteIcon />
                            </div>
                        )}

                        {user.$id !== event.ownerID && event.volunteerList.length < event.spots && userDoc && !(userDoc.events || []).includes(event.$id) && (
                            <div>
                                <button onClick={() => handleRegister(eventID)}>Register for this event</button>
                            </div>
                        )}

                    </div>
                </div>
            </div>





















            <div>
                <h2>Title: {event.title}</h2>
                <p>Body: {event.body}</p>
                <p>Date: {event.date}</p>
                <p>Start Time: {event.startTime}</p>
                <p>OwnerID: {event.ownerID}</p>
                <p>OwnerName: {event.ownerName}</p>
                <p>Location: {event.location}</p>
                <p>Spots: {event.spots}</p>
                <p>Filled: {event.filled}</p>
                {/* <p>Image: {event.image}</p> */}

            </div>
            </>
        ) : (
            <p>Loading...</p>
        )}
        <p><Link to='..' relative='path'>Back</Link></p>
    </>
)}

export default EventDetailPage;