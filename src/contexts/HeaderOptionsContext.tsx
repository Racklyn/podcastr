import {createContext, ReactNode, useContext, useState} from 'react'

type HeaderOptionsContextData = {
    isDarkTheme: boolean;
    searchValue: string;
    changeTheme: (boolean) => void;
    setSearchValue: (string) => void;
}


export const HeaderOptionsContext = createContext({} as HeaderOptionsContextData);


type HeaderContextProviderProps = {
    children: ReactNode; //Qualquer elemento tsx/html...
}

export function HeaderOptionsContextProvider({children}: HeaderContextProviderProps){
      // Serão usadas para alterar os valores de PlayerContext
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  function changeTheme(){
    setIsDarkTheme(!isDarkTheme)
  }

  return(
    <HeaderOptionsContext.Provider 
        value={
            {
                isDarkTheme,
                searchValue,
                changeTheme,
                setSearchValue
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