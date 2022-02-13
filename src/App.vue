<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div
      v-if="false"
      data-spinner
      class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center"
    >
      <svg
        class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <div class="container">
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700"
              >Тикер</label
            >
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                type="text"
                name="wallet"
                autocomplete="off"
                @input="onSearch"
                v-model="ticker"
                @keydown.enter="addTicker"
                id="wallet"
                class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                placeholder="Например DOGE"
              />
            </div>
            <div class="flex bg-white p-1 rounded-md shadow-md flex-wrap">
              <span
                v-for="c of currencies()"
                :key="c.id"
                @click="placeTicker(c)"
                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
              >
                {{ c.name }}
              </span>
            </div>
            <div v-if="notice" class="text-sm text-red-600">
              Такой тикер уже добавлен
            </div>
          </div>
        </div>
        <button
          @click="addTicker"
          type="button"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <!-- Heroicon name: solid/mail -->
          <svg
            class="-ml-0.5 mr-2 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#ffffff"
          >
            <path
              d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            ></path>
          </svg>
          Добавить
        </button>
      </section>

      <hr class="w-full border-t border-gray-600 my-4" />
      <div class="p-4">
        <label for="" class="my-4">
          filter
          <input type="text" v-model="filter" />
        </label>
        <p>
          <button
            @click="onPrevPage"
            v-if="page > 1"
            class="my-4 mx-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Prev
          </button>
          <button
            @click="onNextPage"
            v-if="hasNextPage"
            class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Next
          </button>
        </p>
      </div>
      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div
          v-for="t of paginatedTickers"
          :key="t.id"
          class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          :class="selected === t ? 'border-4' : ''"
          @click="handleSelected(t)"
        >
          <div
            class="px-4 py-5 sm:p-6 text-center"
            :class="{ 'bg-red-100': !isAlive(t) }"
          >
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ t.name }} - USD
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ t.price }}
            </dd>
          </div>
          <div class="w-full border-t border-gray-200"></div>
          <button
            @click="handleDelete(t.id)"
            class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
          >
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#718096"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              ></path></svg
            >Удалить
          </button>
        </div>
      </dl>
      <template v-if="selected">
        <hr class="w-full border-t border-gray-600 my-4" />

        <section class="relative">
          <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
            {{ selected.name }} - USD
          </h3>
          <div
            class="flex items-end border-gray-600 border-b border-l h-64"
            ref="graphBox"
          >
            <div
              v-for="(d, index) in normalized"
              :key="index"
              class="bg-purple-800 border w-10"
              :style="{ height: d + '%' }"
            ></div>
          </div>
          <button
            @click="removeSelected"
            type="button"
            class="absolute top-0 right-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns:svgjs="http://svgjs.com/svgjs"
              version="1.1"
              width="30"
              height="30"
              x="0"
              y="0"
              viewBox="0 0 511.76 511.76"
              style="enable-background: new 0 0 512 512"
              xml:space="preserve"
            >
              <g>
                <path
                  d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                  fill="#718096"
                  data-original="#000000"
                ></path>
              </g>
            </svg>
          </button>
        </section>
      </template>
    </div>
  </div>
</template>

<script>
// format price
// write subscribe

