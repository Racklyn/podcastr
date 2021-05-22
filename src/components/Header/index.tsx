import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'
import { useHeaderOptions } from '../../contexts/HeaderOptionsContext'

import {BsMoon} from 'react-icons/bs'
import {MdWbSunny} from 'react-icons/md'

import styles from './styles.module.scss'

export function Header(){

    const {isDarkTheme, changeTheme, setSearchValue, searchValue} = useHeaderOptions()
    
    //String com data atual formatada
    const currentDate = format(new Date(), 'EEEEEE, d MMMM',{
        locale:ptBR
    })


    return(
        <header className={`${styles.headerContainer}  ${isDarkTheme && styles.dark}`}>
            <img className={styles.logo} src="/logo.svg" alt="Podcastr"/>

            <p>O melhor para você ouvir, sempre</p>

            <span>{currentDate}</span>

            <div className={styles.searchContainer}>
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e)=> setSearchValue(e.target.value)}
                    placeholder="Pesquisar"
                />
                {searchValue!=""&&(
                    <button type="button" onClick={()=>setSearchValue("")}>x</button>
                )}
            </div>

            <button className={styles.themeButton} onClick={changeTheme}>
                {isDarkTheme?(
                    <MdWbSunny color="#FFFD" size={20}/>
                ):(
                    <BsMoon color="#FFFD" size={20}/>
                )
                }
            </button>
        </header>
    )
}