import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { Link } from 'react-router-dom';

function EventMap({ events }) {
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Load Google Maps script
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS,
        libraries: ['places'],
    });

    if (!isLoaded) {
        return <p>Loading map...</p>;
    }

    const defaultCenter = events.length > 0
        ? { lat: events[0].lat, lng: events[0].lng }
        : { lat: 41.5716204, lng: -88.0623707}

    return (
        <div style={{ height: '500px', width: '100%' }}>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={defaultCenter}
                zoom={5}
            >
                {events.map((event) => (
                    <Marker
                        key={event.$id}
                        position={{ lat: event.lat, lng: event.lng }}
                        onClick={() => setSelectedEvent(event)}
                    />
                ))}

                {selectedEvent && (
                    <InfoWindow
                        position={{ lat: selectedEvent.lat, lng: selectedEvent.lng }}
                        onCloseClick={() => setSelectedEvent(null)}
                    >
                        <div>
                            <h5 className="text-dark">{selectedEvent.title}</h5>
                            <p className="text-dark">{selectedEvent.location}</p>
                            <Link to={`/events/${selectedEvent.$id}`}>View Details</Link>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
}

export default EventMap;