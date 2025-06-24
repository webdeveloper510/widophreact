import React, {useState} from "react";

const UserContext = React.createContext();

export const AuthProvider = ({children})=>{
    const [userauth, setAuth] = React.useState({});
    const [location, setLocation] = useState('');
    const [sessionID, setSessionID] = React.useState({});
   

    // console.log('userAuthContext', location)

    return (
        <UserContext.Provider value={{ location, setLocation, userauth, setAuth, sessionID, setSessionID}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;