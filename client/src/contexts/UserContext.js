import { useState, createContext, useContext, Children } from "react";

const UserContext = createContext();

const UserContextProvider = ({Children}) => {
    const [userID, setUserID] = useState('ABCDEFGH')

    return (
		<UserContext.Provider value={userID}>
			{Children}
		</UserContext.Provider>
    )
};

export {UserContext, UserContextProvider}