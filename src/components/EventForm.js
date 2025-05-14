import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import db from '../appwrite/databases';
import { useAuth } from '../utils/AuthContext'

function EventForm({ setEvents }) {
    const { user } = useAuth()
    const [location, setLocation] = useState('');
    const [latLng, setLatLng] = useState({ lat: null, lng: null });
    const [imageReference, setImageReference] = useState(null);
    const autocompleteRef = useRef(null);
    const navigate = useNavigate();

    // Load Google Maps script
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS,
        libraries: ['places'],
    });

    const handleAdd = async (e) => {
        // prevent default form behavior
        e.preventDefault();

        // Get the value from the body input field
        const eventBody = e.target.body.value
        const eventTitle = e.target.title.value
        const eventDate = e.target.date.value
        const eventTime = e.target.startTime.value
        const eventSpots = parseInt(e.target.spots.value)

        // Prevent empty form submission
        if (eventBody === '') return;

        // Require numeric value for spots
        if (isNaN(eventSpots) || eventSpots <= 0) {
            alert('Spots must be a number greater than 0')
            return;
        }

        // Require valid date
        if (isNaN(Date.parse(eventDate))) {
            alert('Date must be a valid date')
            return;
        }

        // Fixes error with drop down menu for time selection. First converts to 24 hour format, then to 12 hour format with toLocaleTimeString()
        const [time, modifier] = eventTime.split(' ');
        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }

        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        const timeString = new Date(`1970-01-01T${hours}:${minutes}:00`).toLocaleTimeString([],
            { hour: '2-digit', minute: '2-digit', hour12: true });

        try {
            const payload = {
                body: eventBody,
                ownerID: user.$id,
                ownerName: user.name,
                location: location,
                lat: latLng.lat,
                lng: latLng.lng,
                title: eventTitle,
                date: eventDate,
                startTime: timeString,
                spots: eventSpots,
                image: imageReference
            }

            const response = await db.events.create(payload)

            // Update the state: New object gets added onto the state
            setEvents((prevState) => [response, ...prevState])

            // Redirect to the event details page after adding the even
            navigate(`/events/${response.$id}`);
        } catch (err) {
            console.error(err);
        }
    }

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
            setLocation(place.formatted_address);
            setLatLng({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            });

            // Get the first photo reference if available
            const photoReference = place.photos && place.photos.length > 0 ? place.photos[0].getUrl() : null;
            setImageReference(photoReference);
        }
    };

    if (!isLoaded) return <div className="vh-100 d-flex justify-content-center align-items-center"><p>Loading...</p></div>;

    // Get tomorrow's date in YYYY-MM-DD format
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    const minDate = tomorrow.toISOString().split('T')[0];

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
            <div className="row">
                <h1 className="text-center">New Event</h1>
                <div className="col-md-6 offset-md-3">
                    <div className="card shadow">
                        <div className="card-body"></div>
                        <form onSubmit={handleAdd}>
                            <div className="mb-3">
                                <label className="form-label" for="title">Title</label>
                                <input type='text' name='title' placeholder='Event Name' className="form-control" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label" htmlFor="location">Location</label>
                                <Autocomplete
                                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                                    onPlaceChanged={handlePlaceChanged}
                                >
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="Search for a location"
                                        className="form-control"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </Autocomplete>
                            </div>

                            <div className="mb-3">
                                <label className="form-label" for="date">Date</label>
                                <input type='date' name='date' placeholder='Event Date' className="form-control" min={minDate} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label" htmlFor="startTime">Time</label>
                                <select name="startTime" className="form-control">
                                    {generateTimeOptions().map((time) => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label" for="spots">Spots</label>
                                <input type='text' name='spots' placeholder='Volunteers Needed' className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" for="body">Description</label>
                                <textarea type='text' name='body' placeholder='Event Description' className="form-control" />
                            </div>

                            <button className="btn btn-primary mb-3" type='submit'>Add Event</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EventForm;