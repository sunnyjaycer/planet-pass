import { FunctionComponent } from 'react'
import style from './PageHeader.module.scss'
import logoImg from '../../assets/logo.png'
import Image from 'next/image'

type PageHeaderProps = {
  title: string
  description?: string
}

const PageHeader: FunctionComponent<PageHeaderProps> = ({
  title,
  description
}) => {
  return (
    <div className={style.pageHeader}>
      <div className={style.logo}>
        <Image src={logoImg} alt="" layout="fixed" width={88} height={88} />
      </div>
      <h1 className={style.pageHeader__title}>{title}</h1>
      {description && <p className={style.pageHeader__desc}>{description}</p>}
    </div>
  )
}

export default PageHeader
