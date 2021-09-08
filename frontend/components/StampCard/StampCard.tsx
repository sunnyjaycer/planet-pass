import { FunctionComponent } from 'react'
import style from './StampCard.module.scss'
import fpoImg from '../../assets/fpo-img.png'
import Image from 'next/image'
import Link from 'next/link'

type StampProps = {
  name: string
  visits: number
  price: number
  priceUnit?: string
  imgSrc: string | StaticImageData
}

const StampCard: FunctionComponent<StampProps> = ({
  name,
  visits,
  price,
  imgSrc,
  priceUnit = 'WETH'
}) => {
  return (
    <div className={style.stampCard}>
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

export default StampCard
