// http://tweenjs.github.io/tween.js/examples/03_graphs.html
// https://github.com/tweenjs/tween.js/blob/master/src/Tween.js#L456
const Tween = {
  Linear(k) {
    return k;
  },
  CubicIn(k) {
    return k * k * k;
  },
  CubicOut(k) {
    return --k * k * k + 1;
  },
  CubicInOut(k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k * k;
    }
    return 0.5 * ((k -= 2) * k * k + 2);
  },
};
export default Tween;
