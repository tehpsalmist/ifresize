// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"ZnSize.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Based on: https://github.com/davidjbradshaw/iframe-resizer
// Goal is to make a simple resize system

/**
 * Get the int value of a property for an element
 * @param prop
 * @param element
 * @returns {number}
 */
var getComputedStyle = function getComputedStyle(prop, element) {
  var value = 0;
  element = element || document.body;
  value = document.defaultView.getComputedStyle(element, null);
  value = value !== null ? value[prop] : 0;
  return parseInt(value, 10);
};
/**
 * Get the largest element based on the target page side & given elements
 * @param side
 * @param elements
 * @returns {number}
 */


var getMaxElement = function getMaxElement(side, elements) {
  var elementsLength = elements.length;
  var elVal = 0;
  var maxVal = 0;
  var Side = capitalizeFirstLetter(side);

  for (var i = 0; i < elementsLength; i++) {
    elVal = elements[i].getBoundingClientRect()[side] + getComputedStyle("margin".concat(Side), elements[i]);

    if (elVal > maxVal) {
      // console.log({ 'elVal': elVal, 'maxVal': maxVal })
      maxVal = elVal;
    }
  } // console.log({'getMaxElement.maxVal': maxVal})


  return maxVal;
};

var getSmallestOffsetLeft = function getSmallestOffsetLeft() {
  return Array.from(document.querySelectorAll('body *')).reduce(function (lowest, element) {
    return Math.min(element.offsetLeft, lowest);
  }, 0);
};

var heightCalc = {
  /**
     * Get the body.offsetHeight
     * @returns {number}
     */
  bodyOffset: function bodyOffset() {
    return document.body.offsetHeight + getComputedStyle('marginTop') + getComputedStyle('marginBottom');
  },

  /**
     * Get the body.scrollHeight
     * @returns {number}
     */
  bodyScroll: function bodyScroll() {
    return document.body.scrollHeight;
  },

  /**
     * Get the documentElement.offsetHeight
     * @returns {number}
     */
  documentElementOffset: function documentElementOffset() {
    return document.documentElement.offsetHeight;
  },

  /**
     * Get the documentElement.scrollHeight
     * @returns {number}
     */
  documentElementScroll: function documentElementScroll() {
    return document.documentElement.scrollHeight;
  },

  /**
     * Get the height of the element that's closest to the bottom of the page
     * @returns {number}
     */
  furthestElement: function furthestElement() {
    return getMaxElement('bottom', getAllElements());
  },

  /**
     * Get the min value of all the base measurements
     * @returns {number}
     */
  min: function min() {
    return Math.min.apply(null, getAllMeasurements(heightCalc));
  },

  /**
     * Get the max value of all the base measurements
     * @returns {number}
     */
  max: function max() {
    return Math.max.apply(null, getAllMeasurements(heightCalc));
  }
};
var widthCalc = {
  /**
     * Get the body.offsetWidth
     * @returns {number}
     */
  bodyOffset: function bodyOffset() {
    return document.body.offsetWidth;
  },

  /**
     * Get the body.scrollWidth
     * @returns {number}
     */
  bodyScroll: function bodyScroll() {
    return document.body.scrollWidth;
  },

  /**
     * Get the documentElement.offsetWidth
     * @returns {number}
     */
  documentElementOffset: function documentElementOffset() {
    return document.documentElement.offsetWidth;
  },

  /**
     * Get the documentElement.scrollWidth
     * @returns {number}
     */
  documentElementScroll: function documentElementScroll() {
    return document.documentElement.scrollWidth;
  },

  /**
     * Get the width of the element that's furthest to the right of the page
     * @returns {number}
     */
  furthestElement: function furthestElement() {
    return getMaxElement('right', getAllElements());
  },
  eastToWest: function eastToWest() {
    if (document.body.scrollWidth > document.body.clientWidth) {
      return getSmallestOffsetLeft() + document.body.scrollWidth;
    }

    return getSmallestOffsetLeft() + widthCalc.furthestElement();
  },

  /**
     * Get the min value of all the base measurements
     * @returns {number}
     */
  min: function min() {
    return Math.min.apply(null, getAllMeasurements(widthCalc));
  },

  /**
     * Get the max value of all the base measurements
     * @returns {number}
     */
  max: function max() {
    return Math.max.apply(null, getAllMeasurements(widthCalc));
  },

  /**
     * Gets the max of body.scrollWidth & documentElement.scrollWidth
     * @returns {number}
     */
  scroll: function scroll() {
    return Math.max(widthCalc.bodyScroll(), widthCalc.documentElementScroll());
  }
  /**
   * Gets all the basic measurements from the dimension calculation object
   * @param dimCalc
   * @returns {(*|number)[]}
   */

};

