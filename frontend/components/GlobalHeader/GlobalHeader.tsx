import style from './GlobalHeader.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'

const navLinks = [
  {
    url: '/',
    name: 'Galactic Gateway'
  },
  {
    url: '/all-planets',
    name: 'Browse Planets'
  },
  {
    url: '/planet-pass',
    name: 'Planet Pass'
  }
  // {
  //   url: '/',
  //   name: 'Space Store'
  // }
]

const GlobalHeader = () => {
  const router = useRouter()

  return (
    <header className={style.globalHeader}>
      <Link href="/">
        <a className={style.headerLogo}>Wanderers</a>
      </Link>
      <nav className={style.globalNav}>
        <ul>
          {navLinks.map((linkItem, i) => (
            <li key={linkItem.url + linkItem.name + i}>
              <Link href={linkItem.url}>
                <a
                  className={
                    (linkItem.url === '/' &&
                      router.pathname === linkItem.url) ||
                    (linkItem.url !== '/' &&
                      router.pathname.includes(linkItem.url))
                      ? style.activeNav
                      : ''
                  }
                >
                  {linkItem.name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default GlobalHeader
