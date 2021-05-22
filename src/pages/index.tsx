import {format, parseISO} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import {GetStaticProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import { usePlayer } from '../contexts/PlayerContext'
import { api } from '../services/api'
import { convertDurationToString } from '../utils/convertDurationToString'

import styles from './home.module.scss'
import { useEffect, useState } from 'react'
import { useHeaderOptions } from '../contexts/HeaderOptionsContext'
import { CircularProgress, LinearProgress } from '@material-ui/core'

type Episode = {
  id: string;
  title: string;
  members: string;
  thumbnail: string,
  duration: number,
  durationAsString: string,
  url: string,
  publishedAt: string
}

type HomeProps ={
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
  listOfEpisodes: Episode[];
}


export default function Home({latestEpisodes, allEpisodes}:HomeProps) {

  const {playList} = usePlayer() // ... = useContext(PlayerContext)
  const {isDarkTheme, searchValue, setSearchValue} = useHeaderOptions()

  const [isSearchMode, setSearchMode] = useState(false)
  const [isSearchLoading, setSearchLoading] = useState(false)

  const [linkLoading, setLinkLoading] = useState(false)

  const episodeList = [...latestEpisodes, ...allEpisodes]

  const [listData, setListData] = useState(allEpisodes)

  useEffect(()=>{
    setSearchLoading(true)

    if(searchValue.length>0){
      
      var list = [...episodeList]
      var result = list.filter((e:Episode) => e.title.toLowerCase().includes(searchValue.toLowerCase()))

      result = result.map((ep:Episode) => {
        //  Index of searchValue in the title
        let index = ep.title.toLowerCase().indexOf(searchValue.toLowerCase())

        let len = searchValue.length

        //  Formating title to search results
        let title = `${ep.title.slice(0,index)}<strong>${ep.title.slice(index,index+len)}</strong>${ep.title.slice(index+len)}`
        ep = {...ep,title}
        return ep
      })
      
      setListData(result)
      setSearchMode(true)
        
    }else{
      setListData(allEpisodes)
      setSearchMode(false)
    }
    setSearchLoading(false)
  },[searchValue])


  return (
    <div className={`${styles.homepage} ${isDarkTheme && styles.dark}`}>

      {/* Definindo título para esta página */}
      <Head>
        <title>Home | Podcastr</title>
      </Head>

      {linkLoading && <LinearProgress className={styles.linearProgress}/>}

      {!isSearchMode &&(
        <section className={styles.latestEpisodes}>
          <h2>Últimos lançamentos</h2>

          <ul>
            {latestEpisodes.map((episode, index) =>{
              return(
                <li key={episode.id}>

                  <div className={styles.imageDiv}>
                    <Image
                      height={192}
                      width={192}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </div>

                  <div className={styles.episodeDetails}>
                    <Link href={`/episodes/${episode.id}`}>
                      <a onClick={()=>setLinkLoading(true)}>{episode.title}</a>
                    </Link>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>

                  <button type="button" onClick={()=> playList(episodeList, index)}>
                    <img src="/play-green.svg" alt="Tocar episódio"/>
                  </button>

                </li>
              )
            })}
          </ul>
        </section>
      )
      }
      

      <section className={styles.allEpisodes}>

          {isSearchMode?(
            <h2>Resultados para: <strong>{searchValue}</strong></h2>
          ):(
            <h2>Todos episódios</h2>
          )}


          {!isSearchLoading?(
            <table cellSpacing={0} >
              <thead>
                <tr>
                  <th></th>
                  <th>Podcast</th>
                  <th>Integrantes</th>
                  <th>Data</th>
                  <th>Duração</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {listData.map((episode, index) =>{
                  return(
                    <tr key={episode.id}>
                      <td className={styles.trImage}>
                        <Image
                          width={120}
                          height={120}
                          src={episode.thumbnail}
                          alt={episode.title}
                          objectFit="cover"
                        />
                      </td>
                      <td>
                        <Link  href={`/episodes/${episode.id}`}>
                          <a onClick={()=>setLinkLoading(true)} dangerouslySetInnerHTML={{ __html: episode.title}}/> 
                        </Link>
                      </td>
                      <td>{episode.members}</td>
                      <td>{episode.publishedAt}</td>
                      <td>{episode.durationAsString}</td>
                      <td>
                        <button type="button" onClick={()=> playList(episodeList, index + latestEpisodes.length)}>
                          <img src="/play-green.svg" alt="Tocar episódio"/>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
          </table>
          ):(
            <CircularProgress className={styles.circularProgress} color='inherit'/>
          )
        }
      </section>
    </div>
  )
}


//  Função padrão para usar SSG (Server Side Generation).
//  Será execultada uma única vez ao iniciar a página.
//  Está em formato de const para poder adicionar tipagem.

export const getStaticProps:GetStaticProps = async () =>{

  const {data} = await api.get('episodes',{
    params:{
      // _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode=>{
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToString(Number(episode.file.duration)),
      url: episode.file.url
    }
  })

  //Mandando episódios já separados
  const latestEpisodes = episodes.slice(0,2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8, // A cada 8 horas será atualizado
  }
}