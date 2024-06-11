export interface FilterState {
  price: {
    from: number | undefined
    to: number | undefined
  }
  rating: {
    from: number | undefined
    to: number | undefined
  }
  weekday: number | undefined
  radius: number | undefined
  highlights: Highlight[]
}
