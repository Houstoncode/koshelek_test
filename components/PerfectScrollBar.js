import PerfectScrollbar from 'perfect-scrollbar'

export default {
  props: {
    options: {
      type: Object,
      required: false,
      default: () => ({
        minScrollbarLength: 20,
      }),
    },
    tag: {
      type: String,
      required: false,
      default: 'div',
    },
    watchOptions: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      ps: null,
    }
  },
  watch: {
    watchOptions(shouldWatch) {
      if (!shouldWatch && this.watcher) {
        this.watcher()
      } else {
        this.createWatcher()
      }
    },
  },
  mounted() {
    this.create()

    if (this.watchOptions) {
      this.createWatcher()
    }
  },
  updated() {
    this.update()
  },
  beforeDestroy() {
    setTimeout(() => {
      this.destroy()
    }, 100)
  },
  methods: {
    create() {
      if (!(this.ps && this.$isServer)) {
        this.ps = new PerfectScrollbar(this.$refs.container, this.options)
      }
    },
    createWatcher() {
      this.watcher = this.$watch(
        'options',
        () => {
          this.destroy()
          this.create()
        },
        {
          deep: true,
        }
      )
    },
    update() {
      if (this.ps) {
        this.ps.update()
      }
    },
    destroy() {
      if (this.ps) {
        this.ps.destroy()
        this.ps = null
      }
    },
  },
  render(h) {
    return h(
      this.tag,
      {
        ref: 'container',
        class: 'ps',
        on: this.$listeners,
      },
      this.$slots.default
    )
  },
}
