// cache libary for Node.js
import NodeCache from 'node-cache'

// cache duration and check period
const cache = new NodeCache({
  stdTTL: 10 * 60,
  checkperiod: 2 * 60,
  useClones: false,
})

export default cache
