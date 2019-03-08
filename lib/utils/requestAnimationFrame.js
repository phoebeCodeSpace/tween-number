

/* eslint-disable */
const vendors = ['webkit', 'moz', 'ms', 'o'];
let { requestAnimationFrame, cancelAnimationFrame } = window;

for (let i = 0; i < vendors.length; i++) {
  if (requestAnimationFrame && cancelAnimationFrame) { break; }
  const prefix = vendors[i];
  requestAnimationFrame = requestAnimationFrame || window[`${prefix}RequestAnimationFrame`];
  cancelAnimationFrame = cancelAnimationFrame || window[`${prefix}CancelAnimationFrame`] || window[`${prefix}CancelRequestAnimationFrame`];
}

if (!requestAnimationFrame || !cancelAnimationFrame) {
  requestAnimationFrame = (callback) => {
    const perFrame = Math.round(1000 / 60);
    const id = window.setTimeout(() => {
      callback();
    }, perFrame);
    return id;
  };

  cancelAnimationFrame = (id) => {
    window.clearTimeout(id);
  };
}


export {
  requestAnimationFrame,
  cancelAnimationFrame,
};
