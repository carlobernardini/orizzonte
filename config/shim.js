/**
 * https://reactjs.org/blog/2017/09/26/react-v16.0.html#javascript-environment-requirements
 */

global.requestAnimationFrame = (callback) => {
    setTimeout(callback, 0);
};
