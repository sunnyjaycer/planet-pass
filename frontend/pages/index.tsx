import type { NextPage } from 'next'
import { useState } from 'react'

import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import fpoPlanet from '../assets/planet-fpo.png'

import CardGrid from '../components/CardGrid'
import FeatureBlock from '../components/FeatureBlock'
import UtilBlock from '../components/UtilBlock'
import Card from '../components/Card'

import DetailsModal from '../components/DetailsModal'

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
  const [modalIsOpen, setModalIsOpen] = useState(false)

  // TODO: Handle choosing active planet
  const handlePlanetClick = () => {
    setModalIsOpen(true)
  }

  return (
    <Layout title={'Galactic Gateway'}>
      <PageHeader
        title="Galactic Gateway"
        description="We have curated a list of exotic planets just for you, Wanderer. Browse at your leisure."
      />

      {/* TODO, will populate with active planet data onClick. Depends on planet data structure */}
      <DetailsModal
        isOpen={modalIsOpen}
        name={categoryCards[0].name}
        attributes={[
          { trait_type: 'Planet Spec', value: 'Purple Wormhole' },
          { trait_type: 'Planet Spec', value: 'Purple Wormhole' },
          { trait_type: 'Planet Spec', value: 'Purple Wormhole' },
          { trait_type: 'Planet Spec', value: 'Purple Wormhole' },
          { trait_type: 'Planet Spec', value: 'Purple Wormhole' },
          { trait_type: 'Planet Spec', value: 'Purple Wormhole' }
        ]}
        price={categoryCards[0].price}
        videoSrc="/GasGiant.mp4"
        handleClose={() => {
          setModalIsOpen(false)
        }}
      />
      {/* ----- */}
      {/* Featured Event */}
      <FeatureBlock
        kicker="Trending"
        headline="Treasure Hunt"
        description="Space pirates have left behind buried ETH. For your chance to uncover it, simply visit this planet before the end of the month. Winners will be randomly selected."
        imgSrc={fpoPlanet}
        videoSrc="/GasGiant.mp4"
        extraSpace
      />
      {/* ----- */}
      {/* Planets for the Event */}
      <CardGrid largeCards>
        {eventCards.map((card) => (
          <Card
            name={card.name}
            price={card.price}
            imgSrc={card.imgSrc}
            key={card.id}
            onClick={handlePlanetClick}
          />
        ))}
      </CardGrid>
      {/* ----- */}
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
            price={card.price}
            imgSrc={card.imgSrc}
            key={card.id}
            onClick={handlePlanetClick}
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
            price={card.price}
            imgSrc={card.imgSrc}
            key={card.id}
            onClick={handlePlanetClick}
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
            price={card.price}
            imgSrc={card.imgSrc}
            key={card.id}
            onClick={handlePlanetClick}
          />
        ))}
      </CardGrid>
      {/* ----- */}
      {/* Utility Links/Cards */}
      <UtilBlock />
    </Layout>
  )
}

export default Home
