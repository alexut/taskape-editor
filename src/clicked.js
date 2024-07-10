'use strict';

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function clicked(element, callback, options = {}) {
    return new Clicked(element, callback, options);
}

var Clicked = function () {
    function Clicked(element, callback, options) {
        var _this = this;

        _classCallCheck(this, Clicked);

        this.options = options;
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
        element.addEventListener('click', this.events.mouseclick);
        element.addEventListener('dblclick', this.events.mousedblclick);
        element.addEventListener('touchstart', this.events.touchstart, { passive: true });
        element.addEventListener('touchmove', this.events.touchmove, { passive: true });
        element.addEventListener('touchcancel', this.events.touchcancel);
        element.addEventListener('touchend', this.events.touchend);
        this.element = element;
        this.callback = callback;
        this.doubleClickCallback = this.options.doubleClickCallback;
    }

    _createClass(Clicked, [{
        key: 'destroy',
        value: function destroy() {
            this.element.removeEventListener('click', this.events.mouseclick);
            this.element.removeEventListener('dblclick', this.events.mousedblclick);
            this.element.removeEventListener('touchstart', this.events.touchstart);
            this.element.removeEventListener('touchmove', this.events.touchmove);
            this.element.removeEventListener('touchcancel', this.events.touchcancel);
            this.element.removeEventListener('touchend', this.events.touchend);
        }
    }, {
        key: 'touchstart',
        value: function touchstart(e) {
            if (e.touches.length === 1) {
                this.lastX = e.changedTouches[0].screenX;
                this.lastY = e.changedTouches[0].screenY;
                this.down = true;
            }
        }
    }, {
        key: 'pastThreshhold',
        value: function pastThreshhold(x, y) {
            return Math.abs(this.lastX - x) > this.threshhold || Math.abs(this.lastY - y) > this.threshhold;
        }
    }, {
        key: 'touchmove',
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
        key: 'touchcancel',
        value: function touchcancel() {
            this.down = false;
        }
    }, {
        key: 'touchend',
        value: function touchend(e) {
            if (this.down) {
                e.preventDefault();
                if (this.callback) {
                    this.callback(e, this.options.args);
                }
            }
        }
    }, {
        key: 'mouseclick',
        value: function mouseclick(e) {
            if (this.callback) {
                this.callback(e, this.options.args);
            }
        }
    }, {
        key: 'mousedblclick',
        value: function mousedblclick(e) {
            if (this.doubleClickCallback) {
                this.doubleClickCallback(e, this.options.args);
            }
        }
    }]);

    return Clicked;
}();

export default clicked;
