<template>
  <div class="container">
    <div class="content__select">
      <label for="symbol" class="content__select-label">Выберите символ</label>
      <select id="symbol" v-model="currentSymbol" class="content__select-input">
        <option value="BTCUSDT">BTCUSDT</option>
        <option value="BNBBTC">BNBBTC</option>
        <option value="ETHBTC">ETHBTC</option>
      </select>
    </div>
    <div class="hr" />
    <h4>Список diff-изменений</h4>
    <ul class="content__list">
      <li v-for="diff in diffHistory" :key="diff" class="content__list-item">
        {{ diff }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['diffHistory']),
    currentSymbol: {
      get() {
        return this.$store.state.currentSymbol
      },
      set(value) {
        this.setSymbol(value)
      },
    },
  },
  methods: {
    ...mapMutations(['setSymbol']),
  },
}
</script>

<style lang="scss" scoped>
.content {
  .container {
    width: 1280px;
    max-width: 1280px;
    max-height: calc(100vh - 96px);
    padding: 0 16px;
  }

  &__select {
    position: relative;

    &-input {
      display: block;
      width: 100%;
      padding: 16px 24px;
      background: none;
      border: 1px solid #ccc;
      border-radius: 3px;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      font-family: inherit;
      font-size: 1rem;
      color: #444;
    }

    &::after {
      content: '';
      display: block;
      border-style: solid;
      border-width: 6px 5px 0 5px;
      border-color: #000 transparent transparent transparent;
      pointer-events: none;
      position: absolute;
      bottom: 25%;
      transform: translateY(-50%);
      right: 1rem;
      z-index: 1;
      margin-top: -3px;
    }
  }

  &__list {
    overflow: overlay;
    list-style: none;
    max-height: 400px;

    &-item {
      padding: 8px 0;
    }
  }
}

@media (max-width: 800px) {
  .content {
    &__list {
      max-height: calc(100vh - 96px - 16px - 57px - 22px - 48px - 33px - 48px);
    }
  }
}
</style>
