import { FunctionComponent } from 'react'
import style from './Card.module.scss'
import Image from 'next/image'

type CardProps = {
  name: string
  // visits: number
  price: number
  priceUnit?: string
  imgSrc: string | StaticImageData
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  stampSrc?: string | StaticImageData
}

const Card: FunctionComponent<CardProps> = ({
  name,
  // visits,
  price,
  imgSrc,
  priceUnit = 'WETH',
  stampSrc,
  onClick
}) => {
  const Wrapper: FunctionComponent = ({ children }) =>
    onClick ? (
      <button onClick={onClick} className={`${style.card} ${style.buttonCard}`}>
        {children}
      </button>
    ) : (
      <div className={style.card}>{children}</div>
    )

  return (
    <Wrapper>
      <div className={style.cardImage}>
        <Image src={imgSrc} alt="planet" layout="fill" />
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
          <div className={style.cardPrice}>
            {price} {priceUnit}
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

export default Card
