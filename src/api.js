const API_KEY =
  '4d4178e3efd1b7d750ea0da36e54f87cb6ecf00614cc177d9eb9c1dddc4ed216'

const AGREGATE_INDEX = '5'

const tickershandlers = new Map()

const socket = new WebSocket(
  'wss://streamer.cryptocompare.com/v2?api_key=' + API_KEY
)

const sendMessage = (message) => {
  if (socket.readyState === 'open') {
    socket.send(JSON.stringify(message))
    return
  }
  socket.addEventListener(
    'open',
    () => {
      socket.send(JSON.stringify(message))
    },
    { once: true }
  )
}

const subscribeToTickerWs = (tickerName) => {
  const message = {
    action: 'SubAdd',
    subs: [`5~CCCAGG~${tickerName}~USD`],
  }
  sendMessage(message)
}
//
const unsubscribeFromTickerWs = (tickerName) => {
  const message = {
    action: 'SubRemove',
    subs: [`5~CCCAGG~${tickerName}~USD`],
  }
  sendMessage(message)
}

socket.addEventListener('message', (e) => {
  getMessage(e)
})

const getMessage = (e) => {
  const { TYPE: type, FROMSYMBOL: symbol, PRICE: price } = JSON.parse(e.data)
  if (type === AGREGATE_INDEX && price !== undefined) {
    const handlers = tickershandlers.get(symbol) ?? []
    handlers.forEach((fn) => fn(price))
  }
}

export const subscribeToTicker = (tickername, cb) => {
  let subscribers = tickershandlers.get(tickername) || []
  tickershandlers.set(tickername, [...subscribers, cb])
  subscribeToTickerWs(tickername)
}

export const unsubscribeFromTicker = (tickername) => {
  tickershandlers.delete(tickername)
  unsubscribeFromTickerWs(tickername)
}
window.ticker = tickershandlers
