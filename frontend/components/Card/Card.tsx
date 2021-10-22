import { FunctionComponent } from 'react'
import style from './Card.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import LazyMedia from '../LazyMedia'

type CardProps = {
  name: string
  price?: number
  priceUnit?: string
  imgSrc?: string | StaticImageData
  videoSrc?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  linkUrl?: string
  stampSrc?: string | StaticImageData
  stampPosition?: number
  tag?: string
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
  price,
  imgSrc,
  videoSrc,
  priceUnit = 'WETH',
  stampSrc,
  onClick,
  linkUrl,
  stampPosition,
  tag
}) => {
  return (
    <Wrapper linkUrl={linkUrl} onClick={onClick}>
      <div className={`${style.cardMediaContainer} `}>
        {videoSrc ||
          (imgSrc && (
            <LazyMedia videoSrc={videoSrc} imgSrc={imgSrc} altText="planet" />
          ))}

        {stampSrc && (
          <div
            className={`${style.cardStamp} ${
              stampPosition && style[`position${stampPosition.toString()}`]
            }`}
          >
            <Image src={stampSrc} alt="planet" layout="fill" />
          </div>
        )}
        {tag && <div className={style.tag}>{tag}</div>}
      </div>
      <div className={style.cardDetails}>
        <div className={style.cardName}>{name}</div>
        <div className={style.cardSubDetails}>
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
