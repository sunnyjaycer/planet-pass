export interface Attribute {
  trait_type: string
  value: string | number
}

export interface PlanetData {
  name: string
  price: number
  imgSrc: string | StaticImageData
  id: string
  attributes: Attribute[]
  videoSrc: string
}
