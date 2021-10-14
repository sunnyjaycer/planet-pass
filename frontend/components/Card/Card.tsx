import { FunctionComponent, useState } from 'react'
import style from './Card.module.scss'
import Image from 'next/image'
import Link from 'next/link'

type CardProps = {
  name: string
  // visits: number
  price?: number
  priceUnit?: string
  imgSrc?: string | StaticImageData
  videoSrc?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  stampSrc?: string | StaticImageData
  linkUrl?: string
}
type WrapperProps = {
  linkUrl?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}
const Wrapper: FunctionComponent<WrapperProps> = ({
  linkUrl,
  onClick,
  children
}) =>
  linkUrl ? (
    <Link href={linkUrl}>
      <a className={`${style.card} ${style.linkCard}`}>{children}</a>
    </Link>
  ) : onClick ? (
    <button onClick={onClick} className={`${style.card} ${style.buttonCard}`}>
      {children}
    </button>
  ) : (
    <div className={style.card}>{children}</div>
  )

const Card: FunctionComponent<CardProps> = ({
  name,
  // visits,
  price,
  imgSrc,
  videoSrc,
  priceUnit = 'WETH',
  stampSrc,
  onClick,
  linkUrl
}) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <Wrapper linkUrl={linkUrl} onClick={onClick}>
      <div className={`${style.cardMediaContainer} `}>
        <div className={`${style.mediaFade} ${isLoaded ? style.loaded : ''}`}>
          {videoSrc ? (
            <video
              className={style.video}
              src={videoSrc}
              autoPlay
              muted
              loop
              onCanPlay={() => {
                setIsLoaded(true)
              }}
            />
          ) : imgSrc ? (
            <Image
              src={imgSrc}
              alt="planet"
              layout="fill"
              className={style.cardImage}
              onLoadingComplete={() => {
                setIsLoaded(true)
              }}
            />
          ) : null}
        </div>

        {stampSrc && (
          <div className={style.cardStamp}>
            <Image src={stampSrc} alt="planet" layout="fill" />
          </div>
        )}
      </div>
      <div className={style.cardDetails}>
        <div className={style.cardName}>{name}</div>
        <div className={style.cardSubDetails}>
          {/* <div className={style.cardVisits}>{visits} Visits</div> */}
          {price && (
            <div className={style.cardPrice}>
              {price} {priceUnit}
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  )
}

export default Card
