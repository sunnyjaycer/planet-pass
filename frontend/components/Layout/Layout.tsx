import { FunctionComponent } from 'react'
import Head from 'next/head'
import GlobalHeader from '../GlobalHeader'

type LayoutProps = {
  title: string
  description?: string
}

const Layout: FunctionComponent<LayoutProps> = ({
  title,
  description,
  children
}) => {
  return (
    <div>
      <Head>
        <title>{title} | Wanderers</title>
        {description && <meta name="description" content={description} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalHeader />
      <main>{children}</main>
    </div>
  )
}

export default Layout
