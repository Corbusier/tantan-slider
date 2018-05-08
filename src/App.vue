<template>
  <div id="app">
    <div>
      <div class="stack-wrapper">
        <stack ref="stack" :pages="someList"/>
      </div>
      <div class="controls">
        <button @click="prev" class="button"><i class="prev"></i><span class="text-hidden">prev</span></button>
        <button @click="next" class="button"><i class="next"></i><span class="text-hidden">next</span></button>
      </div>
    </div>
  </div>
</template>

<script>
  import stack from './components/stack'

  export default {
    name: 'App',
    data() {
      return {
        someList: []
      }
    },
    components: {
      stack
    },
    mounted() {
      let self = this
      setTimeout( ()=> {
        self.someList = [
          {
            html: '<img src="https://ws4.sinaimg.cn/large/006tNc79ly1fqq7j73wsvj308w08wglf.jpg" alt="01">'
          },
          {
            html: '<img src="https://ws1.sinaimg.cn/large/006tNc79ly1fqq7j6pqvkj308w08wjr6.jpg" alt="02">'
          },
          {
            html: '<img src="https://ws1.sinaimg.cn/large/006tNc79ly1fqq7j6hd7tj308w08w3yc.jpg" alt="03">'
          },
          {
            html: '<img src="https://ws1.sinaimg.cn/large/006tNc79ly1fqq7j6ai99j308w08w0sj.jpg" alt="04">'
          },
          {
            html: '<img src="https://ws3.sinaimg.cn/large/006tNc79ly1fqq7j62cjsj308w08wglf.jpg" alt="05">'
          },
          {
            html: '<img src="https://ws3.sinaimg.cn/large/006tNc79ly1fqq7j62cjsj308w08wglf.jpg" alt="06">'
          },
          {
            html: '<img src="https://ws1.sinaimg.cn/large/006tNc79ly1fqq7j5pxmjj308w08w743.jpg" alt="07">'
          }
        ]
      },200)
    },
    methods: {
      prev () {
        this.$refs.stack.$emit('prev')
      },
      next () {
        this.$refs.stack.$emit('next')
      }
    }
  }
</script>

<style>
  body {
    background: #565f77 none repeat scroll 0 0;
    color: #000;
    font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
    margin: 0;
    padding: 0;
    /* position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;*/

    /*bug:当内容超过一屏时，滚动条需要默认显示*/
    overflow-y: scroll;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  h3 {
      font-size: 20px;
      margin: 0;
      margin-top: 25px;
  }

  @-webkit-keyframes loading-7{
    0%{margin-bottom:0}
    50%{margin-bottom:20px;}
    100%{margin-bottom:0px;}
  }

  .loadingDot i {
    display: inline-block;
    margin-left: 5px;
    background: rgb(27, 188, 155);
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .loadingDot i:nth-child(1) {
    -webkit-animation: loading-7 .7s ease-in 0s infinite;
  }

  .loadingDot i:nth-child(2) {
    -webkit-animation: loading-7 .7s ease-in 0.15s infinite;
  }

  .loadingDot i:nth-child(3) {
    -webkit-animation: loading-7 .7s ease-in 0.3s infinite;
  }

  .loadingDot i:nth-child(4) {
    -webkit-animation: loading-7 .7s ease-in 0.45s infinite;
  }

  *,
  *:after,
  *::before {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      outline:none;
  }

  #app{
      display:flex;/*Flex布局*/
      display: -webkit-flex; /* Safari */
      align-items:center;/*指定垂直居中*/
      justify-content:center;/*指定水平居中*/
      height: 100%;
  }

  button::-moz-focus-inner,input[type="reset"]::-moz-focus-inner,input[type="button"]::-moz-focus-inner,input[type="submit"]::-moz-focus-inner,input[type="file"] > input[type="button"]::-moz-focus-inner {
      border: none;
  }

  :focus{
      outline: 0;
  }

  .stack-wrapper{
    margin: 0 auto;
    position: relative;
    z-index: 1000;
    width: 320px;
    height: 320px;
    padding: 0;
    list-style: none;
    pointer-events: none;
  }

  .controls{
    position: relative;
    width: 200px;
    text-align: center;
    display:flex;/*Flex布局*/
    display: -webkit-flex; /* Safari */
    justify-content:space-around;
    margin: 0 auto;
    margin-top: 50px
  }

  .controls .button {
    border: none;
    background: none;
    position: relative;
    display: inline-block;
    cursor: pointer;
    font-size: 16px;
    width: 50px;
    height: 50px;
    z-index: 100;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    border-radius: 50%;
    background: #fff;
  }

  .button .next{
    display: inline-block;
    width: 10px;
    height:5px;
    background: rgb(129,212,125);
    line-height: 0;
    font-size:0;
    vertical-align: middle;
    -webkit-transform: rotate(45deg);
    left: -5px;
    top: 2px;
    position: relative;
  }

  .button .next:after{
    content:'/';
    display:block;
    width: 20px;
    height:5px;
    background: rgb(129,212,125);
    -webkit-transform: rotate(-90deg) translateY(-50%) translateX(50%);
  }

  .button .prev{
    display: inline-block;
    width: 20px;
    height:5px;
    background: rgb(230,104,104);
    line-height: 0;
    font-size:0;
    vertical-align: middle;
    -webkit-transform: rotate(45deg);
  }

  .button .prev:after{
    content:'/';
    display:block;
    width: 20px;
    height:5px;
    background: rgb(230,104,104);
    -webkit-transform: rotate(-90deg);
  }
  
  .controls .text-hidden {
    position: absolute;
    overflow: hidden;
    width: 0;
    height: 0;
    color: transparent;
    display: block;
  }
</style>
