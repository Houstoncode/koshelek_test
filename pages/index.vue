<template>
  <div class="container">
    <h3 class="title">Текущий символ: {{ currentSymbol }}</h3>
    <div class="content__orders">
      <div class="content__order-bid">
        <div class="content__order-header">
          <div class="content__order-col">Amount</div>
          <div class="content__order-col">Price</div>
          <div class="content__order-col --total">Total</div>
        </div>
        <perfect-scroll-bar class="content__order-body">
          <div
            v-for="(orderBidPrice, index) in getKeysBids"
            :key="index"
            class="content__order-row"
          >
            <div class="content__order-col">
              {{ orders.bids[orderBidPrice] }}
            </div>
            <div class="content__order-col">
              {{ orderBidPrice }}
            </div>
            <div class="content__order-col --total">
              {{ getTotalValue(orders.bids[orderBidPrice], orderBidPrice) }}
            </div>
          </div>
        </perfect-scroll-bar>
      </div>
      <div class="content__order-ask">
        <div class="content__order-header">
          <div class="content__order-col">Amount</div>
          <div class="content__order-col">Price</div>
          <div class="content__order-col --total">Total</div>
        </div>
        <perfect-scroll-bar class="content__order-body">
          <div
            v-for="(orderAskPrice, index) in getKeysAsks"
            :key="index"
            class="content__order-row"
          >
            <div class="content__order-col">
              {{ orders.asks[orderAskPrice] }}
            </div>
            <div class="content__order-col">
              {{ orderAskPrice }}
            </div>
            <div class="content__order-col --total">
              {{ getTotalValue(orders.asks[orderAskPrice], orderAskPrice) }}
            </div>
          </div>
        </perfect-scroll-bar>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import PerfectScrollBar from '@/components/PerfectScrollBar.js'

export default {
  components: { PerfectScrollBar },
  async asyncData({
    app: {
      store: { dispatch },
    },
  }) {
    await dispatch('fetchOrders')
  },
  data() {
    return {
      socket: null,
      newUIdentifier: false,
    }
  },
  computed: {
    ...mapState(['orders', 'currentSymbol']),
    getKeysBids() {
      return (this.orders.bids && Object.keys(this.orders.bids)) || []
    },
    getKeysAsks() {
      return (this.orders.asks && Object.keys(this.orders.asks)) || []
    },
    getTotalValue() {
      return (amount, price) => {
        return (parseFloat(amount) * parseFloat(price)).toFixed(3)
      }
    },
  },
  mounted() {
    this.socket = new WebSocket(
      `wss://stream.binance.com:9443/ws/${this.currentSymbol.toLowerCase()}@depth`
    )

    this.socket.onmessage = (e) => {
      const { data } = e

      const parseData = JSON.parse(data)

      // eslint-disable-next-line no-unused-vars
      const { U, u, a, b } = parseData
      const id = this.orders.lastUpdateId

      if (u > this.orders.lastUpdateId) {
        if (!this.newUIdentifier && U <= id + 1 && u >= id + 1) {
          this.newUIdentifier = u
          const data = {
            a,
            b,
            lastUpdateId: this.newUIdentifier,
          }

          this.updateOrders(data)
        } else {
          this.newUIdentifier = this.newUIdentifier + 1

          const data = {
            a,
            b,
            lastUpdateId: this.newUIdentifier,
          }

          this.updateOrders(data)
        }
      }
    }
  },
  beforeDestroy() {
    this.socket.close()
  },
  methods: {
    ...mapActions(['fetchOrders', 'updateOrders']),
  },
}
</script>

<style lang="scss" scoped>
.content {
  .container {
    width: 1280px;
    max-width: 1280px;
    max-height: calc(100vh - 96px);
  }

  &__orders {
    display: flex;
    justify-content: space-between;
  }

  &__order {
    &-bid,
    &-ask {
      flex: 1;
      height: 100%;
      border: 1px solid #c4c4c4;
      width: 50%;
      &:first-child {
        margin-right: 8px;
      }

      &:last-child {
        margin-left: 8px;
      }
    }

    &-row {
      border-top: 1px solid #c4c4c4;
    }

    &-body {
      display: flex;
      flex-direction: column;
      text-align: center;
      max-height: calc(100vh - 96px - 48px - 39px - 48px);
      overflow-y: hidden;

      > * {
        display: flex;

        > .content__order-col {
          overflow: hidden;
          text-overflow: ellipsis;
          flex-basis: 33.3%;
          max-width: 33.3%;
          padding: 8px 16px;

          &:not(:last-child) {
            border-right: 1px solid #c4c4c4;
          }
        }
      }
    }

    &-header {
      display: flex;
      text-align: center;

      > * {
        flex-basis: 33.3%;
        padding: 8px 16px;

        &:not(:last-child) {
          border-right: 1px solid #c4c4c4;
        }
      }
    }
  }
}

@media (max-width: 960px) {
  .title {
    font-size: 16px;
  }

  .content {
    .container {
      max-width: 600px;
      width: 100%;
      padding: 0 8px;
      padding-bottom: 16px;
      flex-direction: column;
      justify-content: center;
    }

    &__order {
      &-bid,
      &-ask {
        &:first-child {
          margin-right: 2px;
        }

        &:last-child {
          margin-left: 2px;
        }
      }

      &-body {
        max-height: calc(100vh - 96px - 48px - 27px - 24px - 48px);

        > * {
          &.content__order-col.--total {
            display: none;
          }

          > .content__order-col {
            font-size: 12px;
            flex-basis: 50%;
            max-width: 50%;
            padding: 4px;

            &.--total {
              display: none;
              border: none;
            }
          }
        }
      }

      &-header {
        display: flex;
        text-align: center;

        > * {
          font-size: 12px;
          flex-basis: 50%;
          padding: 4px;

          &.--total {
            display: none;
            border-right: none;
          }

          &:not(:last-child) {
            border-right: 1px solid #c4c4c4;
          }
        }
      }
    }
  }
}

@media (min-width: 600px) and (max-width: 960px) {
  .content {
    .container {
      max-width: 960px;
      width: 100%;
      padding: 0 8px;
      padding-bottom: 16px;
      flex-direction: column;
      justify-content: center;
    }

    &__order {
      &-bid,
      &-ask {
        &:first-child {
          margin-right: 4px;
        }

        &:last-child {
          margin-left: 4px;
        }
      }

      &-body {
        max-height: calc(100vh - 96px - 48px - 27px - 24px);
      }
    }
  }
}

@media (min-width: 960px) and (max-width: 1280px) {
  .content {
    .container {
      padding: 0 16px;
    }
  }
}
</style>
