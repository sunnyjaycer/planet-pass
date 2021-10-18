import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import FilterableGrid from '../components/FilterableGrid'
import Loader from '../components/Loader'
import { PlanetData } from '../types'

const urls: string[] = []
for (let i = 0; i < 80; i++) {
  urls.push(`https://assets.wanderers.ai/file/planetpass/metadata/0/${i}`)
}

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<PlanetData[]>([])

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const metadata = await Promise.all(
        urls.map((url) => {
          return fetch(url).then((response) => response.json())
        })
      )
      setIsLoading(false)
      setData(metadata)
    })()
  }, [])

  return (
    <Layout title={'Planets'}>
      <PageHeader
        title="All Planets"
        description="Your ticket to every available planet in the galaxy."
      />
      {isLoading ? <Loader /> : <FilterableGrid itemData={data} />}
    </Layout>
  )
}

export default Home
