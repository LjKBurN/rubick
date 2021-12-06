import Koa from 'koa';
import { IConstructor } from '../controller/mapper.router';

interface IInfo {
  info(): string;
  type: string;
}

abstract class LinkNode implements IInfo {
  name = '';
  next: LinkNode | null = null;
  abstract info(): string;
  abstract type: LINK_NODE_TYPE;

  constructor(name: string) {
    this.name = name;
  }

  setNext(node: LinkNode): LinkNode {
    this.next = node;
    return node;
  }
}

enum LINK_NODE_TYPE {
  HEAD = '入口',
  MIDDLE = '中间件',
  ROUTE = '路由中间件',
  RULE = '请求路径',
  METHOD = '请求方法',
  HANDLER = '控制器'
}

class LinkBundle {
  static size = 0;

  nexts: Map<Symbol, LinkNode> | null = null

  setNext(node: LinkNode): LinkNode{
    if (!this.nexts) {
      this.nexts = new Map();
    }
    this.nexts.set(Symbol.for(`[${LinkBundle.size++}]${node.name}`), node);
    return node;
  }

  allThrough(): string {
    if (!this.nexts) return '';

    let str = '\n\t';
    for (let [k, v] of this.nexts) {
      str += oneThrough(v) + '\n\t' ;
    }
    return str.replace(/\n\t$/, '');
    function oneThrough(linkNode: LinkNode): string {
      let cur: LinkNode | null = linkNode;
      let str = '';
      while (cur) {
        str += `\t[${cur.type}: ${cur.info()}]` + '-->';
        cur = cur.next;
      }
      return str;
    }
  }
}

class HeadNode extends LinkNode {
  type = LINK_NODE_TYPE.HEAD;

  constructor(name: string) {
    super(name)
  }
  info() {
    return this.name;
  }
}

class MiddlewareNode extends LinkNode {
  public static anonymousCount = 0;
  type = LINK_NODE_TYPE.MIDDLE;

  constructor(name: string) {
    super(name);
  }

  info() {
    return this.name;
  }
}

class RouteNode extends LinkNode {
  type = LINK_NODE_TYPE.ROUTE;
  linkBundleRoot = new LinkBundle();

  constructor(name: string) {
    super(name);
  }

  setLinkGroupNode(node: LinkNode): LinkNode {
    return this.linkBundleRoot.setNext(node);
  }

  info() {
    return this.name;
  }
}

class RuleNode extends LinkNode {
  static count = 0;

  type = LINK_NODE_TYPE.RULE;
  rule: string = '';

  constructor(name: string, rule: string) {
    super(name);
    this.rule = rule;
  }
  
  info() {
    return this.rule;
  }
}

class MethodNode extends LinkNode {
  static count = 0;

  type = LINK_NODE_TYPE.METHOD;
  method: string = '';

  constructor(name: string, method: string) {
    super(name);
    this.method = method;
  }

  info() {
    return this.method;
  }
}

class ControllerNode extends LinkNode {
  type = LINK_NODE_TYPE.HANDLER;
  handler: string = '';

  constructor(name: string, handler: string) {
    super(name);
    this.handler = handler;
  }

  info() {
    return `${this.name}.${this.handler}`;
  }
}

export {
  LINK_NODE_TYPE,
  LinkNode,
  HeadNode,
  MiddlewareNode,
  RouteNode,
  RuleNode,
  ControllerNode,
  MethodNode,
}