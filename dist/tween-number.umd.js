(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.CountUp = {}));
}(this, function (exports) { 'use strict';

  // http://tweenjs.github.io/tween.js/examples/03_graphs.html
  // https://github.com/tweenjs/tween.js/blob/master/src/Tween.js#L456
  var Tween = {
    Linear: function Linear(k) {
      return k;
    },
    CubicIn: function CubicIn(k) {
      return k * k * k;
    },
    CubicOut: function CubicOut(k) {
      return --k * k * k + 1;
    },
    CubicInOut: function CubicInOut(k) {
      if ((k *= 2) < 1) {
        return 0.5 * k * k * k;
      }
      return 0.5 * ((k -= 2) * k * k + 2);
    },
  };

  /* eslint-disable */
  var vendors = ['webkit', 'moz', 'ms', 'o'];
  var requestAnimationFrame = window.requestAnimationFrame;
  var cancelAnimationFrame = window.cancelAnimationFrame;

  for (var i = 0; i < vendors.length; i++) {
    if (requestAnimationFrame && cancelAnimationFrame) { break; }
    var prefix = vendors[i];
    requestAnimationFrame = requestAnimationFrame || window[(prefix + "RequestAnimationFrame")];
    cancelAnimationFrame = cancelAnimationFrame || window[(prefix + "CancelAnimationFrame")] || window[(prefix + "CancelRequestAnimationFrame")];
  }

  if (!requestAnimationFrame || !cancelAnimationFrame) {
    requestAnimationFrame = function (callback) {
      var perFrame = Math.round(1000 / 60);
      var id = window.setTimeout(function () {
        callback();
      }, perFrame);
      return id;
    };

    cancelAnimationFrame = function (id) {
      window.clearTimeout(id);
    };
  }

  //

  var script = {
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
    data: function data() {
      return {
        startTime: null,
        currentVal: 0,
        displayVal: 0,
        startLog: 0,
        endLog: 0,
      };
    },
    watch: {
      value: function value() {
        this.cancelRequestAnimationFrame();
        this.start();
      },
    },
    methods: {
      zeroFill: function zeroFill(value) {
        return +value < 10 ? (("0" + value)) : value;
      },
      formatNumber: function formatNumber(number) {
        var formatMap = {
          money: this.toMoney,
          time: this.toTime,
        };
        if (this.format) {
          if (formatMap[this.format]) {
            return ("" + (this.prefix) + (formatMap[this.format](number.toFixed(this.decimals))) + (this.suffix));
          }
          return ("" + (this.prefix) + (this.format(number.toFixed(this.decimals))) + (this.suffix));
        }
        return ("" + (this.prefix) + (number.toFixed(this.decimals)) + (this.suffix));
      },
      toMoney: function toMoney(number) {
        var negative = parseFloat(number) < 0 ? '-' : '';
        var numberArray = number.toString().split('.');
        var base = Math.abs(parseInt(numberArray[0], 10)).toString();
        var mod = base.length > 3 ? base.length % 3 : 0;
        var decimal = numberArray[1].padEnd(this.decimals, '0');
        var baseStr = "" + (mod ? ((base.substr(0, mod)) + ",") : '') + (base.substr(mod).replace(/(\d{3})(?=\d)/g, '$1,'));
        var decimalStr = this.decimals ? ("." + (decimal.substring(0, this.decimals))) : '';
        return ("" + negative + baseStr + decimalStr);
      },
      toTime: function toTime(number) {
        var value = Math.ceil(number);
        var hour = Math.floor(value / 3600);
        var minute = Math.floor((value % 3600) / 60);
        var sencond = value % 60;
        var token = {
          hh: this.zeroFill(hour),
          mm: this.zeroFill(minute),
          ss: this.zeroFill(sencond),
        };
        return this.timeLayout.replace(/hh|mm|ss/g, function (match) { return token[match]; });
      },
      cancelRequestAnimationFrame: function cancelRequestAnimationFrame() {
        cancelAnimationFrame(this.request);
      },
      animate: function animate() {
        var easeFn = Tween[this.ease];
        var timeStamp = new Date().getTime();
        var runTime = timeStamp - this.startTime;
        var progress = Math.min(runTime / this.duration, 1);
        var flag = this.value - this.startVal >= 0 ? 1 : -1;
        this.currentVal = this.startVal + easeFn(progress) * (this.value - this.startVal);
        this.displayVal = this.formatNumber(this.currentVal);
        if ((-1 * flag * (this.value - this.currentVal) >= 0)) {
          this.endLog = new Date().getTime();
          this.cancelRequestAnimationFrame(this.request);
          return;
        }
        this.request = requestAnimationFrame(this.animate);
      },
      start: function start() {
        this.startLog = new Date().getTime();
        this.startTime = new Date().getTime();
        this.request = requestAnimationFrame(this.animate);
      },
    },
    mounted: function mounted() {
      this.start();
    },
    destroyed: function destroyed() {
      this.currentVal = this.startVal;
      this.cancelRequestAnimationFrame();
    },
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    var options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    var hook;

    if (moduleIdentifier) {
      // server build
      hook = function hook(context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function () {
        style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        var originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  var normalizeComponent_1 = normalizeComponent;

  /* script */
  var __vue_script__ = script;

  /* template */
  var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',[_vm._v(_vm._s(_vm.displayVal))])};
  var __vue_staticRenderFns__ = [];

    /* style */
    var __vue_inject_styles__ = undefined;
    /* scoped */
    var __vue_scope_id__ = "data-v-7dc622f2";
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var countUp = normalizeComponent_1(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      undefined,
      undefined
    );

  // Import vue component

  // Declare install function executed by Vue.use()
  function install(Vue) {
    if (install.installed) { return; }
    install.installed = true;
    Vue.component('tweenNumber', countUp);
  }

  // Create module definition for Vue.use()
  var plugin = {
    install: install,
  };

  // Auto-install when vue is found (eg. in browser via <script> tag)
  var GlobalVue = null;
  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }
  if (GlobalVue) {
    GlobalVue.use(plugin);
  }

  exports.install = install;
  exports.default = countUp;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
