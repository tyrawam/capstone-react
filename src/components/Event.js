import {useState} from 'react';
import { Link } from 'react-router-dom';
import db from '../appwrite/databases';
import DeleteIcon from '../assets/DeleteIcon';
import { useAuth } from '../utils/AuthContext'

function Event({ setEvents, eventData}) {
    const {user, loginUser} = useAuth()

    // initial state
    const [event, setEvent] = useState(eventData)

    // Update event's filled state (True or False)
    const handleUpdate = async() => {
        const filled = !event.filled
        db.events.update(event.$id, {filled});
        // Update state
        setEvent({...event, filled:filled});
    }

    // Delete an event
    const handleDelete = async() => {

        if(user.$id == event.owner) {
            db.events.delete(event.$id);
            // Update state
            setEvents((prevState) => prevState.filter((i) => i.$id !== event.$id));
        }
        else {
            alert("You are not the owner of this event")
        }
    }

    return (
    <>
        <div>

            {/* if event is filled, strike it through */}
            <span onClick={handleUpdate}>
                {event.filled ? <s>{event.title}</s> : <>{event.title}</>}
            </span>
            {/* <span>
                {event.location}
            </span> */}

            {/* Link to specific event by passing id to events/:eventID route */}
            <Link to={`/events/${event.$id}`}>View Details</Link>

            <span onClick={handleDelete}>
                <DeleteIcon />
            </span>
        </div>
    </>    
)}

export default Event;