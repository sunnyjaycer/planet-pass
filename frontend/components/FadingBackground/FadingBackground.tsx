import { FunctionComponent, useEffect, useState } from 'react'
import style from './FadingBackground.module.scss'
import Image from 'next/image'
import { useRouter } from 'next/router'

import bkBaloon2x from '../../assets/backgrounds/bk-balloon-2x.png'
import bkGateway from '../../assets/backgrounds/bk-gateway.png'

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
      />
    </div>
  )
}

const BkBalloon = ({ exiting = false }) => (
  <LazyBK imgUrl={bkBaloon2x} exiting={exiting} />
)
const BkGateway = ({ exiting = false }) => (
  <LazyBK imgUrl={bkGateway} exiting={exiting} />
)

type BackgroundState = 'active' | 'exiting' | 'inactive'

const FadingBackground: FunctionComponent = ({}) => {
  const router = useRouter()
  const [gatewayState, setGatewayState] = useState<BackgroundState>('inactive')
  const [balloonState, setBalloonState] = useState<BackgroundState>('inactive')
  const activeBackground =
    router.pathname && router.pathname === '/' ? 'gateway' : 'balloons'

  useEffect(() => {
    switch (activeBackground) {
      case 'gateway':
        if (balloonState === 'active') {
          setBalloonState('exiting')
          setTimeout(() => {
            setBalloonState('inactive')
          }, fadeTransitionTime)
        }
        setGatewayState('active')
        break
      case 'balloons':
      default:
        if (gatewayState === 'active') {
          setGatewayState('exiting')
          setTimeout(() => {
            setGatewayState('inactive')
          }, fadeTransitionTime)
        }
        setBalloonState('active')
    }
  }, [activeBackground, gatewayState, balloonState])

  return (
    <div className={`${style.fadingBkFrame}`}>
      {gatewayState !== 'inactive' && (
        <BkGateway exiting={gatewayState === 'exiting'} />
      )}
      {balloonState !== 'inactive' && (
        <BkBalloon exiting={balloonState === 'exiting'} />
      )}
    </div>
  )
}

export default FadingBackground
