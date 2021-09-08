import type { NextPage } from 'next'
import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import UserInfo from '../components/UserInfo'
import fpoImage2 from '../assets/fpo-img-2.png'
import StampCard from '../components/StampCard'
import CardGrid from '../components/CardGrid'
import ConnectButton from '../components/ConnectButton'

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
    <Layout title={'Home'}>
      <PageHeader
        title="Planet Pass"
        description="Text about how these are planets you have visited"
      />
      <ConnectButton/>
      <UserInfo
        userName="username"
        userImageUrl={fpoImage2}
        passportName="Passport Name"
        stampCount={360}
        visitors={100}
      />
      <CardGrid>
        {cards.map((card) => (
          <StampCard
            name={card.name}
            visits={card.visits}
            price={card.price}
            imgSrc={card.imgSrc}
            key={card.id}
          />
        ))}
      </CardGrid>
    </Layout>
  )
}

export default Home
