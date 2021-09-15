import type { NextPage } from 'next'
import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import fpoPlanet from '../assets/planet-fpo.png'

import CardGrid from '../components/CardGrid'
import FeatureBlock from '../components/FeatureBlock'
import UtilBlock from '../components/UtilBlock'
import Card from '../components/Card'

// event cards
const eventCards = new Array(3).fill(0).map((e, i) => ({
  name: 'Event Planet Name',
  visits: 100,
  price: 0.5,
  imgSrc: fpoPlanet,
  id: `card${i}`
}))

// placeholder data
const categoryCards = new Array(3).fill(0).map((e, i) => ({
  name: 'Category Planet Name',
  visits: 100,
  price: 0.5,
  imgSrc: fpoPlanet,
  id: `card${i}`
}))

const Home: NextPage = () => {
  return (
    <Layout title={'Home'}>
      <PageHeader
        title="Galactic Gateway"
        description="Text about how these are all planets available to visit. Text about how these are all planets available to visit and currated lists."
      />

      <FeatureBlock
        kicker="Trending"
        headline="Treasure Hunt"
        description="Description of this sweet treasure hunt. Description of this sweet sweet treasure hunt event."
        imgSrc={fpoPlanet}
        // videoSrc="/GasGiant.mp4"
        extraSpace
      />

      {/* Planets for the Event */}
      <CardGrid largeCards>
        {eventCards.map((card) => (
          <Card
            name={card.name}
            visits={card.visits}
            price={card.price}
            imgSrc={card.imgSrc}
            key={card.id}
          />
        ))}
      </CardGrid>

      {/* Highlighted Groups/Categories */}
      <CardGrid
        header="Most Visited"
        linkText="View All"
        link="/planet-pass"
        largeCards
      >
        {categoryCards.map((card) => (
          <Card
            name={card.name}
            visits={card.visits}
            price={card.price}
            imgSrc={card.imgSrc}
            key={card.id}
          />
        ))}
      </CardGrid>
      <CardGrid
        header="Hidden Gems"
        linkText="View All"
        link="/planet-pass"
        largeCards
      >
        {categoryCards.map((card) => (
          <Card
            name={card.name}
            visits={card.visits}
            price={card.price}
            imgSrc={card.imgSrc}
            key={card.id}
          />
        ))}
      </CardGrid>
      <CardGrid
        header="Gassiest Giants"
        linkText="View All"
        link="/planet-pass"
        largeCards
      >
        {categoryCards.map((card) => (
          <Card
            name={card.name}
            visits={card.visits}
            price={card.price}
            imgSrc={card.imgSrc}
            key={card.id}
          />
        ))}
      </CardGrid>

      {/* Util Cards */}
      <UtilBlock />
    </Layout>
  )
}

export default Home
