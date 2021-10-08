import { FunctionComponent, ReactNode } from 'react'
import style from './FeatureBlock.module.scss'
import Image from 'next/image'

type FeatureBlockProps = {
  kicker?: string
  headline: string
  description?: string | ReactNode
  imgSrc?: string | StaticImageData
  videoSrc?: string
  extraSpace?: boolean
  videoControls?: boolean
}

const FeatureBlock: FunctionComponent<FeatureBlockProps> = ({
  kicker,
  headline,
  description,
  imgSrc,
  videoSrc,
  extraSpace,
  videoControls
}) => {
  return (
    <div
      className={`${style.featuredBlock} ${
        extraSpace ? style.featuredBlockSpace : ''
      }`}
    >
      <div className={style.blockMedia}>
        {videoSrc ? (
          <video
            className={style.video}
            src={videoSrc}
            autoPlay
            muted
            loop
            controls={!!videoControls}
          />
        ) : imgSrc ? (
          <Image src={imgSrc} alt="planet" layout="fill" />
        ) : null}
      </div>
      <div className={style.blockDetails}>
        <h2 className={style.headline}>
          <span className={style.kicker}>{kicker}</span>
          {headline}
        </h2>
        <div className={style.description}>{description}</div>
      </div>
    </div>
  )
}

export default FeatureBlock
