/*!
*   Objency
*   author: Kurachi
*   license: CC0 1.0 Universal
*   licenseUrl: https://creativecommons.org/publicdomain/zero/1.0/deed.en
*/

(function (root) {
  'use strict';

  var Objency = function (originObj) {
    if (!originObj || Object.prototype.toString.call(originObj) !== '[object Object]') {
      // プレーンオブジェクトのみを受け付ける
      throw new TypeError('プレーンオブジェクトでなければなりません。');
    } else if (originObj.constructor && originObj.hasOwnProperty('constructor')) {
      // prototypeは受け付けない
      throw new Error('prototypeオブジェクトのようです。お引き取りください。');
    } else if (originObj instanceof Objency) {
      // Objencyインスタンスはそのまま返す
      return originObj;
    }
    return new Objency.prototype._constructor(originObj);
  };

  Objency.prototype = {
    _constructor: function (obj) {
      // ラッパーオブジェクトに格納する
      var keys = [];
      for (var key in obj) keys.push(key);
      this.$obj = obj;
      this._keys = keys;
      this._allKeys = keys.slice();
    },
    forEach: function (callFn, thisArg) {
      // 配列のforEachに似ているが、引き続きメソッドチェーンができる
      var keys = this._keys;
      var obj = this.$obj;
      if (typeof thisArg === 'undefined') thisArg = undefined;
      for (var i = 0; i < keys.length; i++) {
        callFn.call(thisArg, obj[keys[i]], i, obj);
      }
      return this;
    },
    map: function (callFn, thisArg) {
      // 配列のmapに似ているが、元のオブジェクトを変更する
      var keys = this._keys;
      var key;
      var obj = this.$obj;
      if (typeof thisArg === 'undefined') thisArg = undefined;
      for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        obj[key] = callFn.call(thisArg, obj[key], i, obj);
      }
      return this;
    },
    filter: function (callFn, thisArg) {
      // 配列のfilterに似ているが、元のオブジェクトを変更する
      var keys = this._keys;
      var obj = this.$obj;
      if (typeof thisArg === 'undefined') thisArg = undefined;
      for (var i = 0; i < keys.length; i++) {
        if (!callFn.call(thisArg, obj[keys[i]], i, obj)) {
          keys.splice(i, 1);
        }
      }
      return this;
    },
    every: function (callFn, thisArg) {
      var keys = this._keys;
      var obj = this.$obj;
      if (typeof thisArg === 'undefined') thisArg = undefined;
      for (var i = 0; i < keys.length; i++) {
        if (!callFn.call(thisArg, obj[keys[i]], i, obj)) {
          return false;
        }
      }
      return true;
    },
    some: function (callFn, thisArg) {
      var keys = this._keys;
      var obj = this.$obj;
      if (typeof thisArg === 'undefined') thisArg = undefined;
      for (var i = 0; i < keys.length; i++) {
        if (callFn.call(thisArg, obj[keys[i]], i, obj)) {
          return true;
        }
      }
      return false;
    },
    fill: function (newVal) {
      var keys = this._keys;
      var obj = this.$obj;
      if (typeof newVal === 'undefined') newVal = undefined;
      for (var i = 0; i < keys.length; i++) {
        obj[keys[i]] = newVal;
      }
      return this;
    },
    reduce: function (callFn, initVal) {
      var keys = this._keys;
      var obj = this.$obj;
      var currentVal;
      var i = 0;
      if (typeof initVal === 'undefined') {
        initVal = undefined;
        currentVal = obj[keys[0]];
        i = 1;
      } else {
        currentVal = initVal;
      }
      for (; i < keys.length; i++) {
        currentVal = callFn(currentVal, obj[keys[i]], i, obj);
      }
      return currentVal;
    },
    setAllKey: function () {
      this._keys = this._allKeys.slice();
      return this;
    }
  };

  Objency.prototype._constructor.prototype = Objency.prototype;
  root.objency = Objency;
})(window);

// サンプルコード
let objWrap = objency({ foo: 'bar', baz: { qux: 'quux' }, 71: ['corge'] });
outputElem.appendChild(
  document.createTextNode(
    objWrap
      .filter(function (val) {
        return typeof val === 'string';
      })
      .forEach(console.log)
      .setAllKey()
      .forEach(console.log)
  )
);
