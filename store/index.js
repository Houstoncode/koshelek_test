import cloneDeep from 'lodash/cloneDeep'

export const state = () => ({
  currentSymbol: 'BTCUSDT',
  orders: {},
  diffHistory: [],
})

export const mutations = {
  setSymbol(state, data) {
    state.currentSymbol = data
  },
  setOrders(state, data) {
    state.orders = data
  },
  setDiffHistory(state, data) {
    state.diffHistory = data
  },
}

export const actions = {
  async fetchOrders({ state, commit, dispatch }) {
    const { data } = await this.$binanceApi.getOrdersBySymbol(
      state.currentSymbol
    )
    const fullData = { ...data, asks: {}, bids: {} }

    data.asks.forEach((ask) => {
      fullData.asks[ask[0]] = ask[1]
    })
    data.bids.forEach((bid) => {
      fullData.bids[bid[0]] = bid[1]
    })

    fullData.asks = await dispatch('getKeysSort', fullData.asks)
    fullData.bids = await dispatch('getKeysSort', fullData.bids)

    commit('setOrders', fullData)
  },
  async updateOrders({ state, commit, dispatch }, data) {
    const fullData = cloneDeep(state.orders)
    const { a, b, lastUpdateId } = data

    a.forEach((aValue) => {
      if (aValue[1] === '0.00000000') delete fullData.asks[aValue[0]]
      else {
        if (fullData.asks[aValue[0]]) {
          commit('setDiffHistory', [
            ...state.diffHistory,
            `Спрос. Символ: ${state.currentSymbol} Было: [price = ${
              aValue[0]
            }, amount = ${fullData.asks[aValue[0]]}]. Стало: [price=${
              aValue[0]
            }, amount = ${aValue[1]}]`,
          ])
        }
        fullData.asks[aValue[0]] = aValue[1]
      }
    })

    b.forEach((bValue) => {
      if (bValue[1] === '0.00000000') delete fullData.bids[bValue[0]]
      else {
        if (fullData.bids[bValue[0]]) {
          commit('setDiffHistory', [
            ...state.diffHistory,
            `Предложение. Символ: ${state.currentSymbol} Было: [price = ${
              bValue[0]
            }, amount = ${fullData.bids[bValue[0]]}]. Стало: [price=${
              bValue[0]
            }, amount = ${bValue[1]}]`,
          ])
        }
        fullData.bids[bValue[0]] = bValue[1]
      }
    })

    fullData.asks = await dispatch('getKeysSort', fullData.asks)
    fullData.bids = await dispatch('getKeysSort', fullData.bids)

    fullData.lastUpdateId = lastUpdateId

    commit('setOrders', fullData)
  },
  getKeysSort(_ctx, obj) {
    const keys = Object.keys(obj)
    keys.sort((a, b) => {
      return -(a - b)
    })
    const res = {}
    keys.forEach((i) => (res[i] = obj[i]))
    return res
  },
}
