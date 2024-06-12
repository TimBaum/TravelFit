export interface IAddress {
  street: string
  postalCode: string
  city: string
  country: string
  location: {
    type: string
    coordinates: [number, number]
  }
}
