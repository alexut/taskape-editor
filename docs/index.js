(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __commonJS = (callback, module) => () => {
    if (!module) {
      module = {exports: {}};
      callback(module.exports, module);
    }
    return module.exports;
  };
  var __exportStar = (target, module, desc) => {
    __markAsModule(target);
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    if (module && module.__esModule)
      return module;
    return __exportStar(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", {value: module, enumerable: true}), module);
  };

  // node_modules/eventemitter3/index.js
  var require_eventemitter3 = __commonJS((exports, module) => {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events2() {
    }
    if (Object.create) {
      Events2.prototype = Object.create(null);
      if (!new Events2().__proto__)
        prefix = false;
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
      if (!emitter._events[evt])
        emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn)
        emitter._events[evt].push(listener);
      else
        emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0)
        emitter._events = new Events2();
      else
        delete emitter._events[evt];
    }
    function EventEmitter() {
      this._events = new Events2();
      this._eventsCount = 0;
    }
    EventEmitter.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0)
        return names;
      for (name in events = this._events) {
        if (has.call(events, name))
          names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers)
        return [];
      if (handlers.fn)
        return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners)
        return 0;
      if (listeners.fn)
        return 1;
      return listeners.length;
    };
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once)
          this.removeListener(event, listeners.fn, void 0, true);
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
          if (listeners[i].once)
            this.removeListener(event, listeners[i].fn, void 0, true);
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
              if (!args)
                for (j = 1, args = new Array(len - 1); j < len; j++) {
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
      if (!this._events[evt])
        return this;
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
        if (events.length)
          this._events[evt] = events.length === 1 ? events[0] : events;
        else
          clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt])
          clearEvent(this, evt);
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
    if (typeof module !== "undefined") {
      module.exports = EventEmitter;
    }
  });

  // scripts/live.js
  var port = 1235;
  var first = true;
  function createSocket() {
    const socket = new WebSocket(`ws://localhost:${port}`);
    socket.addEventListener("message", () => window.location.reload());
    socket.addEventListener("close", () => {
      setTimeout(createSocket, 0);
    });
    socket.addEventListener("open", () => {
      if (!first) {
        window.location.reload();
      } else {
        first = false;
      }
    });
  }
  window.addEventListener("load", () => {
    createSocket();
    console.log(`Live reload initialized on port ${port}...`);
  });

  // src/tree.js
  var eventemitter3 = __toModule(require_eventemitter3());

  // src/clicked.js
  "use strict";
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  var _createClass = function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps)
        defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        defineProperties(Constructor, staticProps);
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
      element.addEventListener("touchstart", this.events.touchstart, {passive: true});
      element.addEventListener("touchmove", this.events.touchmove, {passive: true});
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
    return {y: Math.round(top), x: Math.round(left)};
  }
  function options(options2, defaults3) {
    options2 = options2 || {};
    for (let option in defaults3) {
      options2[option] = typeof options2[option] !== "undefined" ? options2[option] : defaults3[option];
    }
    return options2;
  }
  function removeChildren(element) {
    while (element.firstChild) {
      element.firstChild.remove();
    }
  }
  "use strict";
  function html(options2) {
    options2 = options2 || {};
    const object = document.createElement(options2.type || "div");
    if (options2.parent) {
      options2.parent.appendChild(object);
    }
    if (options2.className) {
      object.classList.add(options2.className);
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
    constructor(tree2) {
      this._indicator = html();
      this._indicator.style.marginLeft = tree2.indentation + "px";
      const content = html({parent: this._indicator});
      content.style.display = "flex";
      this._indicator.indentation = html({parent: content});
      this._indicator.icon = html({parent: content, className: `${tree2.prefixClassName}-expand`});
      this._indicator.icon.style.height = 0;
      this._indicator.line = html({parent: content, className: `${tree2.prefixClassName}-indicator`});
    }
    get() {
      return this._indicator;
    }
    set _marginLeft(value) {
      this._indicator.style.marginLeft = value + "px";
    }
  };

  // src/input.js
  "use strict";
  var Input = class {
    constructor(tree2) {
      this._tree = tree2;
      this._indicator = new Indicator(tree2);
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
            this._tree._selection.name.classList.remove(`${this._tree.prefixClassName}-select`);
          }
          this._tree._selection = this._target;
          this._tree._selection.name.classList.add(`${this._tree.prefixClassName}-select`);
        }
        this._isDown = {x: e.pageX, y: e.pageY, alreadySelected};
        const pos = toGlobal(this._target);
        this._offset = {x: e.pageX - pos.x, y: e.pageY - pos.y};
        if (this._tree.holdTime) {
          this._holdTimeout = window.setTimeout(() => this._hold(), this._tree.holdTime);
        }
        e.preventDefault();
        e.stopPropagation();
      } else {
        this._target = e.currentTarget.parentNode.parentNode;
        if (this._tree._selection !== this._target) {
          if (this._tree._selection) {
            this._tree._selection.name.classList.remove(`${this._tree.prefixClassName}-select`);
          }
          this._tree._selection = this._target;
          this._tree._selection.name.classList.add(`${this._tree.prefixClassName}-select`);
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
        boxShadow: this._target.name.style.boxShadow || "unset"
      };
      this._target.style.position = "absolute";
      this._target.name.style.boxShadow = "3px 3px 5px rgba(0,0,0,0.25)";
      this._target.style.left = pos.x + "px";
      this._target.style.top = pos.y + "px";
      this._target.style.opacity = this._tree.dragOpacity;
      if (this._tree._getChildren(parent, true).length === 0) {
        this._tree._hideIcon(parent);
      }
    }
    _findClosest(e, entry) {
      const pos = toGlobal(entry.name);
      if (pos.y + entry.name.offsetHeight / 2 <= e.pageY) {
        if (!this._closest.foundAbove) {
          if (inside(e.pageX, e.pageY, entry.name)) {
            this._closest.foundAbove = true;
            this._closest.above = entry;
          } else {
            const distance2 = distancePointElement(e.pageX, e.pageY, entry.name);
            if (distance2 < this._closest.distanceAbove) {
              this._closest.distanceAbove = distance2;
              this._closest.above = entry;
            }
          }
        }
      } else if (!this._closest.foundBelow) {
        if (inside(e.pageX, e.pageY, entry.name)) {
          this._closest.foundBelow = true;
          this._closest.below = entry;
        } else {
          const distance2 = distancePointElement(e.pageX, e.pageY, entry.name);
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
        const indicator2 = this._indicator.get();
        const indentation = this._tree.indentation;
        indicator2.remove();
        this._target.style.left = e.pageX - this._offset.x + "px";
        this._target.style.top = e.pageY - this._offset.y + "px";
        const x = toGlobal(this._target.name).x;
        this._closest = {distanceAbove: Infinity, distanceBelow: Infinity};
        for (let child of this._tree._getChildren()) {
          this._findClosest(e, child);
        }
        if (!this._closest.above && !this._closest.below) {
          element.appendChild(indicator2);
        } else if (!this._closest.above) {
          element.insertBefore(indicator2, this._tree._getFirstChild(element));
        } else if (!this._closest.below) {
          let pos = toGlobal(this._closest.above.name);
          if (x > pos.x + indentation) {
            this._closest.above.insertBefore(indicator2, this._tree._getFirstChild(this._closest.above, true));
          } else if (x > pos.x - indentation) {
            this._closest.above.parentNode.appendChild(indicator2);
          } else {
            let parent = this._closest.above;
            while (parent !== element && x < pos.x) {
              parent = this._tree._getParent(parent);
              if (parent !== element) {
                pos = toGlobal(parent.name);
              }
            }
            parent.appendChild(indicator2);
          }
        } else if (this._closest.below.parentNode === this._closest.above) {
          this._closest.above.insertBefore(indicator2, this._closest.below);
        } else if (this._closest.below.parentNode === this._closest.above.parentNode) {
          const pos = toGlobal(this._closest.above.name);
          if (x > pos.x + indentation) {
            this._closest.above.insertBefore(indicator2, this._tree._getLastChild(this._closest.above, true));
          } else {
            this._closest.above.parentNode.insertBefore(indicator2, this._closest.below);
          }
        } else {
          let pos = toGlobal(this._closest.above.name);
          if (x > pos.x + indentation) {
            this._closest.above.insertBefore(indicator2, this._tree._getLastChild(this._closest.above, true));
          } else if (x > pos.x - indentation) {
            this._closest.above.parentNode.appendChild(indicator2);
          } else if (x < toGlobal(this._closest.below.name).x) {
            this._closest.below.parentNode.insertBefore(indicator2, this._closest.below);
          } else {
            let parent = this._closest.above;
            while (parent.parentNode !== this._closest.below.parentNode && x < pos.x) {
              parent = this._tree._getParent(parent);
              pos = toGlobal(parent.name);
            }
            parent.appendChild(indicator2);
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
          const indicator2 = this._indicator.get();
          indicator2.parentNode.insertBefore(this._target, indicator2);
          this._tree.expand(indicator2.parentNode);
          this._tree._showIcon(indicator2.parentNode);
          this._target.style.position = this._old.position === "unset" ? "" : this._old.position;
          this._target.name.style.boxShadow = this._old.boxShadow === "unset" ? "" : this._old.boxShadow;
          this._target.style.opacity = this._old.opacity === "unset" ? "" : this._old.opacity;
          indicator2.remove();
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
    prefixClassName: "yy-tree",
    cursorName: "grab -webkit-grab pointer",
    cursorExpand: "pointer",
    edit: true
  };

  // src/tree.js
  "use strict";
  var Tree = class extends eventemitter3.default {
    constructor(tree2, options2) {
      super();
      this._options = options(options2, defaults);
      this._input = new Input(this);
      if (typeof this._options.element === "undefined") {
        this.element = document.createElement("div");
      } else {
        this.element = el(this._options.element);
      }
      if (this._options.parent) {
        el(this._options.parent).appendChild(this.element);
      }
      this.element.classList.add(this.prefixClassName);
      this.element.data = tree2;
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
    _leaf(data, level) {
      const leaf = html({className: `${this.prefixClassName}-leaf`});
      leaf.isLeaf = true;
      leaf.data = data;
      leaf.content = html({parent: leaf, className: `${this.prefixClassName}-content`});
      leaf.style.marginLeft = this.indentation + "px";
      const iconClass = `${this.prefixClassName}-expand${data.expanded ? " expanded" : ""}`;
      leaf.icon = html({
        parent: leaf.content,
        className: iconClass.trim()
      });
      leaf.name = html({parent: leaf.content, html: data.name, className: `${this.prefixClassName}-name`});
      leaf.handler = html({parent: leaf.content, className: `${this.prefixClassName}-leaf-handler`});
      leaf.handler.addEventListener("mousedown", (e) => this._input._down(e));
      leaf.handler.addEventListener("touchstart", (e) => this._input._down(e));
      leaf.name.addEventListener("mousedown", (e) => this._input._down(e));
      leaf.name.addEventListener("touchstart", (e) => this._input._down(e));
      clicked_default(leaf.name, () => {
      }, {
        doubleClickCallback: () => {
          if (this._options.edit) {
            leaf.name.setAttribute("contenteditable", true);
            leaf.name.focus();
          }
        }
      });
      leaf.name.addEventListener("blur", () => {
        if (this._options.edit) {
          data.name = leaf.name.innerText;
          leaf.name.removeAttribute("contenteditable");
          this.emit("name-change", leaf, leaf.name.innerText, this);
          this.emit("update", leaf, this);
        }
      });
      data.task = data.task || [];
      for (let child of data.task) {
        const add = this._leaf(child, level + 1);
        add.data.parent = data;
        leaf.appendChild(add);
        if (!data.expanded) {
          add.style.display = "none";
        }
      }
      if (this._getChildren(leaf, true).length === 0) {
        this._hideIcon(leaf);
      }
      clicked_default(leaf.icon, () => this.toggleExpand(leaf));
      this.emit("render", leaf, this);
      return leaf;
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
    _hideIcon(leaf) {
      if (leaf.isLeaf) {
        leaf.icon.classList.add("hidden");
      }
    }
    _showIcon(leaf) {
      if (leaf.isLeaf) {
        leaf.icon.classList.remove("hidden");
      }
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
        const add = this._leaf(leaf, 0);
        add.data.parent = this.element.data;
        this.element.appendChild(add);
      }
      this.element.scrollTop = scroll + "px";
    }
    editData(data) {
      const children = this._getChildren(null, true);
      for (let child of children) {
        if (child.data === data) {
          child.name.setAttribute("contenteditable", true);
          child.name.focus();
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
  };

  // docs/code.js
  var tasks = {
    task: [
      {
        name: "Do the laundry",
        task: [
          {name: "Get the detergent", task: []},
          {name: "Sort the clothes", task: []},
          {name: "Put the clothes in the washing machine", task: []},
          {name: "Turn on the washing machine", task: []}
        ]
      },
      {
        name: "Do the dishes",
        task: [
          {name: "Scrape the dishes", task: []},
          {name: "Rinse the dishes", task: []},
          {name: "Put the dishes in the dishwasher", task: []},
          {name: "Turn on the dishwasher", task: []}
        ]
      }
    ]
  };
  function test() {
    const tree2 = new Tree(tasks, {parent: document.body});
    tree2.expandAll();
  }
  window.onload = function() {
    test();
  };
})();
