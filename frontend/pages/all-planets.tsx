import type { NextPage } from 'next'
import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import fpoImage2 from '../assets/fpo-img-2.png'
import FilterableGrid from '../components/FilterableGrid'

import ConnectButton from '../components/ConnectButton'
import { fpoCards } from '../utils/fakeData'

// placeholder data
const cards = new Array(40).fill(0).map((e, i) => ({
  name: 'Planet Name',
  visits: 100,
  price: 0.5,
  imgSrc: fpoImage2,
  id: `card${i}`
}))

const Home: NextPage = () => {
  return (
    <Layout title={'All Planets'}>
      <PageHeader title="All Planets" />
      {/* Example Connect button */}
      <FilterableGrid itemData={fpoCards} />
    </Layout>
  )
}

export default Home
