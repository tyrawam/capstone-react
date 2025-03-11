import React from 'react';
import db from '../appwrite/databases';
import { useAuth } from '../utils/AuthContext'

function EventForm({setEvents}) {
    const {user, loginUser} = useAuth()

    const handleAdd = async (e) => {
        // prevent default form behavior
        e.preventDefault();

        // Get the value from the body input field
        const eventBody = e.target.body.value
        const eventLocation = e.target.location.value
        const eventTitle = e.target.title.value
        const eventDate = e.target.date.value
        const eventSpots = parseInt(e.target.spots.value)

        // Prevent empty form submission
        if(eventBody === '') return;

        try{
            const payload = {
                body: eventBody, 
                owner: user.$id,
                location: eventLocation,
                title: eventTitle,
                date: eventDate,
                spots: eventSpots                
            }

            const response = await db.events.create(payload)

            // Update the state: New object gets added onto the state
            setEvents((prevState) => [response, ...prevState])

            // Reset the form after submitting input
            e.target.reset();
        } catch(err) {
            console.error(err);
        }
    }

    return (
    <>
        <form onSubmit={handleAdd}>
            <input type='text' name='title' placeholder='Event Name' />
            <input type='text' name='location' placeholder='Event Location' />
            <input type='text' name='date' placeholder='Event Date' />
            <input type='text' name='spots' placeholder='Volunteers Needed' />
            <input type='text' name='body' placeholder='Event Description' />
            <button type='submit'>Add Event</button>
        </form>
    </>

)}

export default EventForm;