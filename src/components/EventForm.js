import React from 'react';
import db from '../appwrite/databases';

function EventForm({setEvents}) {

    const handleAdd = async (e) => {
        // prevent default form behavior
        e.preventDefault();

        // Get the value from the body input field
        const eventBody = e.target.body.value

        // Prevent empty form submission
        if(eventBody === '') return;

        try{
            const payload = {body:eventBody}

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
            <input type='text' name='body' placeholder='Event Name' />
        </form>
    </>

)}

export default EventForm;