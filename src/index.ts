interface IEventHandle {
    
    /** 是否已调用 */
    called: boolean,
    
    /** 是否只调用一次 */
    once: boolean,

    /** 指向方法 */
    handler: Function,
}
interface IEvtObjs {
    [propName: string]: IEventHandle[]
}

export class Message {

    static _evtObjs: IEvtObjs = Object.create(null);
    
    /**
     * 监听
     * @param evtType 名称
     * @param handler 执行体
     * @returns {Function} 销毁该方法
     */
    static on (evtType: string, handler: Function) {};
    /**
     * 监听 只执行一次
     * @param evtType 名称
     * @param handler 执行体
     * @returns {Function} 销毁该方法
     */
    static once (evtType: string, handler: Function) {};
    /**
     * 移除
     * @param evtType 名称
     * @param handler 执行体
     */
    static off (evtType?: string, handler?: Function) {};
    /**
     * 响应
     * @param evtType 
     */
    static emit (evtType: string, ...args: any[]) {};

    /** 缓存对象 */
    private _evtObjs: IEvtObjs;

    /** 时间通知 */
    constructor () {
        this._evtObjs = Object.create(null);
    }

    /**
     * 监听
     * @param evtType 名称
     * @param handler 执行体
     * @returns {Function} 销毁该方法
     */
    on (evtType: string, handler: Function) {
        if (!this._evtObjs[evtType]) {
            this._evtObjs[evtType] = [];
        }
        this._evtObjs[evtType].push({
            handler,
            once: false,
            called: false
        });
        return () => {
            this.off(evtType, handler);
        };
    }

    /**
     * 监听 只执行一次
     * @param evtType 名称
     * @param handler 执行体
     * @returns {Function} 销毁该方法
     */
    once (evtType: string, handler: Function) {
        if (!this._evtObjs[evtType]) {
            this._evtObjs[evtType] = [];
        }
        this._evtObjs[evtType].push({
            handler,
            once: true,
            called: false
        });
        return () => {
            this.off(evtType, handler);
        };
    }

    /**
     * 移除
     * @param evtType 名称
     * @param handler 执行体
     */
    off (evtType?: string, handler?: Function) {
        let types: string[] = [];
        if (evtType) {
            types = [evtType];
        } else {
            types = Object.keys(this._evtObjs);
        }
        
        types.forEach((type) => {
            if (!handler) {
                // remove all
                return this._evtObjs[type] = [];
            }
            let handlers = this._evtObjs[type] || [];
            let nextHandlers: IEventHandle[] = [];

            handlers.forEach((evtObj) => {
                if (evtObj.handler !== handler) {
                    nextHandlers.push(evtObj);
                }
            });
            this._evtObjs[type] = nextHandlers;
        });
        return this;
    }

    /**
     * 响应
     * @param evtType 
     */
    emit (evtType: string, ...args: any[]) {
        var handlers = this._evtObjs[evtType] || [];
        handlers.forEach(function (evtObj) {
            if (evtObj.once && evtObj.called) return
            evtObj.called = true
            try {
                evtObj.handler && evtObj.handler.apply(null, args);
            } catch(e) {
                console.error(e.stack || e.message || e)
            }
        })
    }
}

(() => {
    let message = new Message();
    ['on', 'once', 'off', 'emit'].forEach(name => {
        Message[name] = function () {
            return message[name].apply(message, arguments);
        };
    });
})();

export default Message;