export class RelationGraph {
  constructor(node) {
    if (!node instanceof GraphNode) throw new Error('参数类型错误')
    this._root = node.id
    this._nodes = new Map()
    this._nodes.set(node.id, node.data)
    this._edges = new Map()
    // union-find 并查集查连通
    // this._unionFindSet = {}
    // this._unionFindSet.id = id
  }
  // 纯加节点
  addNodes(...nodes) {
    for (let node of nodes) {
      if (!node instanceof GraphNode) throw new Error('参数类型错误')
      this._nodes.set(node.id, node.data)
    }
  }
  // 纯加边
  setRelation(source, props = {}, ...targets) {
    if (!this._nodes.has(source)) throw new Error(`图中无${source}节点`)
    for (let target of targets) {
      if (!this._nodes.has(target)) throw new Error(`图中无${target}节点`)
      if (this._edges.has(source)) {
        let targets = this._edges.get(source)
        if (!targets.some(item => item.target == target)) {
          targets.push({ target, props })
          this._edges.set(source, targets)
        } else {
          this._edges.set(source, [{ target, props }])
        }
      } else this._edges.set(source, [{ target, props }])
    }
  }
  // 加节点又加边
  addRelationedNodes(source, props = {}, ...targetNodes) {
    if (!this._nodes.has(source)) throw new Error(`图中无${source}节点`)
    for (let targetNode of targetNodes) {
      if (!targetNode instanceof GraphNode) throw new Error('类型错误')
      this._nodes.set(targetNode.id, targetNode.data)
      if (this._edges.has(source)) {
        let targets = this._edges.get(source)
        if (!targets.some(item => item.target == targetNode.id)) {
          targets.push({ target: targetNode.id, props })
          this._edges.set(source, targets)
        } else {
          this._edges.set(source, [{ target: targetNode.id, props }])
        }
      } else this._edges.set(source, [{ target: targetNode.id, props }])
    }
  }
  // 删除关系 删除了一个点后只需要返回根节点的连通分量
  deleteRelations(id) {
    if (!this._nodes.has(id)) throw new Error(`图中无${id}节点`)
    if (!this._edges.has(id)) return
    this._edges.delete(id)
    // return
    // 广度优先搜索
    let tmpNodes = new Map()
    let tmpEdges = new Map()
    let queue = [] // 队列
    let visited = {}
    queue.push(this._root)
    visited[this._root] = false
    while (queue.length != 0) {
      let nodeId = queue.shift()
      if (visited[nodeId]) continue
      visited[nodeId] = true
      tmpNodes.set(nodeId, this._nodes.get(nodeId))
      if (!this._edges.has(nodeId)) continue
      let successors = this._edges.get(nodeId)
      let targets = successors.map(item => item.target)
      tmpEdges.set(nodeId, successors)
      queue.push(...targets)
    }
    this._nodes = tmpNodes
    this._edges = tmpEdges
  }
  get nodeList() {
    return Array.from(this._nodes.values())
  }
  get edgeList() {
    let list = []
    if (this._edges.size == 0) return list
    this._edges.forEach((value, key) => {
      for (let item of value)
        list.push({ source: key, target: item.target, data: item.props })
    })
    return list
  }
}

export class GraphNode {
  constructor({ id, data = {} }) {
    if (id == undefined) throw new Error('关系图构造失败')
    this._id = id
    this._data = data
  }
  get id() {
    return this._id
  }
  set id(id) {
    this._id = id
  }
  get data() {
    return this._data
  }
  set data(data) {
    this._data = data
  }
}
