import { useState, createContext, useContext } from "react";

const UserContext = createContext();

const UserContextProvider = ({children}) => {
    const [userID, setUserID] = useState('ABCDEFGH')

    return (
		<UserContext.Provider value={{userID}}>
			{children}
		</UserContext.Provider>
    )
};

export {UserContext, UserContextProvider}