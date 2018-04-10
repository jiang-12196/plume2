import msg from './msg';
import { Action } from './decorator';
import Actor from './actor';
import Store from './store';
import StoreProvider from './store-provder';
import { QL } from './ql';
import { PQL } from './pql';
import Relax from './relax';
import ActionCreator from './action-creator';
import ActionType from './action-type';
import { IMap, IOptions } from './typing';

// msg ---> mitt，闭包
// Action ---> TypedPropertyDescriptor,装饰器, TODO
// Actor ---> _route, receive
// Store ---> 比较复杂，看了一半
// StoreProvider ----> 将this.store.state放到项目的this.state中
// Relax ----> 拿到StoreProvider的state(也就是store), 然后放到relaxProps
// QL ----> 查询，在store中的bigQuery，通过lang array中格式，求出最终的值
// PQL ----> 局部查询， 加参数的QL
export {
  QL,
  PQL,
  msg,
  Relax,
  ActionCreator,
  Action,
  ActionType,
  Actor,
  Store,
  StoreProvider,
  IMap,
  IOptions
};
