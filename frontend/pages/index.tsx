import type { NextPage } from 'next'
import { useState } from 'react'
import Lottie from 'lottie-react'
import { visitLottieData } from '../assets/lottie-visit/visitLottieData'
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
        description="Text about how these are all planets available to visit. Text about how these are all planets available to visit and currated lists."
      />
      {/* Lottie test */}
      {/* <div
        style={{
          width: 400,
          height: 400,
          margin: '0 auto',
          background: '#333'
        }}
      >
        <Lottie animationData={visitLottieData} loop />;
      </div> */}

      {/* TODO, will populate with active planet data onClick. Depends on planet data structure */}
      <DetailsModal
        isOpen={modalIsOpen}
        name={categoryCards[0].name}
        attributes={[
          { attribute: 'Planet Spec', value: 'Purple Wormhole' },
          { attribute: 'Planet Spec', value: 'Purple Wormhole' },
          { attribute: 'Planet Spec', value: 'Purple Wormhole' },
          { attribute: 'Planet Spec', value: 'Purple Wormhole' },
          { attribute: 'Planet Spec', value: 'Purple Wormhole' },
          { attribute: 'Planet Spec', value: 'Purple Wormhole' }
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
        description="Description of this sweet treasure hunt. Description of this sweet sweet treasure hunt event."
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
            visits={card.visits}
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
            visits={card.visits}
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
            visits={card.visits}
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
            visits={card.visits}
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
