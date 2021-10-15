import {
  FunctionComponent,
  useEffect,
  useState,
  Dispatch,
  SetStateAction
} from 'react'
import style from './FadingBackground.module.scss'
import Image from 'next/image'
import { useRouter } from 'next/router'

import bkGateway from '../../assets/backgrounds/bk-gateway.png'
import bkClouds from '../../assets/backgrounds/bk-clouds.png'
import bkPlanetsDark from '../../assets/backgrounds/bk-planets-dark.png'
import bkPlanetsPurple from '../../assets/backgrounds/bk-planets-purple.png'
import bkOrangePlanets from '../../assets/backgrounds/bk-planets-orange.png'
const fadeTransitionTime = 1500

interface LazyBkProps {
  imgUrl: string | StaticImageData
  exiting?: boolean
}
const LazyBK: FunctionComponent<LazyBkProps> = ({ imgUrl, exiting }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  return (
    <div
      className={`${style.bkImage} ${isLoaded ? style.loaded : ''} ${
        exiting ? style.exiting : ''
      }`}
    >
      <Image
        src={imgUrl}
        alt=""
        layout="responsive"
        onLoadingComplete={() => {
          setIsLoaded(true)
        }}
        priority
      />
    </div>
  )
}

type BackgroundState = 'active' | 'exiting' | 'inactive'
type BackgroundKey =
  | 'orangePlanets'
  | 'clouds'
  | 'darkPlanets'
  | 'purplePlanets'
type StateGroup = [BackgroundState, Dispatch<SetStateAction<BackgroundState>>]

type BkStateList = {
  [s: string]: StateGroup
}

const FadingBackground: FunctionComponent = ({}) => {
  const router = useRouter()
  const [orangePlanetState, setOrangePlanetState] =
    useState<BackgroundState>('inactive')
  const [darkPlanetState, setDarkPlanetState] =
    useState<BackgroundState>('inactive')
  const [cloudsState, setCloudsState] = useState<BackgroundState>('inactive')
  const [purplePlanetState, setPurplePlanetState] =
    useState<BackgroundState>('inactive')

  const activeBackground: BackgroundKey =
    router.pathname === '/'
      ? 'purplePlanets'
      : router.pathname === '/atlas'
      ? 'darkPlanets'
      : router.pathname === '/passports'
      ? 'orangePlanets'
      : 'clouds'

  useEffect(() => {
    const bkStates: BkStateList = {
      orangePlanets: [orangePlanetState, setOrangePlanetState],
      darkPlanets: [darkPlanetState, setDarkPlanetState],
      clouds: [cloudsState, setCloudsState],
      purplePlanets: [purplePlanetState, setPurplePlanetState]
    }

    Object.keys(bkStates)
      .filter((key) => key !== activeBackground)
      .forEach((key) => {
        const [bkState, setBkState] = bkStates[key]
        if (bkState === 'active') {
          setBkState('exiting')
          setTimeout(() => {
            setBkState('inactive')
          }, fadeTransitionTime)
        }
      })
    bkStates[activeBackground][1]('active')
  }, [
    activeBackground,
    orangePlanetState,
    darkPlanetState,
    cloudsState,
    purplePlanetState
  ])

  return (
    <div className={`${style.fadingBkFrame}`}>
      {orangePlanetState !== 'inactive' && (
        <LazyBK
          imgUrl={bkOrangePlanets}
          exiting={orangePlanetState === 'exiting'}
        />
      )}
      {darkPlanetState !== 'inactive' && (
        <LazyBK
          imgUrl={bkPlanetsDark}
          exiting={darkPlanetState === 'exiting'}
        />
      )}
      {cloudsState !== 'inactive' && (
        <LazyBK imgUrl={bkClouds} exiting={cloudsState === 'exiting'} />
      )}
      {purplePlanetState !== 'inactive' && (
        <LazyBK
          imgUrl={bkPlanetsPurple}
          exiting={purplePlanetState === 'exiting'}
        />
      )}
    </div>
  )
}

export default FadingBackground
