<template>
    <ul class="stack">
      <li class="stack-item" v-for="(item, index) in pages"
      :style="[transformIndex(index),transform(index)]"
      @touchmove.stop.capture.prevent="touchmove"
      @touchstart.stop.capture.prevent="touchstart"
      @touchend.stop.capture.prevent="touchend"
      @touchcancel.stop.capture.prevent="touchend"
      @mousedown.stop.capture.prevent="touchstart"
      @mouseup.stop.capture.prevent="touchend"
      @mousemove.stop.capture.prevent="touchmove"
      @mouseout.stop.capture.prevent="touchend">
        <div v-html="item.html"></div>
      </li>
    </ul>
</template>
<script>
export default {
  props: {
    pages: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      basicData: {
        start: {},
        end: {}
      },
      temporaryData: {
          currentPage: 0,
          visible: 3,
          posHeight: 0,
          posWidth: 0,
          tracking: false,
          animation: false,
          opacity: 1,
          swipe: false,
          lastPosWidth: '', // 记录上次最终位移
          lastPosHeight: '', // 记录上次最终位移
          lastZindex: '',
          lastRotate: 0,
          offsetY: '',
          rotate: 0,
          zIndex: 10
      }
    }
  },
  computed: {

    // 划出面积比例
    offsetRatio() {
      let width = this.$el.offsetWidth
      let height = this.$el.offsetHeight
      let offsetWidth = width - Math.abs(this.temporaryData.posWidth)
      let offsetHeight = height - Math.abs(this.temporaryData.posHeight)
      let ratio = 1 - (offsetWidth * offsetHeight) / (width * height) || 0
      return ratio > 1 ? 1 : ratio
    },

    // 划出宽度比例
    offsetWidthRatio() {
      let width = this.$el.offsetWidth
      let offsetWidth = width - Math.abs(this.temporaryData.posWidth)
      let ratio = 1 - offsetWidth / width || 0
      return ratio
    },

    // 划出高度比例
    angleRatio() {
      let height = this.$el.offsetHeight
      let offsetY = this.temporaryData.offsetY
      let ratio = -1 * (2 * offsetY / height - 1)
      return ratio || 0
    }
  },
  mounted() {
    // 绑定事件
    this.$on('next', () => {
      this.next()
    })
    this.$on('prev', () => {
      this.prev()
    })
  },
  methods: {
    touchstart(e) {
      if(this.temporaryData.tracking) return
      
      // Mobile terminal
      if(e.type === 'touchstart') {
        if(e.touches.length > 1) {
          this.temporaryData.tracking = false
          return
        } else {

          // record position
          this.basicData.start.x = e.targetTouches[0].clientX
          this.basicData.start.y = e.targetTouches[0].clientY
          this.basicData.end.x = e.targetTouches[0].clientX
          this.basicData.end.y = e.targetTouches[0].clientY

          this.temporaryData.offsetY = e.targetTouches[0].pageY - this.$el.offsetParent.offsetTop
        }
      } 

      // PC terminal
      else {
        this.basicData.start.x = e.clientX
        this.basicData.start.y = e.clientY
        this.basicData.end.x = e.clientX
        this.basicData.end.y = e.clientY
        this.temporaryData.offsetY = e.offsetY
      }

      this.temporaryData.tracking  = true
      this.temporaryData.animation = false
    },
    touchmove(e) {

      // record slide position
      if(this.temporaryData.tracking && !this.temporaryData.animation) {
        if(e.type === 'touchmove') {
          e.preventDefault()
          this.basicData.end.x = e.targetTouches[0].clientX
          this.basicData.end.y = e.targetTouches[0].clientY
        } else {
          e.preventDefault()
          this.basicData.end.x = e.clientX
          this.basicData.end.y = e.clientY
        }

        // compute slide numerical
        this.temporaryData.posWidth = this.basicData.end.x - this.basicData.start.x
        this.temporaryData.posHeight = this.basicData.end.y - this.basicData.start.y

        // 计算偏移角度
        let rotateDirection = this.rotateDirection()
        this.temporaryData.rotate = rotateDirection * this.offsetWidthRatio * 15 * this.angleRatio
      }
    },
    touchend(e) {
      this.temporaryData.tracking = false
      this.temporaryData.animation = true
      
      // 划出面积是否大于0.4
      if (this.offsetRatio >= 0.4) {

        // 计算划出后最终位置
        let ratio = Math.abs(this.temporaryData.posHeight / this.temporaryData.posWidth)
        this.temporaryData.posWidth = this.temporaryData.posWidth >= 0 ? this.temporaryData.posWidth + 200 : this.temporaryData.posWidth - 200

        this.temporaryData.posHeight = this.temporaryData.posHeight >= 0 ? Math.abs(this.temporaryData.posWidth * ratio) : -Math.abs(this.temporaryData.posWidth * ratio)

        this.temporaryData.opacity = 0
        this.temporaryData.swipe = true
        this.nextTick()
      // 不满足条件则滑入
      } else {
        this.temporaryData.posWidth = 0
        this.temporaryData.posHeight = 0
        this.temporaryData.swipe = false
        this.temporaryData.rotate = 0
      }
    },
    nextTick() {
      
      // 记录最终滑动距离
      this.temporaryData.lastPosWidth = this.temporaryData.posWidth
      this.temporaryData.lastPosHeight = this.temporaryData.posHeight
      this.temporaryData.lastRotate = this.temporaryData.rotate
      this.temporaryData.lastZindex = 20

      // 循环currentPage
      this.temporaryData.currentPage = this.temporaryData.currentPage === this.pages.length - 1 ? 0 : this.temporaryData.currentPage + 1
      
      // DOM更新后，新的首页初始化
      this.$nextTick(() => {
        this.temporaryData.posWidth = 0
        this.temporaryData.posHeight = 0
        this.temporaryData.opacity = 1
        this.temporaryData.rotate = 0
      })
    },
    prev() {
      this.temporaryData.tracking = false
      this.temporaryData.animation = true

      // 计算划出后最终位置
      let width = this.$el.offsetWidth
      this.temporaryData.posWidth = -width
      this.temporaryData.posHeight = 0
      this.temporaryData.opacity = 0
      this.temporaryData.rotate = '-3'
      this.temporaryData.swipe = true
      this.nextTick()
    },
    next() {
      this.temporaryData.tracking = false
      this.temporaryData.animation = true

      // 计算划出后最终位置
      let width = this.$el.offsetWidth
      this.temporaryData.posWidth = width
      this.temporaryData.posHeight = 0
      this.temporaryData.opacity = 0
      this.temporaryData.rotate = '3'
      this.temporaryData.swipe = true
      this.nextTick()
    },
    rotateDirection() {
      if (this.temporaryData.posWidth <= 0) {
        return -1
      } else {
        return 1
      }
    },
    inStack(index, currentPage) {
      let stack = []
      let visible = this.temporaryData.visible
      let length = this.pages.length
      for (let i = 0; i < visible; i++) {
        if (currentPage + i < length) {
          stack.push(currentPage + i)
        } else {
          stack.push(currentPage + i - length)
        }
      }
      return stack.indexOf(index) >= 0
    },

    // 非首页样式切换
    transform(index) {
      let style = {}
      let length = this.pages.length
      let currentPage = this.temporaryData.currentPage
      let visible = this.temporaryData.visible
      let lastPage = currentPage === 0 ? this.pages.length - 1 : currentPage - 1
      
      if (index === this.temporaryData.currentPage) {
        return
      }

      // 序列中的所有图片
      if (this.inStack(index, currentPage)) {
        let perIndex = index - currentPage > 0 ? index - currentPage : index - currentPage + length
        style['opacity'] = '1'
        style['transform'] = 'translate3D(0,0,' + -1 * 60 * (perIndex - this.offsetRatio) + 'px' + ')'
        style['zIndex'] = visible - perIndex
        if (!this.temporaryData.tracking) {
          style['transitionTimingFunction'] = 'ease'
          style['transitionDuration'] = 300 + 'ms'
        }
      } 

      // DOM刷新前的首张，即需要隐藏的图片
      else if (index === lastPage) {
        style['transform'] = 'translate3D(' + this.temporaryData.lastPosWidth + 'px' + ',' + this.temporaryData.lastPosHeight + 'px' + ',0px) ' + 'rotate(' + this.temporaryData.lastRotate + 'deg)'
        style['opacity'] = 0
        style['zIndex'] = this.temporaryData.lastZindex
        style['transitionTimingFunction'] = 'ease'
        style['transitionDuration'] = 300 + 'ms'
      } else {
        style['zIndex'] = '-1'
        style['transform'] = `translate3D(0,0,${-visible * 60}px)`
      }
      return style
    },

    // 首页样式切换
    transformIndex(index) {
      if (index === this.temporaryData.currentPage) {
        let style = {}
        style['transform'] = 'translate3D(' + this.temporaryData.posWidth + 'px' + ',' + this.temporaryData.posHeight + 'px' + ',0px) ' + 'rotate(' + this.temporaryData.rotate + 'deg)'
        style['opacity'] = this.temporaryData.opacity
        style['zIndex'] = 10
        if (this.temporaryData.animation) {
          style['transitionTimingFunction'] = 'ease'
          style['transitionDuration'] = (this.temporaryData.animation ? 300 : 0) + 'ms'
        }
        return style
      }
    }
  }
}
</script>
<style>
  .stack {
    width: 100%;
    height: 100%;
    position: relative;
    perspective: 1000px;
    perspective-origin: 50% 150%;
    -webkit-perspective: 1000px;
    -webkit-perspective-origin: 50% 150%;
    margin: 0;
    padding: 0;
  }
  .stack-item{
    ackground: #fff;
    height: 100%;
    width: 100%;
    border-radius: 4px;
    text-align: center;
    overflow: hidden;
    position: absolute;
    opacity: 0;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: auto;
  }
  .stack-item img {
    width: 100%;
    display: block;
    pointer-events: none;
  }
  .stack-container li.move-back {
    /* http://matthewlein.com/ceaser/ */
    -webkit-transition-timing-function: cubic-bezier(0.175, 0.885, 0.470, 1); /* older webkit */
    -webkit-transition-timing-function: cubic-bezier(0.175, 0.885, 0.470, 1.515);
    transition-timing-function: cubic-bezier(0.175, 0.885, 0.470, 1.515);
  }
</style>
