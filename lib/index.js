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
     * @returns {Function} 销毁该方法
     */
    Message.on = function (evtType, handler) { };
    ;
    /**
     * 监听 只执行一次
     * @param evtType 名称
     * @param handler 执行体
     * @returns {Function} 销毁该方法
     */
    Message.once = function (evtType, handler) { };
    ;
    /**
     * 移除
     * @param evtType 名称
     * @param handler 执行体
     */
    Message.off = function (evtType, handler) { };
    ;
    /**
     * 响应
     * @param evtType
     */
    Message.emit = function (evtType) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
    };
    ;
    /**
     * 监听
     * @param evtType 名称
     * @param handler 执行体
     * @returns {Function} 销毁该方法
     */
    Message.prototype.on = function (evtType, handler) {
        var _this = this;
        if (!this._evtObjs[evtType]) {
            this._evtObjs[evtType] = [];
        }
        this._evtObjs[evtType].push({
            handler: handler,
            once: false,
            called: false
        });
        return function () {
            _this.off(evtType, handler);
        };
    };
    /**
     * 监听 只执行一次
     * @param evtType 名称
     * @param handler 执行体
     * @returns {Function} 销毁该方法
     */
    Message.prototype.once = function (evtType, handler) {
        var _this = this;
        if (!this._evtObjs[evtType]) {
            this._evtObjs[evtType] = [];
        }
        this._evtObjs[evtType].push({
            handler: handler,
            once: true,
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
        var types = [];
        if (evtType) {
            types = [evtType];
        }
        else {
            types = Object.keys(this._evtObjs);
        }
        types.forEach(function (type) {
            if (!handler) {
                // remove all
                return _this._evtObjs[type] = [];
            }
            var handlers = _this._evtObjs[type] || [];
            var nextHandlers = [];
            handlers.forEach(function (evtObj) {
                if (evtObj.handler !== handler) {
                    nextHandlers.push(evtObj);
                }
            });
            _this._evtObjs[type] = nextHandlers;
        });
        return this;
    };
    /**
     * 响应
     * @param evtType
     */
    Message.prototype.emit = function (evtType) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var handlers = this._evtObjs[evtType] || [];
        handlers.forEach(function (evtObj) {
            if (evtObj.once && evtObj.called)
                return;
            evtObj.called = true;
            try {
                evtObj.handler && evtObj.handler.apply(null, args);
            }
            catch (e) {
                console.error(e.stack || e.message || e);
            }
        });
    };
    Message._evtObjs = Object.create(null);
    return Message;
}());
exports.Message = Message;
(function () {
    var message = new Message();
    ['on', 'once', 'off', 'emit'].forEach(function (name) {
        Message[name] = function () {
            return message[name].apply(message, arguments);
        };
    });
})();
exports.default = Message;
