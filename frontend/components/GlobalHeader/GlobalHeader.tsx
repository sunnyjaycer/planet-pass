import style from './GlobalHeader.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Button from '../Button'

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
      <div className={style.headerMain}>
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
      </div>
      <div className={style.earningsWrap}>
        <div className={style.earnings}>
          <span className={style.earningsLabel}>Earnings </span>
          <span className={style.earningsAmount}>13.4 WETH</span>
          <Button
            text="Claim"
            buttonStyle="secondary"
            handleClick={() => {
              alert('TODO: Handle Claim')
            }}
          />
        </div>
      </div>
    </header>
  )
}

export default GlobalHeader
