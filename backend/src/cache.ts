import NodeCache from 'node-cache'

const cache = new NodeCache({
  stdTTL: 10 * 60,
  checkperiod: 2 * 60,
  useClones: false,
})

export default cache
