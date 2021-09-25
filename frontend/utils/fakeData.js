import fpoImageThumb from '../assets/planet-fpo-thumb.jpg'

const samplePropertiesData = [
  { name: 'Space', values: ['bright', 'dark'] },
  { name: 'Core Type', values: ['ice', 'lava'] },
  { name: 'Terrain', values: ['grass', 'mountain', 'valley'] },
  { name: 'Features', values: ['cave', 'lake'] },
  { name: 'Atmosphere', values: ['oxygen', 'hydrogen', 'nitrogen'] },
  { name: 'Satellites', values: ['asteroid', 'mechanical'] },
  { name: 'Ships', values: ['death star', 'x-wing'] },
  { name: 'Anomalies', values: ['squishy', 'smelly', 'hamburger'] },
  { name: 'Diameter', values: ['real small', 'average', 'real big'] },
  { name: 'Age', values: ['1', '2', '3'] },
  { name: 'Faction', values: ['good', 'bad', 'neutral'] },
  {
    name: 'Distance from Center of Galaxy',
    values: ['near', 'far', 'wherever you are']
  }
]

export const fpoCards = new Array(500).fill(0).map((e, i) => ({
  name: 'Planet Name',
  visits: 100,
  price: 0.5,
  imgSrc: fpoImageThumb,
  id: `card${i}`,
  attributes: []
}))

fpoCards.forEach((cardData) => {
  samplePropertiesData.forEach((property) => {
    if (Math.random() <= 0.333) {
      const chooseFrom = property.values
      const randomValue =
        chooseFrom[Math.floor(Math.random() * chooseFrom.length)]
      cardData.attributes.push({
        trait_type: property.name,
        value: randomValue
      })
    }
  })
})
