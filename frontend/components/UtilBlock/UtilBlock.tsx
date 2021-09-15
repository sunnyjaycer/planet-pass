import { FunctionComponent } from 'react'
import style from './UtilBlock.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import logoImg from '../../assets/logo.png'
import stampImg from '../../assets/stamp.png'

const UtilBlock: FunctionComponent = () => {
  return (
    <section className={style.utilBlock}>
      <Link href="/all-planets">
        <a className={`${style.utilCard} ${style.allPlanets}`}>
          <Image src={logoImg} alt="" layout="fixed" width={88} height={88} />
          Explore all <br />
          Planets
        </a>
      </Link>

      <Link href="/planet-pass">
        <a className={`${style.utilCard} ${style.planetPass}`}>
          <div className={style.cardImgPad}>
            <Image
              src={stampImg}
              alt=""
              layout="fixed"
              width={74}
              height={74}
            />
          </div>
          View your <br />
          Planet Passport
        </a>
      </Link>
    </section>
  )
}

export default UtilBlock
