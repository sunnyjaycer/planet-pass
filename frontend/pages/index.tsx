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

const eventCards = [
  {
    name: 'M4nyMoonz',
    imgSrc: '/temp-data/media/76.png',
    id: `ECard1`
  },
  {
    name: 'DunceDunce Partytown 6',
    imgSrc: '/temp-data/media/81.png',
    id: `ECard2`
  },
  {
    name: 'HotnDry',
    imgSrc: '/temp-data/media/265.png',
    id: `ECard3`
  }
]

const ancientCards = [
  {
    name: 'HengeHenge 6',
    imgSrc: '/temp-data/media/45.png',
    id: `ACard1`
  },
  {
    name: "Medusa's Last Breath",
    imgSrc: '/temp-data/media/58.png',
    id: `aCard2`
  },
  {
    name: 'A Planet-Sized Hamster',
    imgSrc: '/temp-data/media/84.png',
    id: `aCard3`
  }
]

const signsCards = [
  {
    name: 'Atlanticon',
    imgSrc: '/temp-data/media/15.png',
    id: `sCard1`
  },
  {
    name: 'Hedera Helix',
    imgSrc: '/temp-data/media/19.png',
    id: `sCard2`
  },
  {
    name: 'PsiloSector',
    imgSrc: '/temp-data/media/37.png',
    id: `sCard3`
  }
]

const dangerCards = [
  {
    name: 'IntestinalV5',
    imgSrc: '/temp-data/media/26.png',
    id: `dCard1`
  },
  {
    name: 'Uhoh, Hole.',
    imgSrc: '/temp-data/media/29.png',
    id: `dCard2`
  },
  {
    name: 'Plouton',
    imgSrc: '/temp-data/media/227.png',
    videoSrc: '/temp-data/media/227.mp4',
    id: `dCard3`
  }
]

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
        name="Plouton"
        attributes={[
          { trait_type: 'Atmosphere', value: 'Lightning Clouds' },
          { trait_type: 'Feature', value: 'Large Lava' },
          { trait_type: 'Terrain', value: 'Splatter' },
          { trait_type: 'Core', value: 'Pink' },
          { trait_type: 'Space', value: 'Fabric' },
          { trait_type: 'Space', value: 'Smudge' },
          { trait_type: 'Space', value: 'Galaxy Blue' },
          { trait_type: 'Space', value: 'Sparkles' }
        ]}
        price={0.69}
        videoSrc="/temp-data/media/227.mp4"
        handleClose={() => {
          setModalIsOpen(false)
        }}
      />
      {/* ----- */}
      {/* Featured Event */}
      <FeatureBlock
        kicker="Trending Faction"
        headline="CyberCore"
        description={
          <div>
            <p>
              Cybercore believes that our weak biological shells hold us back
              from perfection.
            </p>
            <p style={{ fontStyle: 'italic' }}>
              We’re trapped inside these shells no longer.
            </p>
          </div>
        }
        videoSrc="/temp-data/media/174.mp4"
        extraSpace
      />
      {/* ----- */}
      {/* Planets for the Event */}
      <CardGrid largeCards>
        {eventCards.map((card) => (
          <Card
            name={card.name}
            imgSrc={card.imgSrc}
            key={card.id}
            onClick={handlePlanetClick}
          />
        ))}
      </CardGrid>
      {/* ----- */}
      {/* Highlighted Groups/Categories */}
      <CardGrid
        header="Ancient Mysteries"
        linkText="View All"
        link="/planet-pass"
        largeCards
      >
        {ancientCards.map((card) => (
          <Card
            name={card.name}
            imgSrc={card.imgSrc}
            key={card.id}
            onClick={handlePlanetClick}
          />
        ))}
      </CardGrid>
      <CardGrid
        header="Signs of Life"
        linkText="View All"
        link="/planet-pass"
        largeCards
      >
        {signsCards.map((card) => (
          <Card
            name={card.name}
            imgSrc={card.imgSrc}
            key={card.id}
            onClick={handlePlanetClick}
          />
        ))}
      </CardGrid>
      <CardGrid
        header="Dangerous Visits"
        linkText="View All"
        link="/planet-pass"
        largeCards
      >
        {dangerCards.map((card) => (
          <Card
            name={card.name}
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
