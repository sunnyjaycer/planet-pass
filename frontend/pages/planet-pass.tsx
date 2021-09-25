import type { NextPage } from 'next'
import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import UserInfo from '../components/UserInfo'
import fpoImg from '../assets/fpo-img-2.png'
import FilterableGrid from '../components/FilterableGrid'

import ConnectButton from '../components/ConnectButton'

import { fpoCards } from '../utils/fakeData'

const Home: NextPage = () => {
  return (
    <Layout title={'Planet Pass'}>
      <PageHeader
        title="Planet Pass"
        description="Text about how these are planets you have visited"
      />
      {/* Example Connect button */}
      {/* <ConnectButton/> */}
      <UserInfo
        userName="username"
        userImageUrl={fpoImg}
        passportName="Passport Name"
        stampCount={360}
        visitors={100}
      />
      <FilterableGrid itemData={fpoCards} />
    </Layout>
  )
}

export default Home
