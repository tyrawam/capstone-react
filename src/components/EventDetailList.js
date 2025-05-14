import { useEffect, useState } from 'react';
import db from '../appwrite/databases';
import { Query } from 'appwrite';

const EventDetailList = ({ volunteerList, spots }) => {
    const [userNames, setUserNames] = useState([]); // State to store user names

    useEffect(() => {
        const fetchUserNames = async () => {
            try {
                const names = await Promise.all(
                    (volunteerList || []).map(async (userId) => {

                        // Fetch user details by userId
                        const response = await db.users.list([Query.equal('accountID', userId)]);
                        if (response.total > 0) {
                            return response.documents[0].name;
                        }

                        // Fallback if user not found
                        return 'Unknown User'; 
                    })
                );
                setUserNames(names);
            } catch (error) {
                console.error('Failed to fetch user names:', error);
            }
        };

        fetchUserNames();
    }, [volunteerList]);

    const openSpots = Math.max(0, spots - (volunteerList?.length || 0));

    return (
        <div className="card">
            <div className="card-header">
            <h5>Registered Users - {openSpots} more volunteers needed!</h5>
            </div>
            <ul className="list-group list-group-flush">
                {/* Display registered user names */}
                {userNames.map((name, index) => (
                    <li key={`user-${index}`} className="list-group-item">
                        {name}
                    </li>
                ))}

                {/* Display blank lines for open spots */}
                {Array.from({ length: openSpots }, (_, index) => (
                    <li key={`open-${index}`} className="list-group-item text-secondary">
                        Open Spot
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventDetailList;