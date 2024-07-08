export type Weekday =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

export interface ITimeRange {
  weekday1: string
  weekday2: string
  openingHour: number
  closingHour: number

  // weekday: Number
  // openingTime: {
  //   hour: Number
  //   minute: Number
  // }
  // closingTime: {
  //   hour: Number
  //   minute: Number
  // }
}
