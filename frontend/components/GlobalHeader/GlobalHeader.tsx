import style from './GlobalHeader.module.scss'
import Link from 'next/link'

const navLinks = [
  {
    url: '/',
    name: 'Galactic Gateway'
  },
  {
    url: '/planet-pass',
    name: 'Planet Pass'
  },
  {
    url: '/',
    name: 'Space Store'
  }
]

const GlobalHeader = () => {
  return (
    <header className={style.globalHeader}>
      <Link href="/">
        <a className={style.headerLogo}>Wanderers</a>
      </Link>
      <nav className={style.globalNav}>
        <ul>
          {navLinks.map((link, i) => (
            <li key={link.url + link.name + i}>
              <Link href={link.url}>
                <a>{link.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default GlobalHeader
