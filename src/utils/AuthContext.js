import { useContext, useState, useEffect, createContext } from "react";
import { account, ID } from "../appwrite/config";
import db from '../appwrite/databases';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const loginUser = async (userInfo) => {
        if (user) await account.deleteSession('current');

        setLoading(true);
        
        try {
            let response = await account.createEmailPasswordSession(
                userInfo.email, userInfo.password);

            let accountDetails = await account.get();

            setUser(accountDetails);
        } catch (error) {
            alert(error.message);
        }

        setLoading(false);
    };

    const logoutUser = () => {
        account.deleteSession('current');
        setUser(null);
    };

    const registerUser = async (userInfo) => {
        setLoading(true);

        try {          
            let response = await account.create(
                ID.unique(),
                userInfo.email, 
                userInfo.password1, 
                userInfo.name
            );

            // Log user in immedaitely upon registering
            await account.createEmailPasswordSession(
                userInfo.email, 
                userInfo.password1
            )

            let accountDetails = await account.get();

            setUser(accountDetails);

            // Save user to the user database
            const userPayload = {
                email: userInfo.email,
                name: userInfo.name,
                accountID: accountDetails.$id
            };

            await db.users.create(userPayload);

        } catch (error) {
            alert(error.message);
        }

        setLoading(false);
    };

    const checkUserStatus = async () => {
        try {
            let accountDetails = await account.get();
            setUser(accountDetails);
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    };

    const contextData = {
        user,
        loginUser,
        logoutUser,
        registerUser
    }

    return (
        <AuthContext.Provider value={contextData}>
            { loading ? <div className="vh-100 d-flex justify-content-center align-items-center"><p>Loading...</p></div> : children }
        </AuthContext.Provider>        
    )
}

export const useAuth = () => {return useContext(AuthContext)};

export default AuthContext;