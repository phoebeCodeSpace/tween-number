# tween-number

> 数字缓动

## 属性

属性 | 描述 | 类型 | 默认值
---------|----------|---------|---------
value | 结束值 | Number| 0
startVal | 初始值 | Number| 0
duration | 动画间隔（单位毫秒） | Number | 1000
prefix | 前缀 | String | ''
suffix | 后缀 | String | ''
decimals | 保留小数点后几位数字 | Number | 0
ease | 缓动效果(可选值：'Linear', 'CubicIn','CubicIn','CubicInOut') | String | 'Linear'
format | 结果格式化（String格式可填写'money' 'time'） | String, Function | 无
timeLayout | 时间格式化模板（仅对format='time'有效） | String | 'hh:mm:ss'

## 使用

安装

```bash
npm install tween-number --save-dev
```

引用

```vue
<template>
    <tween-number v-model="number" :decimals="2"/>
    <tween-number suffix="%" v-model="progress" :startVal="progressStart" :duration="300"/>
</template>

<script>
  import tweenNumber from 'tween-number';
  export default {
    components: { tweenNumber },
    data () {
      return {
        number: 123455,
        progressStart: 0,
        progress: 100
      }
    }
  }
</script>
```

## 示例