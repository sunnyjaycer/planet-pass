import type { NextPage } from 'next'
import { useState } from 'react'
import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import CardGrid from '../components/CardGrid'
import Card from '../components/Card'
import DetailsModal from '../components/DetailsModal'
import Banner from '../components/Banner'
import cloudBanner from '../assets/backgrounds/bk-clouds.png'

const contentCards = [
  {
    name: 'Product Name',
    imgSrc: '/temp-data/media/45.png',
    id: `ACard1`,
    price: 0.3
  },
  {
    name: 'Product Name',
    imgSrc: '/temp-data/media/58.png',
    id: `aCard2`,
    price: 0.1
  },
  {
    name: 'Product Name',
    imgSrc: '/temp-data/media/84.png',
    id: `aCard3`,
    price: 0.2
  },
  {
    name: 'Product Name',
    imgSrc: '/temp-data/media/81.png',
    id: `aCard3`,
    price: 0.05
  }
]

const Store: NextPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  // TODO: Handle choosing active planet
  const handlePlanetClick = () => {
    setModalIsOpen(true)
  }

  return (
    <Layout title={'Store'}>
      <PageHeader title="Store" description="Something about the store." />

      {/* TODO, will populate with active product. */}
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
      <CardGrid header="Claim" collapsible>
        {contentCards.map((card) => (
          <Card
            name={card.name}
            imgSrc={card.imgSrc}
            key={card.id}
            onClick={handlePlanetClick}
            price={card.price}
            priceUnit="$tardust"
            tag="Blueprint"
          />
        ))}
      </CardGrid>

      <CardGrid header="What's Hot">
        {contentCards.map((card) => (
          <Card
            name={card.name}
            imgSrc={card.imgSrc}
            key={card.id}
            onClick={handlePlanetClick}
            price={card.price}
            priceUnit="$tardust"
            tag="Blueprint"
          />
        ))}
      </CardGrid>
      <CardGrid header="Posters" description="Description of posters.">
        {contentCards.map((card) => (
          <Card
            name={card.name}
            imgSrc={card.imgSrc}
            key={card.id}
            onClick={handlePlanetClick}
            price={card.price}
            priceUnit="$tardust"
            tag="Poster"
          />
        ))}
      </CardGrid>
      <CardGrid header="Blueprints" description="Description of blueprints.">
        {contentCards.map((card) => (
          <Card
            name={card.name}
            imgSrc={card.imgSrc}
            key={card.id}
            onClick={handlePlanetClick}
            price={card.price}
            priceUnit="$tardust"
            tag="Blueprint"
          />
        ))}
        {contentCards.map((card) => (
          <Card
            name={card.name}
            imgSrc={card.imgSrc}
            key={card.id}
            onClick={handlePlanetClick}
            price={card.price}
            priceUnit="$tardust"
            tag="Blueprint"
          />
        ))}
      </CardGrid>
      <Banner text="More galactic posters coming soon." imgSrc={cloudBanner} />
    </Layout>
  )
}

export default Store
