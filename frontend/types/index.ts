export interface Attribute {
  trait_type: string
  value: string | number
}

export interface PlanetData {
  name: string
  price: number
  id: string
  attributes: Attribute[]
  imgSrc: string | StaticImageData
  videoSrc: string
  stampSrc?: string | StaticImageData
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
