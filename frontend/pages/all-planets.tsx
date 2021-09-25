import type { NextPage } from 'next'
import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import FilterableGrid from '../components/FilterableGrid'

import { fpoPlanets } from '../utils/fakeData'

const Home: NextPage = () => {
  return (
    <Layout title={'All Planets'}>
      <PageHeader title="All Planets" />
      <FilterableGrid itemData={fpoPlanets} />
    </Layout>
  )
}

export default Home
