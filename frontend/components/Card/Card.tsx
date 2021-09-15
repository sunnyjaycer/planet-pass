import { FunctionComponent } from 'react'
import style from './Card.module.scss'
import Image from 'next/image'

type CardProps = {
  name: string
  visits: number
  price: number
  priceUnit?: string
  imgSrc: string | StaticImageData
}

const Card: FunctionComponent<CardProps> = ({
  name,
  visits,
  price,
  imgSrc,
  priceUnit = 'WETH'
}) => {
  return (
    <div className={style.card}>
      <div className={style.cardImage}>
        <Image src={imgSrc} alt="planet" layout="fill" />
      </div>
      <div className={style.cardDetails}>
        <div className={style.cardName}>{name}</div>
        <div className={style.cardSubDetails}>
          <div className={style.cardVisits}>{visits} Visits</div>
          <div className={style.cardPrice}>
            {price} {priceUnit}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
