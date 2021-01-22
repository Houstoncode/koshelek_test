export default ({ $axios }, inject) => {
  const requestService = $axios.create({
    baseURL: 'https://api1.binance.com/api/v3',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  const binanceApi = {}

  binanceApi.getOrdersBySymbol = (symbol, limit = 500) =>
    requestService.get(`/depth?symbol=${symbol}&limit=${limit}`)

  inject('binanceApi', binanceApi)
}
