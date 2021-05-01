import {createContext, ReactNode, useContext, useState} from 'react'

type HeaderOptionsContextData = {
    isDarkTheme: boolean;
    changeTheme: (boolean) => void;
    // clearPlayerState: () => void;
    // setPlayingState: (state: boolean) => void;
}


export const HeaderOptionsContext = createContext({} as HeaderOptionsContextData);


type HeaderContextProviderProps = {
    children: ReactNode; //Qualquer elemento tsx/html...
}

export function HeaderOptionsContextProvider({children}: HeaderContextProviderProps){
      // Serão usadas para alterar os valores de PlayerContext
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  function changeTheme(){
    setIsDarkTheme(!isDarkTheme)
  }

  return(
    <HeaderOptionsContext.Provider 
        value={
            {
                isDarkTheme,
                changeTheme
            }
        }
    >
        {children}
    </HeaderOptionsContext.Provider>
  )
}


export const useHeaderOptions = () => {
    return useContext(HeaderOptionsContext)
}