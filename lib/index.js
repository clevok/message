"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Message = /** @class */ (function () {
    /** 时间通知 */
    function Message() {
        this._evtObjs = Object.create(null);
    }
    /**
     * 监听
     * @param evtType 名称
     * @param handler 执行体
     * @param _once 是否只相应一次
     */
    Message.prototype.on = function (evtType, handler, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        if (!this._evtObjs[evtType]) {
            this._evtObjs[evtType] = [];
        }
        this._evtObjs[evtType].push({
            handler: handler,
            once: once,
            called: false
        });
        return function () {
            _this.off(evtType, handler);
        };
    };
    /**
     * 移除
     * @param evtType 名称
     * @param handler 执行体
     */
    Message.prototype.off = function (evtType, handler) {
        var _this = this;
        var types;
        if (evtType) {
            types = [evtType];
        }
        else {
            types = Object.keys(this._evtObjs);
        }
        types.forEach(function (type) {
            if (!handler) {
                // remove all
                _this._evtObjs[type] = [];
            }
            else {
                var handlers = _this._evtObjs[type] || [];
                var nextHandlers = [];
                handlers.forEach(function (evtObj) {
                    if (evtObj.handler !== handler) {
                        nextHandlers.push(evtObj);
                    }
                });
                _this._evtObjs[type] = nextHandlers;
            }
        });
        return this;
    };
    /**
     * 响应
     * @param evtType
     */
    Message.prototype.emit = function (evtType) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var handlers = this._evtObjs[evtType] || [];
        handlers.forEach(function (evtObj) {
            _this.call(evtObj, args);
        });
    };
    /**
     * 响应第一个
     * @param evtType
     * @param args
     */
    Message.prototype.emitFirst = function (evtType) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var handlers = this._evtObjs[evtType] || [];
        this.call(handlers[0], args);
    };
    Message.prototype.call = function (evtObj, args) {
        if (!evtObj)
            return;
        if (evtObj.once && evtObj.called)
            return;
        evtObj.called = true;
        try {
            evtObj.handler && evtObj.handler.apply(null, args);
        }
        catch (e) {
            console.error(e.stack || e.message || e);
        }
    };
    return Message;
}());
exports.Message = Message;
exports.default = new Message();
