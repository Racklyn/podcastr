import {createContext, ReactNode, useContext, useState} from 'react'

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    tooglePlay: () => void;
    toogleLoop: () => void;
    toogleShuffle: () => void;
    clearPlayerState: () => void;
    setPlayingState: (state: boolean) => void;
}


export const PlayerContext = createContext({} as PlayerContextData);


type PlayerContextProviderProps = {
    children: ReactNode; //Qualquer elemento tsx/html...
}

export function PlayerContextProvider({children}: PlayerContextProviderProps){
      // Serão usadas para alterar os valores de PlayerContext
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = isShuffling || (currentEpisodeIndex + 1 < episodeList.length)

  function play(episode: Episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }


  function playList(list: Episode[], index: number){
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function tooglePlay(){
    setIsPlaying(!isPlaying)
  }

  function toogleLoop(){
    setIsLooping(!isLooping)
  }

  function toogleShuffle(){
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state)
  }

  function playNext(){
    if(isShuffling){
        const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

        setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if(hasNext){
        setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious(){
      if(hasPrevious){
          setCurrentEpisodeIndex(currentEpisodeIndex - 1)
      }
  }

  function clearPlayerState(){
      setEpisodeList([])
      setCurrentEpisodeIndex(0)
  }
  

  return(
    <PlayerContext.Provider 
        value={
            {
                episodeList,
                currentEpisodeIndex,
                isPlaying,
                hasNext,
                hasPrevious,
                isLooping,
                isShuffling,
                playList,
                play,
                playNext,
                playPrevious,
                tooglePlay, 
                toogleLoop,
                toogleShuffle,
                setPlayingState,
                clearPlayerState
            }
        }
    >
        {children}
    </PlayerContext.Provider>
  )
}


export const usePlayer = () => {
    return useContext(PlayerContext)
}