import type { NextPage } from 'next'
import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import UserInfo from '../components/UserInfo'
import fpoImg from '../assets/fpo-img-2.png'
import fpoImageThumb from '../assets/planet-fpo-thumb.jpg'
import FilterableGrid from '../components/FilterableGrid'
import ConnectButton from '../components/ConnectButton'

// placeholder data
const sampleProperties = {
  space: ['aura', 'star-stream'],
  core: ['core-white'],
  terrain: ['fire'],
  features: ['domes'],
  atmosphere: ['rings-c'],
  satellites: ['meteor-shower'],
  ships: ['flyby-trio']
}

const cards = new Array(40).fill(0).map((e, i) => ({
  name: 'Planet Name',
  visits: 100,
  price: 0.5,
  imgSrc: fpoImageThumb,
  id: `card${i}`,
  attributes: sampleProperties
}))

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
      <FilterableGrid data={cards} />
    </Layout>
  )
}

export default Home
