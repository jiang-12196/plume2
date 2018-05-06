/**
 * 绑定Actor的Action
 * Usage:
 *  class HelloActor extends Actor {
 *     @Action('hello')
 *     hello(state) {
 *       return state;
 *     }
 *  }
 *
 * @param msg 事件名
 */

 //decorator

 // action = () => function(){}
 // typeScript 装饰器， class 里面使用
 // 是一个高阶函数，返回一个函数
 // 目的是将Action下面的function放到_route中，actor.resive调用就可以。
 // 不懂。。。
export const Action = (msg: string) => (
  target: any, // target是actor，这个类
  property: any, // 所在
  descriptor: TypedPropertyDescriptor<any> // 不太懂...
) => {
  target._route || (target._route = {});

  /**
   * 如果有actor的Action中有重名的事件名，warning
   */
  if (process.env.NODE_ENV != 'production') {
    if (target._route[msg]) {
      const actorName = target.constructor.name;
      console.warn(
        `😎${actorName} had @Action('${msg}'), Please review your code.`
      );
    }
  }

  target._route[msg] = descriptor.value;
};
