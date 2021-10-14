import { FunctionComponent, ReactNode, useState } from 'react'
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
  const [isLoaded, setIsLoaded] = useState(false)
  return (
    <div
      className={`${style.featuredBlock} ${
        extraSpace ? style.featuredBlockSpace : ''
      }`}
    >
      <div>
        <div className={`${style.blockMedia} ${style.square}`}>
          <div className={`${style.mediaFade} ${isLoaded ? style.loaded : ''}`}>
            {videoSrc ? (
              <video
                className={style.video}
                src={videoSrc}
                autoPlay
                muted
                loop
                controls={!!videoControls}
                onCanPlay={() => {
                  setIsLoaded(true)
                }}
              />
            ) : imgSrc ? (
              <Image
                src={imgSrc}
                alt="planet"
                layout="fill"
                onLoadingComplete={() => {
                  setIsLoaded(true)
                }}
              />
            ) : null}
          </div>
        </div>
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
