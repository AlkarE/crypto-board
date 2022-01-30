const API_KEY =
  '4d4178e3efd1b7d750ea0da36e54f87cb6ecf00614cc177d9eb9c1dddc4ed216'
export const getCurrency = async (ts) => {
  let cs
  const tickers = ts.map((t) => t.name).join(',')
  try {
    let r = await fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=${'USD'}&tsyms=${tickers}&api_key=${API_KEY}`
    )
    if (!r.ok) {
      throw new Error('Network error')
    }
    cs = await r.json()
    for (let key in cs) {
      let price = 1 / cs[key]
      cs[key] = price > 1 ? price.toFixed(2) : price.toPrecision(4)
    }
  } catch (e) {
    console.log(e.message)
  }
  return cs
}
