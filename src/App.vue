<template>
  <div id="app">
    <h1>数字缓动</h1>

    <div>
      <h2>基本功能</h2>
      <button @click="changeNumber('number')">随机生成一个数字</button>
      <tween-number v-model="number" :decimals="2"/>
    </div>
    <hr/>

    <div>
      <h2>添加前缀后缀</h2>
      <button @click="changeNumber('number2')">随机生成一个金额</button>
      <tween-number prefix="￥" suffix="rmb" v-model="number2" :decimals="2"/>
      <br/>
      <br/>
      <button @click="addProgress">进度增加</button>
      <tween-number suffix="%" v-model="progress" :startVal="progressStart" :duration="300"/>
    </div>
    <hr/>

    <div>
      <h2>格式化功能</h2>
      <h3>format money</h3>
      <button @click="changeNumber('number3')">随机生成一个金额</button>
      <tween-number prefix="$" v-model="number3" format="money" :decimals="2"/>
      <h3>format time</h3>
      <button @click="changeNumber('number4')">随机生成一个时间长度</button>
      <p>【hh:mm:ss】格式：
        通话时长：<tween-number v-model="number4" format="time"/></p>
      <p>【hh小时mm分支ss秒】格式：
        通话时长：<tween-number v-model="number4" format="time" timeLayout="hh小时mm分支ss秒"/></p>
      <h3>自定义格式化</h3>
      <button @click="changeNumber('number5')">随机生成一个数字</button>
      <tween-number v-model="number5" :format="format"/>
   </div>
   <hr/>

   <div>
      <h2>倒数(startVal值大于value值时)</h2>
      <button @click="changeNumber('number6')">随机生成一个负数</button>
      <tween-number v-model="number6" :startVal="300" :decimals="3"/>
   </div>

  </div>
</template>

<script>
import tweenNumber from '../lib';

export default {
  name: 'app',
  components: {
    tweenNumber,
  },
  data() {
    return {
      number: Math.ceil(Math.random() * 10000),
      number2: Math.ceil(Math.random() * 10000),
      progressStart: 0,
      progress: 0,
      number3: Math.ceil(Math.random() * 10000),
      number4: 60 * 61 + 10,
      number5: Math.ceil(Math.random() * 10000),
      number6: -Math.ceil(Math.random() * 10000),
    };
  },
  methods: {
    changeNumber(parma) {
      this[parma] = Math.ceil(Math.random() * 100000);
    },
    addProgress() {
      this.progressStart = this.progress;
      this.progress += 10;
    },
    format(number) {
      return `自定义${number}`;
    },
  },
};
</script>
<style lang="scss">
button{
  outline: none;
  border: 0;
}
button{
  padding: 7px 10px;
  color: #fff;
  background-color: #52BBFF;
  border-color: #52BBFF;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 30px;
}
</style>
