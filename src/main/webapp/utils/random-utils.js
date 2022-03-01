"use strict";

class RandomUtils {
    static INSTANCE = new RandomUtils();
    static getInstance() {
        return this.INSTANCE;
    }
    color_hex(r = { s: 0, e: 255 }, g = { s: 0, e: 255 }, b = { s: 0, e: 255 }) {
        let _r = Math.floor(r.s + Math.random() * (r.e - r.s));
        let _g = Math.floor(g.s + Math.random() * (g.e - g.s));
        let _b = Math.floor(b.s + Math.random() * (b.e - b.s));
        _r = _r > 15 ? _r.toString(16) : "0" + _r.toString(16);
        _g = _g > 15 ? _g.toString(16) : "0" + _g.toString(16);
        _b = _b > 15 ? _b.toString(16) : "0" + _b.toString(16);
        return `#${_r + _g + _b}`; //hexa
    }
    color_rgb(r = { start: 0, end: 255 }, g = { start: 0, end: 255 }, b = { start: 0, end: 255 }) {
        let _r = Math.floor(r.start + Math.random() * (r.end - r.start));
        let _g = Math.floor(g.start + Math.random() * (g.end - g.start));
        let _b = Math.floor(b.start + Math.random() * (b.end - b.start));
        return `rgb(${_r},${_g},${_b}`;
    }
}

export const randomUtils = new RandomUtils();
