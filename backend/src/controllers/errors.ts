export function isMongoError(error: any): error is { code: number } {
  return error && typeof error.code === 'number'
}
