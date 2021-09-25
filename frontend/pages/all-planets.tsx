import type { NextPage } from 'next'
import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import FilterableGrid from '../components/FilterableGrid'

import { fpoCards } from '../utils/fakeData'

const Home: NextPage = () => {
  return (
    <Layout title={'All Planets'}>
      <PageHeader title="All Planets" />
      <FilterableGrid itemData={fpoCards} />
    </Layout>
  )
}

export default Home
