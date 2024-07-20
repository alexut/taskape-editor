(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // ../../node_modules/eventemitter3/index.js
  var require_eventemitter3 = __commonJS({
    "../../node_modules/eventemitter3/index.js"(exports, module) {
      "use strict";
      var has = Object.prototype.hasOwnProperty;
      var prefix = "~";
      function Events2() {
      }
      if (Object.create) {
        Events2.prototype = /* @__PURE__ */ Object.create(null);
        if (!new Events2().__proto__) prefix = false;
      }
      function EE(fn, context, once) {
        this.fn = fn;
        this.context = context;
        this.once = once || false;
      }
      function addListener(emitter, event, fn, context, once) {
        if (typeof fn !== "function") {
          throw new TypeError("The listener must be a function");
        }
        var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
        if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
        else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
        else emitter._events[evt] = [emitter._events[evt], listener];
        return emitter;
      }
      function clearEvent(emitter, evt) {
        if (--emitter._eventsCount === 0) emitter._events = new Events2();
        else delete emitter._events[evt];
      }
      function EventEmitter() {
        this._events = new Events2();
        this._eventsCount = 0;
      }
      EventEmitter.prototype.eventNames = function eventNames() {
        var names = [], events, name;
        if (this._eventsCount === 0) return names;
        for (name in events = this._events) {
          if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
        }
        if (Object.getOwnPropertySymbols) {
          return names.concat(Object.getOwnPropertySymbols(events));
        }
        return names;
      };
      EventEmitter.prototype.listeners = function listeners(event) {
        var evt = prefix ? prefix + event : event, handlers = this._events[evt];
        if (!handlers) return [];
        if (handlers.fn) return [handlers.fn];
        for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
          ee[i] = handlers[i].fn;
        }
        return ee;
      };
      EventEmitter.prototype.listenerCount = function listenerCount(event) {
        var evt = prefix ? prefix + event : event, listeners = this._events[evt];
        if (!listeners) return 0;
        if (listeners.fn) return 1;
        return listeners.length;
      };
      EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
        var evt = prefix ? prefix + event : event;
        if (!this._events[evt]) return false;
        var listeners = this._events[evt], len = arguments.length, args, i;
        if (listeners.fn) {
          if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
          switch (len) {
            case 1:
              return listeners.fn.call(listeners.context), true;
            case 2:
              return listeners.fn.call(listeners.context, a1), true;
            case 3:
              return listeners.fn.call(listeners.context, a1, a2), true;
            case 4:
              return listeners.fn.call(listeners.context, a1, a2, a3), true;
            case 5:
              return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
            case 6:
              return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
          }
          for (i = 1, args = new Array(len - 1); i < len; i++) {
            args[i - 1] = arguments[i];
          }
          listeners.fn.apply(listeners.context, args);
        } else {
          var length = listeners.length, j;
          for (i = 0; i < length; i++) {
            if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
            switch (len) {
              case 1:
                listeners[i].fn.call(listeners[i].context);
                break;
              case 2:
                listeners[i].fn.call(listeners[i].context, a1);
                break;
              case 3:
                listeners[i].fn.call(listeners[i].context, a1, a2);
                break;
              case 4:
                listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                break;
              default:
                if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                  args[j - 1] = arguments[j];
                }
                listeners[i].fn.apply(listeners[i].context, args);
            }
          }
        }
        return true;
      };
      EventEmitter.prototype.on = function on(event, fn, context) {
        return addListener(this, event, fn, context, false);
      };
      EventEmitter.prototype.once = function once(event, fn, context) {
        return addListener(this, event, fn, context, true);
      };
      EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
        var evt = prefix ? prefix + event : event;
        if (!this._events[evt]) return this;
        if (!fn) {
          clearEvent(this, evt);
          return this;
        }
        var listeners = this._events[evt];
        if (listeners.fn) {
          if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
            clearEvent(this, evt);
          }
        } else {
          for (var i = 0, events = [], length = listeners.length; i < length; i++) {
            if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
              events.push(listeners[i]);
            }
          }
          if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
          else clearEvent(this, evt);
        }
        return this;
      };
      EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
        var evt;
        if (event) {
          evt = prefix ? prefix + event : event;
          if (this._events[evt]) clearEvent(this, evt);
        } else {
          this._events = new Events2();
          this._eventsCount = 0;
        }
        return this;
      };
      EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
      EventEmitter.prototype.addListener = EventEmitter.prototype.on;
      EventEmitter.prefixed = prefix;
      EventEmitter.EventEmitter = EventEmitter;
      if ("undefined" !== typeof module) {
        module.exports = EventEmitter;
      }
    }
  });

  // src/tree.js
  var import_eventemitter3 = __toESM(require_eventemitter3());

  // src/utils.js
  function el(element) {
    if (typeof element === "string") {
      return document.querySelector(element);
    }
    return element;
  }
  function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }
  function distancePointElement(px, py, element) {
    const pos = toGlobal(element);
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const x = pos.x + width / 2;
    const y = pos.y + height / 2;
    const dx = Math.max(Math.abs(px - x) - width / 2, 0);
    const dy = Math.max(Math.abs(py - y) - height / 2, 0);
    return dx * dx + dy * dy;
  }
  function inside(x, y, element) {
    const pos = toGlobal(element);
    const x1 = pos.x;
    const y1 = pos.y;
    const w1 = element.offsetWidth;
    const h1 = element.offsetHeight;
    return x >= x1 && x <= x1 + w1 && y >= y1 && y <= y1 + h1;
  }
  function toGlobal(e) {
    const box = e.getBoundingClientRect();
    const body = document.body;
    const docEl = document.documentElement;
    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    const clientTop = docEl.clientTop || body.clientTop || 0;
    const clientLeft = docEl.clientLeft || body.clientLeft || 0;
    const top = box.top + scrollTop - clientTop;
    const left = box.left + scrollLeft - clientLeft;
    return { y: Math.round(top), x: Math.round(left) };
  }
  function options(options2, defaults2) {
    options2 = options2 || {};
    for (let option in defaults2) {
      options2[option] = typeof options2[option] !== "undefined" ? options2[option] : defaults2[option];
    }
    return options2;
  }
  function removeChildren(element) {
    while (element.firstChild) {
      element.firstChild.remove();
    }
  }
  function html(options2) {
    options2 = options2 || {};
    const object = document.createElement(options2.type || "div");
    if (options2.parent) {
      options2.parent.appendChild(object);
    }
    if (options2.className) {
      options2.className.split(" ").forEach((cls) => object.classList.add(cls));
    }
    if (options2.html) {
      object.innerHTML = options2.html;
    }
    if (options2.id) {
      object.id = options2.id;
    }
    if (options2.attributes) {
      for (const key in options2.attributes) {
        object.setAttribute(key, options2.attributes[key]);
      }
    }
    return object;
  }
  function getChildIndex(parent, child) {
    let index = 0;
    for (let entry of parent.children) {
      if (entry === child) {
        return index;
      }
      index++;
    }
    return -1;
  }

  // src/indicator.js
  var Indicator = class {
    constructor(tree) {
      this._indicator = html();
      this._indicator.style.marginLeft = tree.indentation + "px";
      const content = html({ parent: this._indicator });
      content.style.display = "flex";
      this._indicator.indentation = html({ parent: content });
      this._indicator.icon = html({ parent: content, className: `${tree.prefixClassName}-expand` });
      this._indicator.icon.style.height = 0;
      this._indicator.line = html({ parent: content, className: `${tree.prefixClassName}-indicator` });
    }
    get() {
      return this._indicator;
    }
    set marginLeft(value) {
      this._indicator.style.marginLeft = value + "px";
    }
  };

  // src/input.js
  var Input = class {
    constructor(tree) {
      this._tree = tree;
      this._indicator = new Indicator(tree);
      document.body.addEventListener("mousemove", (e) => this._move(e));
      document.body.addEventListener("touchmove", (e) => this._move(e));
      document.body.addEventListener("mouseup", (e) => this._up(e));
      document.body.addEventListener("touchend", (e) => this._up(e));
      document.body.addEventListener("mouseleave", (e) => this._up(e));
    }
    _down(e) {
      if (e.target.classList.contains(`${this._tree.prefixClassName}-leaf-handler`)) {
        this._target = e.currentTarget.parentNode.parentNode;
        let alreadySelected = false;
        if (this._tree._selection === this._target) {
          alreadySelected = true;
        } else {
          if (this._tree._selection) {
            this._tree._selection.querySelector(`.${this._tree.prefixClassName}-name`).classList.remove(`${this._tree.prefixClassName}-select`);
          }
          this._tree._selection = this._target;
          this._tree._selection.querySelector(`.${this._tree.prefixClassName}-name`).classList.add(`${this._tree.prefixClassName}-select`);
        }
        this._isDown = { x: e.pageX, y: e.pageY, alreadySelected };
        const pos = toGlobal(this._target);
        this._offset = { x: e.pageX - pos.x, y: e.pageY - pos.y };
        if (this._tree.holdTime) {
          this._holdTimeout = window.setTimeout(() => this._hold(), this._tree.holdTime);
        }
        e.preventDefault();
        e.stopPropagation();
      } else {
        this._target = e.currentTarget.parentNode.parentNode;
        if (this._tree._selection !== this._target) {
          if (this._tree._selection) {
            this._tree._selection.querySelector(`.${this._tree.prefixClassName}-name`).classList.remove(`${this._tree.prefixClassName}-select`);
          }
          this._tree._selection = this._target;
          this._tree._selection.querySelector(`.${this._tree.prefixClassName}-name`).classList.add(`${this._tree.prefixClassName}-select`);
          this._tree.emit("selection-change", this._target, this._tree);
        }
      }
    }
    _hold() {
      this._holdTimeout = null;
      this._tree.edit(this._target);
    }
    _checkThreshold(e) {
      if (!this._isDown) {
        return false;
      }
      if (!this._tree.move) {
        return false;
      } else if (this._moving) {
        return true;
      } else {
        if (distance(this._isDown.x, this._isDown.y, e.pageX, e.pageY)) {
          this._moving = true;
          this._pickup();
          return true;
        } else {
          return false;
        }
      }
    }
    _pickup() {
      if (this._holdTimeout) {
        window.clearTimeout(this._holdTimeout);
        this._holdTimeout = null;
      }
      this._tree.emit("move-pending", this._target, this._tree);
      const parent = this._target.parentNode;
      parent.insertBefore(this._indicator.get(), this._target);
      const pos = toGlobal(this._target);
      document.body.appendChild(this._target);
      this._old = {
        opacity: this._target.style.opacity || "unset",
        position: this._target.style.position || "unset",
        boxShadow: this._target.querySelector(`.${this._tree.prefixClassName}-name`).style.boxShadow || "unset"
      };
      this._target.style.position = "absolute";
      this._target.querySelector(`.${this._tree.prefixClassName}-name`).style.boxShadow = "3px 3px 5px rgba(0,0,0,0.25)";
      this._target.style.left = pos.x + "px";
      this._target.style.top = pos.y + "px";
      this._target.style.opacity = this._tree.dragOpacity;
      if (this._tree._getChildren(parent, true).length === 0) {
        parent.hideIcon();
      }
    }
    _findClosest(e, entry) {
      const pos = toGlobal(entry.querySelector(`.${this._tree.prefixClassName}-name`));
      if (pos.y + entry.querySelector(`.${this._tree.prefixClassName}-name`).offsetHeight / 2 <= e.pageY) {
        if (!this._closest.foundAbove) {
          if (inside(e.pageX, e.pageY, entry.querySelector(`.${this._tree.prefixClassName}-name`))) {
            this._closest.foundAbove = true;
            this._closest.above = entry;
          } else {
            const distance2 = distancePointElement(e.pageX, e.pageY, entry.querySelector(`.${this._tree.prefixClassName}-name`));
            if (distance2 < this._closest.distanceAbove) {
              this._closest.distanceAbove = distance2;
              this._closest.above = entry;
            }
          }
        }
      } else if (!this._closest.foundBelow) {
        if (inside(e.pageX, e.pageY, entry.querySelector(`.${this._tree.prefixClassName}-name`))) {
          this._closest.foundBelow = true;
          this._closest.below = entry;
        } else {
          const distance2 = distancePointElement(e.pageX, e.pageY, entry.querySelector(`.${this._tree.prefixClassName}-name`));
          if (distance2 < this._closest.distanceBelow) {
            this._closest.distanceBelow = distance2;
            this._closest.below = entry;
          }
        }
      }
      for (let child of this._tree._getChildren(entry)) {
        this._findClosest(e, child);
      }
    }
    _move(e) {
      if (this._target && this._checkThreshold(e)) {
        const element = this._tree.element;
        const indicator = this._indicator.get();
        const indentation = this._tree.indentation;
        indicator.remove();
        this._target.style.left = e.pageX - this._offset.x + "px";
        this._target.style.top = e.pageY - this._offset.y + "px";
        const x = toGlobal(this._target.querySelector(`.${this._tree.prefixClassName}-name`)).x;
        this._closest = { distanceAbove: Infinity, distanceBelow: Infinity };
        for (let child of this._tree._getChildren()) {
          this._findClosest(e, child);
        }
        if (!this._closest.above && !this._closest.below) {
          element.appendChild(indicator);
        } else if (!this._closest.above) {
          element.insertBefore(indicator, this._tree._getFirstChild(element));
        } else if (!this._closest.below) {
          let pos = toGlobal(this._closest.above.querySelector(`.${this._tree.prefixClassName}-name`));
          if (x > pos.x + indentation) {
            this._closest.above.insertBefore(indicator, this._tree._getFirstChild(this._closest.above, true));
          } else if (x > pos.x - indentation) {
            this._closest.above.parentNode.appendChild(indicator);
          } else {
            let parent = this._closest.above;
            while (parent !== element && x < pos.x) {
              parent = this._tree._getParent(parent);
              if (parent !== element) {
                pos = toGlobal(parent.querySelector(`.${this._tree.prefixClassName}-name`));
              }
            }
            parent.appendChild(indicator);
          }
        } else if (this._closest.below.parentNode === this._closest.above) {
          this._closest.above.insertBefore(indicator, this._closest.below);
        } else if (this._closest.below.parentNode === this._closest.above.parentNode) {
          const pos = toGlobal(this._closest.above.querySelector(`.${this._tree.prefixClassName}-name`));
          if (x > pos.x + indentation) {
            this._closest.above.insertBefore(indicator, this._tree._getLastChild(this._closest.above, true));
          } else {
            this._closest.above.parentNode.insertBefore(indicator, this._closest.below);
          }
        } else {
          let pos = toGlobal(this._closest.above.querySelector(`.${this._tree.prefixClassName}-name`));
          if (x > pos.x + indentation) {
            this._closest.above.insertBefore(indicator, this._tree._getLastChild(this._closest.above, true));
          } else if (x > pos.x - indentation) {
            this._closest.above.parentNode.appendChild(indicator);
          } else if (x < toGlobal(this._closest.below.querySelector(`.${this._tree.prefixClassName}-name`)).x) {
            this._closest.below.parentNode.insertBefore(indicator, this._closest.below);
          } else {
            let parent = this._closest.above;
            while (parent.parentNode !== this._closest.below.parentNode && x < pos.x) {
              parent = this._tree._getParent(parent);
              pos = toGlobal(parent.querySelector(`.${this._tree.prefixClassName}-name`));
            }
            parent.appendChild(indicator);
          }
        }
      }
    }
    _up(e) {
      if (this._target) {
        if (!this._moving) {
          if (this._tree.expandOnClick && (!this._tree.select || this._isDown.alreadySelected)) {
            this._tree.toggleExpand(this._target);
          }
          this._tree.emit("clicked", this._target, e, this._tree);
        } else {
          const indicator = this._indicator.get();
          indicator.parentNode.insertBefore(this._target, indicator);
          this._tree.expand(indicator.parentNode);
          const leafInstance = indicator.parentNode.__leafInstance;
          if (leafInstance) {
            leafInstance.showIcon();
          }
          this._target.style.position = this._old.position === "unset" ? "" : this._old.position;
          this._target.querySelector(`.${this._tree.prefixClassName}-name`).style.boxShadow = this._old.boxShadow === "unset" ? "" : this._old.boxShadow;
          this._target.style.opacity = this._old.opacity === "unset" ? "" : this._old.opacity;
          indicator.remove();
          this._moveData();
          this._tree.emit("move", this._target, this._tree);
          this._tree.emit("update", this._target, this._tree);
        }
        if (this._holdTimeout) {
          window.clearTimeout(this._holdTimeout);
          this._holdTimeout = null;
        }
        this._target = this._moving = null;
        this._isDown = null;
      }
    }
    _moveData() {
      this._target.data.parent.task.splice(this._target.data.parent.task.indexOf(this._target.data), 1);
      this._target.parentNode.data.task.splice(getChildIndex(this._target.parentNode, this._target), 0, this._target.data);
      this._target.data.parent = this._target.parentNode.data;
    }
    _indicatorMarginLeft(value) {
      this._indicator.marginLeft = value;
    }
  };

  // src/defaults.js
  var defaults = {
    move: true,
    select: true,
    indentation: 20,
    threshold: 10,
    holdTime: 1e3,
    expandOnClick: false,
    dragOpacity: 0.75,
    prefixClassName: "mb-task",
    cursorName: "grab -webkit-grab pointer",
    cursorExpand: "pointer",
    edit: true,
    symbols: {
      oracles: "#",
      tags: "@",
      actions: ">"
    }
  };

  // src/clicked.js
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  var _createClass = /* @__PURE__ */ function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  function clicked(element, callback, options2 = {}) {
    return new Clicked(element, callback, options2);
  }
  var Clicked = function() {
    function Clicked2(element, callback, options2) {
      var _this = this;
      _classCallCheck(this, Clicked2);
      this.options = options2;
      this.threshhold = this.options.threshhold || 10;
      this.events = {
        mouseclick: function mouseclick(e) {
          return _this.mouseclick(e);
        },
        mousedblclick: function mousedblclick(e) {
          return _this.mousedblclick(e);
        },
        touchstart: function touchstart(e) {
          return _this.touchstart(e);
        },
        touchmove: function touchmove(e) {
          return _this.touchmove(e);
        },
        touchcancel: function touchcancel(e) {
          return _this.touchcancel(e);
        },
        touchend: function touchend(e) {
          return _this.touchend(e);
        }
      };
      element.addEventListener("click", this.events.mouseclick);
      element.addEventListener("dblclick", this.events.mousedblclick);
      element.addEventListener("touchstart", this.events.touchstart, { passive: true });
      element.addEventListener("touchmove", this.events.touchmove, { passive: true });
      element.addEventListener("touchcancel", this.events.touchcancel);
      element.addEventListener("touchend", this.events.touchend);
      this.element = element;
      this.callback = callback;
      this.doubleClickCallback = this.options.doubleClickCallback;
    }
    _createClass(Clicked2, [{
      key: "destroy",
      value: function destroy() {
        this.element.removeEventListener("click", this.events.mouseclick);
        this.element.removeEventListener("dblclick", this.events.mousedblclick);
        this.element.removeEventListener("touchstart", this.events.touchstart);
        this.element.removeEventListener("touchmove", this.events.touchmove);
        this.element.removeEventListener("touchcancel", this.events.touchcancel);
        this.element.removeEventListener("touchend", this.events.touchend);
      }
    }, {
      key: "touchstart",
      value: function touchstart(e) {
        if (e.touches.length === 1) {
          this.lastX = e.changedTouches[0].screenX;
          this.lastY = e.changedTouches[0].screenY;
          this.down = true;
        }
      }
    }, {
      key: "pastThreshhold",
      value: function pastThreshhold(x, y) {
        return Math.abs(this.lastX - x) > this.threshhold || Math.abs(this.lastY - y) > this.threshhold;
      }
    }, {
      key: "touchmove",
      value: function touchmove(e) {
        if (!this.down || e.touches.length !== 1) {
          this.touchcancel();
          return;
        }
        var x = e.changedTouches[0].screenX;
        var y = e.changedTouches[0].screenY;
        if (this.pastThreshhold(x, y)) {
          this.touchcancel();
        }
      }
    }, {
      key: "touchcancel",
      value: function touchcancel() {
        this.down = false;
      }
    }, {
      key: "touchend",
      value: function touchend(e) {
        if (this.down) {
          e.preventDefault();
          if (this.callback) {
            this.callback(e, this.options.args);
          }
        }
      }
    }, {
      key: "mouseclick",
      value: function mouseclick(e) {
        if (this.callback) {
          this.callback(e, this.options.args);
        }
      }
    }, {
      key: "mousedblclick",
      value: function mousedblclick(e) {
        if (this.doubleClickCallback) {
          this.doubleClickCallback(e, this.options.args);
        }
      }
    }]);
    return Clicked2;
  }();
  var clicked_default = clicked;

  // src/leaf.js
  var Leaf = class _Leaf {
    constructor(data, level, tree) {
      this.data = data;
      this.tree = tree;
      this.level = level;
      this.element = html({ className: `${tree.prefixClassName}-leaf` });
      this.element.isLeaf = true;
      this.element.__leafInstance = this;
      this.element.data = data;
      this.element.content = html({ parent: this.element, className: `${tree.prefixClassName}-content` });
      this.element.style.marginLeft = `${tree.indentation}px`;
      const iconClass = `${tree.prefixClassName}-expand${data.expanded ? " expanded" : ""}`;
      this.element.icon = html({
        parent: this.element.content,
        className: iconClass.trim()
      });
      this.element.name = html({ parent: this.element.content, html: data.name, className: `${tree.prefixClassName}-name` });
      this.element.handler = html({ parent: this.element.content, className: `${tree.prefixClassName}-leaf-handler` });
      this.element.handler.addEventListener("mousedown", (e) => tree._input._down(e));
      this.element.handler.addEventListener("touchstart", (e) => tree._input._down(e));
      this.element.name.addEventListener("mousedown", (e) => {
        tree._input._down(e);
        this.selectLeaf();
      });
      this.element.name.addEventListener("touchstart", (e) => {
        tree._input._down(e);
        this.selectLeaf();
      });
      clicked_default(this.element.name, () => {
      }, {
        doubleClickCallback: () => {
          if (tree.taskEditor && typeof tree.taskEditor.editTask === "function") {
            tree.taskEditor.editTask(this);
          } else {
            console.error("editTask method not found in taskEditor");
          }
        }
      });
      data.task = data.task || [];
      for (let child of data.task) {
        const add = new _Leaf(child, level + 1, tree);
        add.data.parent = data;
        this.element.appendChild(add.element);
        if (!data.expanded) {
          add.element.style.display = "none";
        }
      }
      if (this.getChildren(true).length === 0) {
        this.hideIcon();
      }
      this.element.icon.addEventListener("click", () => tree.toggleExpand(this.element));
      tree.emit("render", this.element, tree);
    }
    getChildren(all) {
      const children = [];
      for (let child of this.element.children) {
        if (child.isLeaf && (all || child.style.display !== "none")) {
          children.push(child);
        }
      }
      return children;
    }
    hideIcon() {
      if (this.element.isLeaf) {
        this.element.icon.classList.add("hidden");
      }
    }
    showIcon() {
      if (this.element.isLeaf) {
        this.element.icon.classList.remove("hidden");
      }
    }
    selectLeaf() {
      const selectedLeaf = document.querySelector(`.${this.tree.prefixClassName}-leaf-select`);
      if (selectedLeaf) {
        selectedLeaf.classList.remove(`${this.tree.prefixClassName}-leaf-select`);
      }
      this.element.classList.add(`${this.tree.prefixClassName}-leaf-select`);
    }
  };

  // src/editor.js
  var TaskEditor = class {
    constructor(tree) {
      this.tree = tree;
      this.currentTask = null;
      this.taskArea = document.getElementById("taskarea");
      this.createTaskBtn = document.getElementById("createTaskBtn");
      this.editTaskBtn = document.getElementById("editTaskBtn");
      this.placeholderText = this.taskArea.getAttribute("data-placeholder");
      this.createTaskBtn.addEventListener("click", () => this.createTask());
      this.editTaskBtn.addEventListener("click", () => this.updateTask());
      this.taskArea.addEventListener("input", () => this.onTaskAreaInput());
      this.setupPlaceholder();
    }
    setupPlaceholder() {
      const setPlaceholder = () => {
        if (this.taskArea.innerText.trim() === "") {
          this.taskArea.innerText = this.placeholderText;
          this.taskArea.classList.add("placeholder");
        }
      };
      const removePlaceholder = () => {
        if (this.taskArea.innerText === this.placeholderText) {
          this.taskArea.innerText = "";
          this.taskArea.classList.remove("placeholder");
        }
      };
      this.taskArea.addEventListener("focus", removePlaceholder);
      this.taskArea.addEventListener("blur", setPlaceholder);
      setPlaceholder();
    }
    createTask() {
      const taskName = this.taskArea.innerText.trim();
      if (taskName && taskName !== this.placeholderText) {
        const selectedLeaf = document.querySelector(`.${this.tree.prefixClassName}-leaf-select`);
        const newTask = { name: taskName, task: [] };
        if (selectedLeaf) {
          const selectedLeafInstance = selectedLeaf.__leafInstance;
          if (selectedLeafInstance && selectedLeafInstance.data) {
            const parentTask = selectedLeafInstance.data.parent;
            if (parentTask) {
              const siblingIndex = parentTask.task.indexOf(selectedLeafInstance.data);
              parentTask.task.splice(siblingIndex + 1, 0, newTask);
            } else {
              console.error("Parent task not found for the selected leaf");
            }
          } else {
            console.error("Selected leaf instance or its data is not defined");
          }
        } else {
          if (this.tree.element.data && this.tree.element.data.task) {
            this.tree.element.data.task.push(newTask);
          } else {
            console.error("Tree data or tree data task array is not defined");
          }
        }
        this.tree.update();
        this.resetTaskArea();
      }
    }
    updateTask() {
      if (this.currentTask) {
        this.currentTask.data.name = this.taskArea.innerText.trim();
        this.tree.update();
        this.resetTaskArea();
      }
    }
    onTaskAreaInput() {
      const taskName = this.taskArea.innerText.trim();
      if (this.currentTask && taskName && taskName !== this.placeholderText) {
        this.editTaskBtn.classList.remove("hidden");
        this.createTaskBtn.classList.add("hidden");
      } else {
        this.editTaskBtn.classList.add("hidden");
        this.createTaskBtn.classList.remove("hidden");
      }
    }
    resetTaskArea() {
      this.taskArea.innerText = "";
      this.taskArea.blur();
      this.editTaskBtn.classList.add("hidden");
      this.createTaskBtn.classList.remove("hidden");
      this.currentTask = null;
    }
    editTask(leaf) {
      this.currentTask = leaf;
      this.taskArea.innerText = leaf.data.name;
      this.editTaskBtn.classList.remove("hidden");
      this.createTaskBtn.classList.add("hidden");
      this.taskArea.focus();
    }
  };

  // src/tree.js
  var Tree = class extends import_eventemitter3.default {
    constructor(tree, options2) {
      super();
      this._options = options(options2, defaults);
      this._input = new Input(this);
      this.taskEditor = new TaskEditor(this);
      if (typeof this._options.element === "undefined") {
        this.element = document.createElement("div");
      } else {
        this.element = el(this._options.element);
      }
      if (this._options.parent) {
        el(this._options.parent).appendChild(this.element);
      }
      this.element.classList.add(this.prefixClassName);
      this.element.data = tree;
      this.update();
    }
    get selection() {
      return this._selection.data;
    }
    set selection(data) {
    }
    get prefixClassName() {
      return this._options.prefixClassName;
    }
    set prefixClassName(value) {
      if (value !== this._options.prefixClassName) {
        this._options.prefixClassName = value;
        this.update();
      }
    }
    get indentation() {
      return this._options.indentation;
    }
    set indentation(value) {
      if (value !== this._options.indentation) {
        this._options.indentation = value;
        this._input._indicatorMarginLeft = value + "px";
        this.update();
      }
    }
    get holdTime() {
      return this._options.holdTime;
    }
    set holdTime(value) {
      if (value !== this._options.holdTime) {
        this._options.holdTime = value;
      }
    }
    get move() {
      return this._options.move;
    }
    set move(value) {
      this._options.move = value;
    }
    get expandOnClick() {
      return this._options.expandOnClick;
    }
    set expandOnClick(value) {
      this._options.expandOnClick = value;
    }
    get select() {
      return this._options.select;
    }
    set select(value) {
      this._options.select = value;
    }
    get dragOpacity() {
      return this._options.dragOpacity;
    }
    set dragOpacity(value) {
      this._options.dragOpacity = value;
    }
    expandAll() {
      this._expandChildren(this.element);
    }
    _expandChildren(leaf) {
      for (let child of this._getChildren(leaf, true)) {
        this.expand(child);
        this._expandChildren(child);
      }
    }
    collapseAll() {
      this._collapseChildren(this.element);
    }
    _collapseChildren(leaf) {
      for (let child of this._getChildren(leaf, true)) {
        this.collapse(child);
        this._collapseChildren(child);
      }
    }
    toggleExpand(leaf) {
      if (!leaf.icon.classList.contains("hidden")) {
        if (leaf.data.expanded) {
          this.collapse(leaf);
        } else {
          this.expand(leaf);
        }
      }
    }
    expand(leaf) {
      if (leaf.isLeaf) {
        const children = this._getChildren(leaf, true);
        if (children.length) {
          for (let child of children) {
            child.style.display = "block";
          }
          leaf.data.expanded = true;
          leaf.icon.classList.add("expanded");
          this.emit("expand", leaf, this);
          this.emit("update", leaf, this);
        }
      }
    }
    collapse(leaf) {
      if (leaf.isLeaf) {
        const children = this._getChildren(leaf, true);
        if (children.length) {
          for (let child of children) {
            child.style.display = "none";
          }
          leaf.data.expanded = false;
          leaf.icon.classList.remove("expanded");
          this.emit("collapse", leaf, this);
          this.emit("update", leaf, this);
        }
      }
    }
    update() {
      const scroll = this.element.scrollTop;
      removeChildren(this.element);
      for (let leaf of this.element.data.task) {
        const add = new Leaf(leaf, 0, this);
        add.data.parent = this.element.data;
        add.element.__leafInstance = add;
        this.element.appendChild(add.element);
      }
      this.element.scrollTop = scroll + "px";
    }
    editData(data) {
      const children = this._getChildren(null, true);
      for (let child of children) {
        if (child.data === data) {
          child.querySelector(`.${this.prefixClassName}-name`).setAttribute("contenteditable", true);
          child.querySelector(`.${this.prefixClassName}-name`).focus();
        }
      }
    }
    getLeaf(leaf, root = this.element) {
      this.findInTree(root, (data) => data === leaf);
    }
    findInTree(leaf, callback) {
      for (const child of leaf.children) {
        if (callback(child)) {
          return child;
        }
        const find = this.findInTree(child, callback);
        if (find) {
          return find;
        }
      }
    }
    _getFirstChild(element, all) {
      const children = this._getChildren(element, all);
      if (children.length) {
        return children[0];
      }
    }
    _getLastChild(element, all) {
      const children = this._getChildren(element, all);
      if (children.length) {
        return children[children.length - 1];
      }
    }
    _getParent(element) {
      element = element.parentNode;
      while (element.style.display === "none") {
        element = element.parentNode;
      }
      return element;
    }
    _getChildren(leaf, all) {
      leaf = leaf || this.element;
      const children = [];
      for (let child of leaf.children) {
        if (child.isLeaf && (all || child.style.display !== "none")) {
          children.push(child);
        }
      }
      return children;
    }
  };

  // src/init.js
  function initializeTree() {
    const tasks = window.tasks;
    const tree = new Tree(tasks, { parent: document.getElementById("tasktree") });
    tree.expandAll();
    window.taskEditor = new TaskEditor(tree);
    tree.taskEditor = window.taskEditor;
  }
  window.onload = function() {
    initializeTree();
  };
})();
//# sourceMappingURL=index.js.map
