import { FunctionComponent } from 'react'
import Head from 'next/head'
import GlobalHeader from '../GlobalHeader'
import { Background } from '../../types'

interface LayoutProps {
  title: string
  description?: string
  background?: Background
}

const Layout: FunctionComponent<LayoutProps> = ({
  title,
  description,
  children
}) => {
  return (
    <>
      <Head>
        <title>{title} | Wanderers</title>
        {description && <meta name="description" content={description} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalHeader />
      <main>{children}</main>
    </>
  )
}

export default Layout
