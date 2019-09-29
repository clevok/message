interface IEventHandle {
    /** 是否已调用 */
    called: boolean;
    /** 是否只调用一次 */
    once: boolean;
    /** 指向方法 */
    handler: Function;
}
export declare class Message {
    /** 缓存对象 */
    private _evtObjs;
    /** 时间通知 */
    constructor();
    /**
     * 监听
     * @param evtType 名称
     * @param handler 执行体
     * @param _once 是否只相应一次
     */
    on(evtType: string, handler: Function, once?: boolean): () => void;
    /**
     * 移除
     * @param evtType 名称
     * @param handler 执行体
     */
    off(evtType?: string, handler?: Function): this;
    /**
     * 响应
     * @param evtType
     */
    emit(evtType: string, ...args: any[]): void;
    /**
     * 响应第一个
     * @param evtType
     * @param args
     */
    emitFirst(evtType: string, ...args: any[]): void;
    call(evtObj: IEventHandle, args: any[]): void;
}
declare const _default: Message;
export default _default;
