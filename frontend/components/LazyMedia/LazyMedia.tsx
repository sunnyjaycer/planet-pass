import { FunctionComponent, useState } from 'react'
import style from './LazyMedia.module.scss'
import Image from 'next/image'

type LazyMediaProps = {
  imgSrc?: string | StaticImageData
  altText?: string
  videoSrc?: string
  aspect?: number
  videoControls?: boolean
  noBk?: boolean
  cover?: boolean
}

const LazyMedia: FunctionComponent<LazyMediaProps> = ({
  imgSrc,
  videoSrc,
  altText,
  aspect,
  videoControls,
  noBk,
  cover
}) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div
      className={`${style.mediaContainer} ${noBk ? style.noBk : ''} ${
        cover ? style.cover : ''
      }`}
      style={{
        paddingBottom: aspect ? (1 / aspect) * 100 + '%' : cover ? 0 : '100%'
      }}
    >
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
            controls={videoControls}
          />
        ) : imgSrc ? (
          <Image
            src={imgSrc}
            alt={altText ? altText : ''}
            layout="fill"
            className={style.image}
            objectFit="cover"
            onLoadingComplete={() => {
              setIsLoaded(true)
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

export default LazyMedia
