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

export interface FilterSet {
  name: string
  values: Array<string>
}
export interface FilterState {
  [index: string]: boolean
}
export interface FilterGroupState {
  [index: string]: FilterState
}
export interface Filter {
  name: string
  value: string
}
