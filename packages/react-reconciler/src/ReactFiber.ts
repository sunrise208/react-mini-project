import {NoFlags, Placement} from "./ReactFiberFlags";
import type {WorkTag} from "./ReactWorkTags";
import {NoLanes} from "./ReactFiberLane";
import type {Fiber} from "./ReactInternalTypes";

import {
  ClassComponent,
  Fragment,
  FunctionComponent,
  HostComponent,
  HostText,
} from "./ReactWorkTags";

import {isFn, isStr, isUndefined} from "./utils";
import {RootTag, ConcurrentRoot} from "./ReactFiberRoot";
import {HostRoot} from "./ReactWorkTags";

// export function createFiber(vnode: any, returnFiber: any) {
//   const fiber = {
//     tag: 0,
//     // 类型
//     type: vnode.type,
//     key: vnode.key,
//     // 属性
//     props: vnode.props,
//     // 不同类型的组件， stateNode也不同
//     // 原生标签 dom节点
//     // class 实例
//     stateNode: null,

//     // 第一个子fiber
//     child: null,
//     // 下一个兄弟节点
//     sibling: null,
//     return: returnFiber,

//     flags: Placement,

//     // 记录节点在当前层级下的位置
//     index: null,

//     // old fiber
//     alternate: null,

//     deletions: [],

//     // 函数组件存的是hook0
//     memorizedState: null,
//   };

//   const {type} = vnode;

//   if (isStr(type)) {
//     fiber.tag = HostComponent;
//   } else if (isFn(type)) {
//     // todo 函数以及类组件
//     fiber.tag = type.prototype.isReactComponent
//       ? ClassComponent
//       : FunctionComponent;
//   } else if (isUndefined(type)) {
//     fiber.tag = HostText;
//     fiber.props = {children: vnode};
//   } else {
//     fiber.tag = Fragment;
//   }

//   return fiber;
// }

export function createFiber(
  tag: WorkTag,
  pendingProps: unknown,
  key: null | string
): Fiber {
  return new FiberNode(tag, pendingProps, key);
}

function FiberNode(tag: WorkTag, pendingProps: unknown, key: null | string) {
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // Fiber
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.flags = NoFlags;
  this.deletions = null;

  this.childLanes = NoLanes;
  this.lanes = NoLanes;

  this.alternate = null;
}

export function createWorkInProgress(current: Fiber, pendingProps: any): Fiber {
  let workInProgress = current.alternate;

  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;

    workInProgress.alternate = current;

    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    // Needed because Blocks store data on type.
    workInProgress.type = current.type;

    // We already have an alternate.
    // Reset the effect tag.
    workInProgress.flags = NoFlags;

    // The effects are no longer valid.
    workInProgress.subtreeFlags = NoFlags;
    workInProgress.deletions = null;
  }

  workInProgress.flags = current.flags;
  workInProgress.childLanes = current.childLanes;
  workInProgress.lanes = current.lanes;

  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;

  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;

  return workInProgress;
}

export function createHostRootFiber(tag: RootTag): Fiber {
  if (tag === ConcurrentRoot) {
  }

  return createFiber(HostRoot, null, null);
}