var getAllMeasurements = function getAllMeasurements(dimCalc) {
  return [dimCalc.bodyOffset(), dimCalc.bodyScroll(), dimCalc.documentElementOffset(), dimCalc.documentElementScroll()];
};
/**
 * Gets all the elements on the page
 * @returns {NodeListOf<Element>}
 */


var getAllElements = function getAllElements() {
  return document.querySelectorAll('body *');
};
/**
 * Capitalizes the first letter of a string
 * @param string
 * @returns {string}
 */


var capitalizeFirstLetter = function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

var ZnSize =
/*#__PURE__*/
function () {
  /**
   * UpdateRequester Function
   *
   * @callback UpdateRequester
   * @param {{ width: string, height: string }} dimensions
   *
   * @returns {Promise<{ width: string, height: string }>}
   */

  /**
   * ZnSize
   * Auto-detects sizing needs, and executes resizing on command
   * 
   * @param {UpdateRequester} updateRequester
   * @param {Object} methods
   * @param {'bodyOffset' | 'bodyScroll' | 'documentElementOffset' | 'documentElementScroll' | 'furthestElement' | 'min' | 'max'} methods.height
   * @param {'bodyOffset' | 'bodyScroll' | 'documentElementOffset' | 'documentElementScroll' | 'furthestElement' | 'min' | 'max' | 'scroll'} methods.width
   */
  function ZnSize(updateRequester) {
    var methods = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, ZnSize);

    this.updateRequester = updateRequester;
    this.timer = null;
    this.heightMethod = typeof methods.height === 'string' ? methods.height : 'bodyOffset';
    this.widthMethod = typeof methods.width === 'string' ? methods.width : 'scroll';
    this.observer = null;
    this.auto = false;
    this.currentWidth = 0;
    this.currentHeight = 0;
    this.events = ['animationstart', 'webkitAnimationStart', 'animationiteration', 'webkitAnimationIteration', 'animationend', 'webkitAnimationEnd', 'orientationchange', 'transitionstart', 'webkitTransitionStart', 'MSTransitionStart', 'oTransitionStart', 'otransitionstart', 'transitioniteration', 'webkitTransitionIteration', 'MSTransitionIteration', 'oTransitionIteration', 'otransitioniteration', 'transitionend', 'webkitTransitionEnd', 'MSTransitionEnd', 'oTransitionEnd', 'otransitionend'];
  }
  /**
     * Sets the page size automatically or uses the supplied dimensions
     * @param dimensions
     */


  _createClass(ZnSize, [{
    key: "sendDimensions",
    value: function sendDimensions(dimensions) {
      var height = this.currentHeight;
      var width = this.currentWidth;
      this.currentHeight = this.getHeight();
      this.currentWidth = this.getWidth(); // console.log({
      //   'originalHeight': height,
      //   'newHeight': this.currentHeight,
      //   'heightTolerance': Math.abs(height - this.currentHeight),
      //   'sizeChanged': this.sizeChanged(height, this.currentHeight)
      // })
      //
      // console.log({
      //   'originalWidth': width,
      //   'newWidth': this.currentWidth,
      //   'widthTolerance': Math.abs(width - this.currentWidth),
      //   'sizeChanged': this.sizeChanged(width, this.currentWidth)
      // })
      //Implement tolerance

      if (typeof dimensions === 'undefined') {
        dimensions = {};
      }

      if (!dimensions.height) {
        dimensions.height = "".concat(this.currentHeight, "px");
      }

      if (!dimensions.width) {
        dimensions.width = "".concat(this.currentWidth, "px");
      }

      this.updateRequester(dimensions);
    }
    /**
       * Toggle the autosize feature, if timeout is a int value it will default to using setInterval instead of MutationObserver
       * @param timeout
       * @returns {null}
       */

  }, {
    key: "autoSize",
    value: function autoSize(timeout) {
      var _this = this;

      // timeout = typeof timeout === "undefined" ? 100 : timeout // Currently override MutationObserver due to some bugs
      if (this.auto) {
        this.auto = false;

        if (this.observer === null) {
          if (this.timer === null) {
            return null;
          } else {
            clearInterval(this.timer);
            this.timer = null;
          }
        } else {
          this.observer.disconnect();
          this.observer = false;
        }

        this.removeEventHandlers();
        return null;
      }

      this.sendDimensions();
      typeof timeout === 'number' ? this.timer = setInterval(function () {
        _this.sendDimensions();
      }, timeout) : this.observer = this.setupMutation();
      this.addEventHandlers();
      this.auto = true;
    }
  }, {
    key: "addEventHandlers",
    value: function addEventHandlers() {
      var _this2 = this;

      this.events.forEach(function (value) {
        window.addEventListener(value, _this2.handleEvent.bind(_this2));
      });
    }
  }, {
    key: "removeEventHandlers",
    value: function removeEventHandlers() {
      var _this3 = this;

      this.events.forEach(function (value) {
        window.removeEventListener(value, _this3.handleEvent.bind(_this3));
      });
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(e) {
      this.sendDimensions();
    }
    /**
       * Get the page width
       * @param method
       * @returns {number}
       */

  }, {
    key: "getWidth",
    value: function getWidth(method) {
      method = typeof method === 'undefined' ? this.widthMethod : method; // console.log({'widthMethod': method})

      return widthCalc[method]();
    }
    /**
       * Get the page height
       * @param method
       * @returns {number}
       */

  }, {
    key: "getHeight",
    value: function getHeight(method) {
      method = typeof method === 'undefined' ? this.heightMethod : method; // console.log({'heightMethod': method})

      return heightCalc[method]();
    }
    /**
       * Is auto resize enabled
       * @returns {boolean}
       */

  }, {
    key: "isAutoEnabled",
    value: function isAutoEnabled() {
      return this.auto;
    }
    /**
       * Sets up MutationObserver
       * @returns {MutationObserver}
       */

  }, {
    key: "setupMutation",
    value: function setupMutation() {
      var _this4 = this;

      var MutationClass = window.MutationObserver || window.WebKitMutationObserver;
      var observer = new MutationClass(function (mutations, observer) {
        setTimeout(function () {
          _this4.sendDimensions();
        }, 16);
      });
      observer.observe(document.querySelector('body'), {
        attributes: true,
        attributeOldValue: false,
        characterData: true,
        characterDataOldValue: false,
        childList: true,
        subtree: true
      });
      return observer;
    }
    /**
       * Check if a size has changed
       * @param originalValue
       * @param newValue
       * @param tolerance
       * @returns {boolean}
       */

  }, {
    key: "sizeChanged",
    value: function sizeChanged(originalValue, newValue, tolerance) {
      tolerance = typeof tolerance === 'number' ? tolerance : 0;
      return !Math.abs(originalValue - newValue) <= tolerance;
    }
  }]);

  return ZnSize;
}();

exports.default = ZnSize;
},{}]},{},["ZnSize.js"], null)
//# sourceMappingURL=/ZnSize.js.map