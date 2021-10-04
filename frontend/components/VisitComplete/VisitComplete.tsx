import { FunctionComponent, useRef, useMemo, useState } from 'react'
import style from './VisitComplete.module.scss'
import { CloseIcon } from '../Icons'

import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import visitLottieDataWithImgs from '../../assets/visitLottieDataWithImg'
import Button from '../Button'

interface VisitCompleteProps {
  planetName: string
  stardustAmount: number
  videoSrc: string
  stamperImgPath: string
  stampImgPath: string
  flagImgPath: string
  onComplete: () => void
}

const VisitComplete: FunctionComponent<VisitCompleteProps> = ({
  planetName,
  stardustAmount,
  videoSrc,
  stamperImgPath,
  stampImgPath,
  flagImgPath,
  onComplete
}) => {
  const [hasPlayed, setHasPlayed] = useState(false)
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  const playAnimation = () => {
    if (lottieRef.current && lottieRef.current?.play) {
      lottieRef.current.setSubframe(false)
      lottieRef.current.play()
    }
  }
  const pauseAnimation = () => {
    if (lottieRef.current && lottieRef.current?.play) {
      lottieRef.current.pause()
    }
  }

  const lottieData = useMemo(
    () =>
      visitLottieDataWithImgs({
        stamper: stamperImgPath,
        stamp: stampImgPath,
        flag: flagImgPath
      }),
    [stampImgPath, flagImgPath, stamperImgPath]
  )

  return (
    <div className={style.visitComplete}>
      <button
        className={style.closeButton}
        onClick={onComplete}
        aria-label="Close Planet Details"
      >
        <CloseIcon />
      </button>
      <div className={style.videoContainer}>
        <div className={style.lottieContainer}>
          <Lottie
            animationData={lottieData}
            loop={false}
            autoplay={false}
            lottieRef={lottieRef}
          />
        </div>
        <video
          onPlay={() => {
            setTimeout(
              () => {
                playAnimation()
              },
              hasPlayed ? 0 : 1000
            )
            setHasPlayed(true)
          }}
          onPause={pauseAnimation}
          className={style.video}
          src={videoSrc}
          autoPlay
          controls
          loop
        />
      </div>
      <div className={style.visitInfo}>
        <h2 className={style.visitedHeader}>{planetName} Visited</h2>
        <p className={style.visitedEarnings}>
          +{stardustAmount} $tartdust Earned
        </p>
        <div className={style.visitedButton}>
          <Button
            text="Continue Travelling"
            buttonStyle="secondary"
            handleClick={onComplete}
          />
        </div>
      </div>
    </div>
  )
}

export default VisitComplete
