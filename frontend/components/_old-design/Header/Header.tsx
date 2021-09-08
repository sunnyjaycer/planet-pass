import style from './Header.module.scss'
import logoImg from '../../assets/logo.png'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  return (
    <header className={style.header}>
      <Link href="/">
        <a className={style.headerLink}>
          <span className={style.wanderers}>Wanderers</span>
          <div className={style.logo}>
            <Image src={logoImg} alt="" layout="fixed" width={88} height={88} />
          </div>

          <span className={style.planetpass}>Planet Pass</span>
        </a>
      </Link>
    </header>
  )
}

export default Header
