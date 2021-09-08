import { FunctionComponent } from 'react'
import style from './UserInfo.module.scss'
import Image from 'next/image'

type UserStatProps = {
  stat: number
  label?: string
}

const StatCard: FunctionComponent<UserStatProps> = ({ stat, label }) => (
  <div className={style.statCard}>
    <div className={style.stat}>{stat}</div>
    {label && <div className={style.statLabel}>{label}</div>}
  </div>
)

type UserInfoProps = {
  userName: string
  userImageUrl?: string | StaticImageData
  passportName?: string
  stampCount?: number
  visitors?: number
}

const UserInfo: FunctionComponent<UserInfoProps> = ({
  userName,
  userImageUrl,
  passportName,
  stampCount,
  visitors
}) => {
  return (
    <div className={style.userInfo}>
      <div className={style.userInfoInner}>
        <div className={style.userCard}>
          {userImageUrl && (
            <div className={style.userImage}>
              <Image
                src={userImageUrl}
                alt="user avatar"
                layout="fixed"
                width={60}
                height={60}
              />
            </div>
          )}

          <div className={style.name}>{userName}</div>
        </div>

        <div className={style.info}>
          <div className={style.passportName}>{passportName}</div>
          {stampCount && <StatCard stat={stampCount} label="Stamps" />}
          {visitors && <StatCard stat={visitors} label="Visitors" />}
        </div>
      </div>
    </div>
  )
}

export default UserInfo
