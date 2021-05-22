import {GetStaticPaths, GetStaticProps} from 'next'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import {useRouter} from 'next/router'

import { api } from '../../services/api'
import { convertDurationToString } from '../../utils/convertDurationToString'

import styles from './episodes.module.scss'
import { usePlayer } from '../../contexts/PlayerContext'
import { useHeaderOptions } from '../../contexts/HeaderOptionsContext'
import { useEffect, useState } from 'react'
import { LinearProgress } from '@material-ui/core'

type Episode = {
    id: string;
    title: string;
    members: string;
    thumbnail: string,
    duration: number,
    durationAsString: string,
    url: string,
    description: string,
    publishedAt: string
}
type EpisodeProps = {
    episode: Episode;
}

export default function Episodes({episode}: EpisodeProps){

    const {play} = usePlayer()

    const {isDarkTheme, searchValue, setSearchValue} = useHeaderOptions()
    const [linkLoading, setLinkLoading] = useState(false)
    const [hasLoaded, setHasLoaded] = useState(false)

    const router = useRouter()

    useEffect(()=>{
        setSearchValue("")
        setHasLoaded(true)
    },[])

    useEffect(()=>{
        if(hasLoaded && searchValue.length>0){
            setLinkLoading(true)
            router.push("/")
        }
    },[searchValue])

    return(
        <div className={`${styles.episode} ${isDarkTheme && styles.dark}`}>

            {/* Definindo título para esta página */}
            <Head>
                <title>{episode.title} | Podcastr</title>
            </Head>

            {linkLoading && <LinearProgress className={styles.linearProgress}/>}

            <main>
                <div className={styles.thumbnailContainer}>
                    <Link href="/">
                        <button type="button" onClick={()=>setLinkLoading(true)}>
                            <img src="/arrow-left.svg" alt="Voltar"/>
                        </button>
                    </Link>
                    <Image
                        width={700}
                        height={160}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <button type="button">
                        <img src="/play.svg" onClick={()=> play(episode)} alt="Tocar episódio"/>
                    </button>
                </div>

                <header>
                    <h1>{episode.title}</h1>
                    <span>{episode.members}</span>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                </header>

                {/* Não recomendado fazer isso caso a api não seja conhecida, pois pode ter um script no meio do html */}
                <div
                    className={styles.description}
                    dangerouslySetInnerHTML={{ __html: episode.description}}
                />
            </main>

        </div>
    )
}


// Como slug é um valor dinâmico, precisamos dessa função:
export const getStaticPaths: GetStaticPaths = async () => {

    //Pegando os dois últimos episódios
    const {data} = await api.get('episodes',{
        params:{
          _limit: 2,
          _sort: 'published_at',
          _order: 'desc'
        } 
    })

    const paths = data.map(episode =>{
        return {
            params: {
                slug: episode.id
            }
        }
    })

    return {
        // Gerará por padrão a versão estática das páginas dos episódios com
        // o params 'slug' com o valor do id dos 2 últimos episódios.
        paths,
        //Caso o usuário acesso uma rota que não está em paths (não tem a versão estática previamente), fará a requisição...
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const {slug} = ctx.params

    const {data} = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url
    }
    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24, //24 hours
    }
}