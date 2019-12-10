import { UnilateralConnectedDigraph, GraphNode } from './characterGraph'

let node1 = new GraphNode(1, {}, [2, 3])
let node2 = new GraphNode(2, {}, [1, 3])
let node3 = new GraphNode(3, {}, [1, 2])
let graph = new UnilateralConnectedDigraph(node1)
graph.addNodes(node1, 'to', node2, node3)
graph.addNodes(node2, 'to', node1, node3)
graph.addNodes(node3, 'to', node1, node2)
let nodes = graph.getNodeList()
let edges = graph.getEdgeList()
console.log('nodes', nodes)
console.log('edges', edges)
