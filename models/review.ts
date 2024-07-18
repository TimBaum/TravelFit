export interface IReview {
  author: string
  rating: number
  text: string
}

// Allows to overwrite attributes of a type definition
type Modify<T, R> = Omit<T, keyof R> & R

export interface IReviewPopulated
  extends Modify<
    IReview,
    {
      author: {
        _id: string
        displayName: string
      }
    }
  > {}
