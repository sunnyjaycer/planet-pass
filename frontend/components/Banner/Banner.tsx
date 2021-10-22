import { FunctionComponent } from 'react'
import style from './Banner.module.scss'
import LazyMedia from '../LazyMedia'

type BannerProps = {
  text: string
  imgSrc?: string | StaticImageData
}

const Banner: FunctionComponent<BannerProps> = ({ text, imgSrc }) => (
  <div className={style.banner}>
    {imgSrc && (
      <div className={style.media}>
        <div className={style.mediaWrap}>
          <LazyMedia imgSrc={imgSrc} altText="" cover />
        </div>
      </div>
    )}
    <div className={style.bannerContent}>
      <p className={style.text}>{text}</p>
    </div>
  </div>
)

export default Banner
