<template>
  <span>{{displayVal}}</span>
</template>

<script>
import Easing from './utils/easing';
import {
  requestAnimationFrame,
  cancelAnimationFrame,
} from './utils/requestAnimationFrame';

export default {
  name: 'tween-number',
  props: {
    format: {
      type: [String, Function], // money time
    },
    timeLayout: {
      type: String,
      default: 'hh:mm:ss',
    },
    decimals: {
      type: Number,
      default: 0,
    },
    startVal: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 300,
    },
    duration: {
      type: Number,
      default: 1000,
    },
    prefix: {
      type: String,
      default: '',
    },
    suffix: {
      type: String,
      default: '',
    },
    ease: {
      type: String,
      default: 'Linear',
    },
  },
  data() {
    return {
      startTime: null,
      currentVal: 0,
      displayVal: 0,
      startLog: 0,
      endLog: 0,
    };
  },
  watch: {
    value() {
      this.cancelRequestAnimationFrame();
      this.start();
    },
  },
  methods: {
    zeroFill(value) {
      return +value < 10 ? (`0${value}`) : value;
    },
    formatNumber(number) {
      const formatMap = {
        money: this.toMoney,
        time: this.toTime,
      };
      if (this.format) {
        if (formatMap[this.format]) {
          return `${this.prefix}${formatMap[this.format](number.toFixed(this.decimals))}${this.suffix}`;
        }
        return `${this.prefix}${this.format(number.toFixed(this.decimals))}${this.suffix}`;
      }
      return `${this.prefix}${number.toFixed(this.decimals)}${this.suffix}`;
    },
    toMoney(number) {
      const negative = parseFloat(number) < 0 ? '-' : '';
      const numberArray = number.toString().split('.');
      const base = Math.abs(parseInt(numberArray[0], 10)).toString();
      const mod = base.length > 3 ? base.length % 3 : 0;
      const decimal = numberArray[1].padEnd(this.decimals, '0');
      const baseStr = `${mod ? `${base.substr(0, mod)},` : ''}${base.substr(mod).replace(/(\d{3})(?=\d)/g, '$1,')}`;
      const decimalStr = this.decimals ? `.${decimal.substring(0, this.decimals)}` : '';
      return `${negative}${baseStr}${decimalStr}`;
    },
    toTime(number) {
      const value = Math.ceil(number);
      const hour = Math.floor(value / 3600);
      const minute = Math.floor((value % 3600) / 60);
      const sencond = value % 60;
      const token = {
        hh: this.zeroFill(hour),
        mm: this.zeroFill(minute),
        ss: this.zeroFill(sencond),
      };
      return this.timeLayout.replace(/hh|mm|ss/g, match => token[match]);
    },
    cancelRequestAnimationFrame() {
      cancelAnimationFrame(this.request);
    },
    animate() {
      const easeFn = Easing[this.ease];
      const timeStamp = new Date().getTime();
      const runTime = timeStamp - this.startTime;
      const progress = Math.min(runTime / this.duration, 1);
      const flag = this.value - this.startVal >= 0 ? 1 : -1;
      this.currentVal = this.startVal + easeFn(progress) * (this.value - this.startVal);
      this.displayVal = this.formatNumber(this.currentVal);
      if ((-1 * flag * (this.value - this.currentVal) >= 0)) {
        this.endLog = new Date().getTime();
        this.cancelRequestAnimationFrame(this.request);
        return;
      }
      this.request = requestAnimationFrame(this.animate);
    },
    start() {
      this.startLog = new Date().getTime();
      this.startTime = new Date().getTime();
      this.request = requestAnimationFrame(this.animate);
    },
  },
  mounted() {
    this.start();
  },
  destroyed() {
    this.currentVal = this.startVal;
    this.cancelRequestAnimationFrame();
  },
};

</script>

<style scoped>

</style>
