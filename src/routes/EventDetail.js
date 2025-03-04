// useParams allows grabbing the event ID from the URL to display
import { Link, useParams } from 'react-router-dom';

function EventDetailPage() {
    const params = useParams();

    return (
    <>
        <h1>Event Details</h1>
        <p>{params.eventID}</p>
        {/* "relative" allows going back to event page rather than home page */}
        <p><Link to='..' relative='path'>Back</Link></p>
    </>
)}

export default EventDetailPage;