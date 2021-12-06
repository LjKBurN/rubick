import Koa from 'koa';
import fs from 'fs';
import {
  LINK_NODE_TYPE,
  HeadNode,
  MiddlewareNode,
  LinkNode,
  RouteNode,
  RuleNode,
  ControllerNode,
  MethodNode,
} from './linknode';

type NODE_TYPE = 'middle' | 'route_middle' | 'ctor';

class Trace {
  rootNode = new HeadNode('head');
  routeNode = new RouteNode('--路由--');

  currentNode = this.rootNode;

  constructor() {}

  setNode(
    type: NODE_TYPE,
    name: string,
  ): void;
  setNode(
    type: NODE_TYPE,
    name: string,
    path: string,
  ):void;
  setNode(
    type: NODE_TYPE,
    name: string,
    handler: string,
    path: string,
    method: string,
  ):void;
  setNode(
    type: NODE_TYPE,
    name?: string,
    handler?: string,
    path?: string,
    method?: string,
  ) {
    switch (type) {
      case 'middle': {
        if (name === 'dispatch') {
          this.currentNode = this.currentNode.setNext(this.routeNode);
        } else {
          const middlewareNode = new MiddlewareNode(name|| `匿名中间件(${MiddlewareNode.anonymousCount++})`);
          this.currentNode = this.currentNode.setNext(middlewareNode);
        }
        return;
      }
      case 'route_middle': {
        const ruleNode = this.routeNode.setLinkGroupNode(new RuleNode(`规则${RuleNode.count++}`, path || '/'));
        ruleNode.setNext(new MiddlewareNode(name || `匿名中间件(${MiddlewareNode.anonymousCount++})`));
        return;
      }
      case 'ctor': {
        const ruleNode = this.routeNode.setLinkGroupNode(new RuleNode(`规则${RuleNode.count++}`, path || '/'));
        const methodNode = ruleNode.setNext(new MethodNode(`方法${MethodNode.count++}`, method || 'all'));
        methodNode.setNext(new ControllerNode(name || '未知Controller', handler || 'undefined'));
        return;
      }
    }
  }

  cycleLog() {
    let cur = this.rootNode;
    let str = '请求/响应循环：';
    while (cur.next) {
      cur = cur.next;
      const { type, info } = cur;
      if (type === "路由中间件") {
        str += `\n\t[${cur.type}: ${cur.info()}]---->${this.routeNode.linkBundleRoot.allThrough()}`;
      } else {
        str += `\n\t[${cur.type}: ${cur.info()}]`;
      }
    }
    const writeStream = fs.createWriteStream('./route', 'utf-8');
    writeStream.write(str);
  }
}

export { Trace }