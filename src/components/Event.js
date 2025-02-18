import {useState} from 'react';
import db from '../appwrite/databases';
import DeleteIcon from '../assets/DeleteIcon';

function Event({ setEvents, eventData}) {

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
        db.events.delete(event.$id);

        // Update state
        setEvents((prevState) => prevState.filter((i) => i.$id !== event.$id));

    }

    return (
    <>
        <div>
            {/* {event.body} */}

            {/* if event is filled, strike it through */}
            <span onClick={handleUpdate}>
                {event.filled ? <s>{event.body}</s> : <>{event.body}</>}
            </span>

            <div onClick={handleDelete}>
                <DeleteIcon />
            </div>
        </div>
    </>    
)}

export default Event;