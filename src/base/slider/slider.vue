<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active:currentPageIndex===index}" v-for="(item,index) in dots" :key="index"></span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
//轮播插件
import BScroll from "better-scroll";
//引入添加类名的公共类
import { addClass } from "common/js/dom";
export default {
  name: "slider",
  props: {
    loop: {
      //设置是否滚动
      type: Boolean,
      default: true
    },
    autoPLay: {
      //设置自动播放
      type: Boolean,
      default: true
    },
    interval: {
      //设置播放的时间间隔
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  mounted() {
    setTimeout(() => {
      //设置轮播图的宽度
      this._setSliderWidth();
      this._initDots();
      //初始化轮播图的参数
      this._initSlider();
      if (this.autoPLay) {
        this._play();
      }
    }, 20);
    window.addEventListener('resize',()=>{
      if(!this.slider){
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children;

      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, "slider-item");

        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    _initDots(){
      this.dots=new Array(this.children.length)
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400
      });
      this.slider.on('scrollEnd',()=>{
        let pageIndex=this.slider.getCurrentPage().pageX
        if(this.loop){
          pageIndex-=1
        }
        this.currentPageIndex=pageIndex
        if(this.autoPLay){
          this._play()
        }
      })
      this.slider.on('beforeScrollStart',()=>{
        if(this.autoPLay){
          clearTimeout(this.timer)
        }
      })
    },
    _play() {
      let pageIndex = this.currentPageIndex + 1;
      if (this.loop) {
        pageIndex += 1;
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400);
      }, this.interval);
    }
  },
  destroyed(){
    clearTimeout(this.timer)
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>
