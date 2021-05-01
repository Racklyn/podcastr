import Image from 'next/image'
import {useEffect, useRef, useState } from 'react'
import {usePlayer} from '../../contexts/PlayerContext'
import styles from './styles.module.scss'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { convertDurationToString } from '../../utils/convertDurationToString'
import { useHeaderOptions } from '../../contexts/HeaderOptionsContext'

export function Player(){

    const audioRef = useRef <HTMLAudioElement> (null)
    const [progress, setProgress] = useState(0) //tempo em segundos

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        hasNext,
        hasPrevious,
        isLooping,
        isShuffling,
        toogleShuffle,
        tooglePlay,
        toogleLoop,
        setPlayingState,
        playNext,
        playPrevious,
        clearPlayerState
    } = usePlayer()

    const {isDarkTheme} = useHeaderOptions()

    useEffect(()=>{
        if(!audioRef.current){
            return;
        }

        if(isPlaying){
            audioRef.current.play()
        }else{
            audioRef.current.pause()
        }
    },[isPlaying])


    //chamada assim que o áudio estiver carregado e prestes a começar
    function setupProgreeListener(){
        audioRef.current.currentTime = 0;

        //evento toda vez que o 'time' do áudio for alterado
        audioRef.current.addEventListener('timeupdate', () =>{
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount: number){
        audioRef.current.currentTime = amount
        setProgress(amount)
    }

    function handleEpisodeEnded(){
        if(hasNext){
            playNext()
        }else{
            clearPlayerState()
        }
    }

    const episode = episodeList[currentEpisodeIndex]
    


    return(
        <div className={`${styles.playerContainer} ${isDarkTheme && styles.dark}`}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>

            {episode?(
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />

                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ):(
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{backgroundColor:'#04d361'}}
                                railStyle={{backgroundColor: '#9f75ff'}}
                                handleStyle={{borderColor: '#04d361', borderWidth: 4}}
                            />
                        ):( 
                            <div className={styles.emptySlider}/>
                        )}
                        
                    </div>
                    <span>{convertDurationToString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        onEnded={handleEpisodeEnded}
                        loop={isLooping}
                        //  função que será executada assim que o áudio for carregado
                        onLoadedMetadata={setupProgreeListener}
                        //  Evento para quando pausar/play (pelo teclado, por exemplo)
                        onPlay={()=>setPlayingState(true)}
                        onPause={()=>setPlayingState(false)}
                    />
                )}

                <div className={styles.buttons}>
                    <button
                        type="button" 
                        disabled={!episode || episodeList.length===1}
                        onClick={toogleShuffle}
                        className={isShuffling ? styles.isActive: ''}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Trocar anterior"/>
                    </button>
                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={tooglePlay}
                    >
                        {isPlaying? (
                            <img src="/pause.svg" alt="Pausar"/>
                        ): (
                            <img src="/play.svg" alt="Tocar"/>
                        )}
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Trocar próxima"/>
                    </button>
                    <button
                        type="button"
                        disabled={!episode}
                        onClick={toogleLoop}
                        className={isLooping ? styles.isActive: ''}
                    >
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    )
}