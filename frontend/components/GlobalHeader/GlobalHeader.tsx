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
    url: '/atlas',
    name: 'The Atlas'
  },
  {
    url: '/passports',
    name: 'Passports'
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
            <li>
              <Button
                text="Claim __ WETH"
                buttonStyle="secondary"
                handleClick={() => {
                  alert('TODO: Handle Claim')
                }}
              />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default GlobalHeader