import { subscribeToTicker } from './api'
import './assets/app.css'
function uid() {
  return Math.random().toString(16).slice(2)
}
export default {
  name: 'App',
  components: {},
  data() {
    return {
      ticker: '',
      tickers: [],
      selected: null,
      graph: [],
      maxGraph: 1,
      notice: false,
      filter: '',
      page: 1,
    }
  },
  list: [],
  timer: null,
  interval: 5 * 60 * 60,
  computed: {
    startIndex() {
      return 6 * (this.page > 0 ? this.page - 1 : 0)
    },
    endindex() {
      return 6 * this.page
    },
    filtered() {
      return this.tickers.filter((t) =>
        t.name.includes(this.filter.toUpperCase())
      )
    },
    paginatedTickers() {
      return this.filtered.slice(this.startIndex, this.endindex)
    },
    hasNextPage() {
      return this.filtered.length > this.endindex
    },
    normalized() {
      let min = Math.min(...this.graph)
      let max = Math.max(...this.graph)
      const newMin = 5
      const newMax = 100
      if (min === max) max = max + newMax
      return this.graph.map((x) => {
        if (min === max) return x.toPrecision(2)
        let v = newMin + ((x - min) * (newMax - newMin)) / (max - min)
        return v.toPrecision(2)
      })
    },
    pageStateOptions() {
      return {
        page: this.page,
        filter: this.filter,
      }
    },
  },
  methods: {
    isAlive(t) {
      // const created = t.created
      // const modified = t.modified
      // if (now < this.$options.startTime + this.$options.interval) {
      //   return true
      // }
      // return (
      //   !!t.modified &&
      //   t.modified > this.$options.startTime + this.$options.interval
      // )
      console.log(`ticker to check ${t.name}`)
      return !!t.created
    },
    calcMaxGraphElems() {
      if (!this.$refs.graphBox) {
        return
      }
      this.maxGraph = this.$refs.graphBox.clientWidth / 38
    },
    onNextPage() {
      if (this.hasNextPage) this.page++
    },
    onPrevPage() {
      if (this.page > 1) {
        this.page -= 1
      }
    },
    isTickerExists(ticker) {
      let found = this.tickers.find((t) => t.name === ticker.name)

      return found ? true : false
    },

    async placeTicker() {
      // if (!this.isTickerExists(ticker)) {
      //   let price = await getCurrency(ticker.name)
      //   ticker.price = price.USD
      //   this.ticker = ''
      //   this.tickers.push(ticker)
      // } else {
      //   this.ticker = ticker.name
      //   this.notice = true
      // }
    },
    addTicker() {
      const currency = {
        id: uid(),
        name: this.ticker.toUpperCase(),
        price: '-',
        created: Date.now(),
        modified: false,
      }
      this.ticker = ''
      subscribeToTicker(currency.name, (newPrice) => {
        this.updateTickersPrice(currency.name, newPrice)
      })
      subscribeToTicker(currency.name, () => {
        const timeStamp = Date.now()

        this.setUpdatedTime(currency.name, timeStamp)
      })
      this.tickers = [...this.tickers, currency]
    },
    setUpdatedTime(tickerName, timeStamp) {
      this.tickers
        .filter((ticker) => tickerName === ticker.name)
        .forEach((item) => (item.modified = timeStamp))
    },
    updateTickersPrice(tickerName, price) {
      if (this.selected && this.selected.name === tickerName) {
        if (this.maxGraph === 1) {
          this.calcMaxGraphElems()
        }
        while (this.graph.length > this.maxGraph) {
          this.graph.shift()
        }
        this.graph.push(price)
      }
      this.tickers
        .filter((t) => t.name === tickerName)
        .forEach((item) => {
          item.price = price
        })
    },
    formatPrice(price) {
      if (price === '-') return price
      return price > 1 ? price.toFixed(2) : price.toPrecision(2)
    },
    handleDelete(id) {
      this.tickers = this.tickers.filter((c) => c.id !== id)
    },
    handleSelected(t) {
      this.selected = t
      this.graph = []
    },
    removeSelected() {
      this.selected = null
      // log(this.$options.timer)
      clearInterval(this.$options.timer)
    },

    //     const normalizeBetweenTwoRanges = (val, minVal, maxVal, newMin, newMax) => {
    //      return newMin + (val - minVal) * (newMax - newMin) / (maxVal - minVal);
    //    };
    // (value - min) * 100 / (max - min)

    // оценить важность проблем приложения

    async getList() {
      let r = await fetch(
        'https://min-api.cryptocompare.com/data/all/coinlist?summary=true'
      )
      let d = await r.json()
      this.$options.list = d.Data
    },
    onSearch() {
      this.notice = false
    },
    currencies() {
      if (this.ticker === '') return []
      let search = this.ticker.toUpperCase()
      let found = []
      let counter = 0
      let list = this.$options.list
      for (let c in list) {
        if (counter > 3) break
        if (c.includes(search) || list[c].FullName.includes(search)) {
          found.push({
            id: list[c].Id,
            name: c,
          })
          counter++
        }
      }

      return found
    },
    saveData() {
      localStorage.setItem('tickersData', JSON.stringify(this.tickers))
    },
    loadData() {
      const data = localStorage.getItem('tickersData')
      if (data) {
        this.tickers = JSON.parse(data)
        this.tickers.forEach((t) =>
          subscribeToTicker(t.name, (newPrice) => {
            let timeStamp = Date.now()
            this.updateTickersPrice(t.name, newPrice)
            this.setUpdatedTime(t.name, timeStamp)
          })
        )
      }
    },
  },

  watch: {
    tickers() {
      // this.updateTickersPrice()
      this.saveData()
    },
    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page >= 1) {
        // this.page -= 1
        console.log('paginating')
      }
    },
    filter() {
      this.page = 1
    },
    pageStateOptions(v) {
      window.history.pushState(
        null,
        document.title,
        `?filter=${v.filter}&page=${v.page}`
      )
    },
  },
  created() {
    this.getList()
    this.loadData()

    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    )

    windowData.filter && (this.filter = windowData.filter)
    windowData.page && (this.page = windowData.page)
  },
  mounted() {
    window.addEventListener('resize', this.calcMaxGraphElems)
  },
}
</script>
<style>
.bg-red-100 {
  background-color: rgba(255, 0, 0, 0.15);
}
</style>
