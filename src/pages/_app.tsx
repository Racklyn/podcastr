import '../styles/global.scss'

import { Header } from '../components/Header'
import { Player } from '../components/Player'

import styles from '../styles/app.module.scss'
import { PlayerContextProvider } from '../contexts/PlayerContext'
import { HeaderOptionsContextProvider } from '../contexts/HeaderOptionsContext'

function MyApp({ Component, pageProps }) {

  return(
    <PlayerContextProvider>
      <HeaderOptionsContextProvider>
        <div className={styles.wrapper}>
          <main>
            <Header/>
            <Component {...pageProps} />
          </main>
          <Player/>
        </div>
      </HeaderOptionsContextProvider>
    </PlayerContextProvider>
  )
}

export default MyApp
