import { FunctionComponent } from 'react'
import Head from 'next/head'
import GlobalHeader from '../GlobalHeader'
import style from './Layout.module.scss'

type LayoutProps = {
  title: string
  description?: string
  background?: 'gateway'
}

const Layout: FunctionComponent<LayoutProps> = ({
  title,
  description,
  background,
  children
}) => {
  return (
    <>
      <Head>
        <title>{title} | Wanderers</title>
        {description && <meta name="description" content={description} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${style.bkImage} ${background && style[background]}`} />
      <GlobalHeader />
      <main>{children}</main>
    </>
  )
}

export default Layout
