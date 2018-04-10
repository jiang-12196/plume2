import * as React from 'react';
import { Map } from 'immutable';
import * as PropTypes from 'prop-types';
import Store from './store';
import { IMap, IOptions } from './typing';

export type TStore = typeof Store;

/**
 * 获取组件的displayName便于react-devtools的调试
 * @param WrappedComponent
 */
const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

export default function StoreProvider(AppStore: TStore, opts?: IOptions) {
  return function wrapper(Base: React.ComponentClass): any {
    return class WrapperComponent extends Base {
      static displayName = `StoreProvider(${getDisplayName(Base)})`; // 名字
      static childContextTypes = { _plume$Store: PropTypes.object }; // 传递上下文

      // 传递上下文， 和childContextTypes，还有子组件 static contextTypes一起使用，隐式传递参数
      getChildContext: Function = (): Object => {
        return { _plume$Store: this.store };
      };

      constructor(props: Object) {
        super(props);

        this._isMounted = false;
        this.store = new AppStore(opts || { debug: false });

        // this.state.state() => state(immutable.toObject)
        this.state = {
          ...this.state,
          ...this.store.state().toObject()
        };

        this.store.subscribe(this._handleStoreChange);
      }

      store: Store;
      state: Object;
      _isMounted: boolean;

      // 自己willMount
      componentWillMount() {
        super.componentWillMount && super.componentWillMount();
        this._isMounted = false;

        //will drop on production env
        if (process.env.NODE_ENV != 'production') {
          if ((this.store as any)._opts.debug) {
            if (window) {
              const cssRule =
                'color: rgb(249, 162, 34);' +
                'font-size: 40px;' +
                'font-weight: bold;' +
                'text-shadow: 1px 1px 5px rgb(249, 162, 34);' +
                'filter: dropshadow(color=rgb(249, 162, 34), offx=1, offy=1);';
              const version = require('../package.json').version;
              console.log(`%cplume2@${version}🚀`, cssRule);
            }
            console.log(`${WrapperComponent.displayName} will mount 🚀`);
            console.time(`${WrapperComponent.displayName} render`);
          }
        }
      }

      componentDidMount() {
        super.componentDidMount && super.componentDidMount();
        this._isMounted = true;

        /**
         *优化
         * 不需要每次在Store的构造函数中去
         * if (__DEV__) {window['store'] = this;}
         * 1. 需要额外的去写构造函数
         * 2. 不同的App会覆盖window['store']
         */
        if (process.env.NODE_ENV != 'production') {
          if ((this.store as any)._opts.debug) {
            console.timeEnd(`${WrapperComponent.displayName} render`);

            const displayName = getDisplayName(Base);
            window['_plume2App'] = window['_plume2App'] || {};
            window['_plume2App'][displayName] = {
              store: this.store,
              actionCreator: (this.store as any)._actionCreator
            };
          }
        }
      }

      componentWillUpdate(nextProps, nextState, nextContext) {
        super.componentWillUpdate &&
          super.componentWillUpdate(nextProps, nextState, nextContext);
        this._isMounted = false;
      }

      componentDidUpdate(prevProps, prevState, prevContext) {
        super.componentDidUpdate &&
          super.componentDidUpdate(prevProps, prevState, prevContext);
        this._isMounted = true;

        if (process.env.NODE_ENV != 'production') {
          if ((this.store as any)._opts.debug) {
            console.timeEnd(`${WrapperComponent.displayName} re-render`);
          }
        }
      }

      componentWillUnmount() {
        super.componentWillUnmount && super.componentWillUnmount();
        this.store.unsubscribe(this._handleStoreChange);

        if (process.env.NODE_ENV != 'production') {
          if ((this.store as any)._opts.debug) {
            const displayName = getDisplayName(Base);
            delete window['_plume2App'][displayName];
          }
        }
      }

      render() {
        return super.render();
      }

      // 这个store改变，导致渲染
      _handleStoreChange = (state: IMap) => {
        //will drop on production env
        if (process.env.NODE_ENV != 'production') {
          if ((this.store as any)._opts.debug) {
            console.log(`\n${WrapperComponent.displayName} will update 🚀`);
            console.time(`${WrapperComponent.displayName} re-render`);
          }
        }

        this.setState(state.toObject());
      };
    };
  };
}
