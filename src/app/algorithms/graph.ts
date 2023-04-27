class Graph<T> {
    public adjacency_list: Map<T, Set<T>>;

    constructor() {
        this.adjacency_list = new Map<T, Set<T>>()
    }

    public addEdge(x: T, y: T) {
        this.adjacency_list.has(x) ? this.adjacency_list.get(x)!.add(y) : this.adjacency_list.set(x, new Set([y]));
        this.adjacency_list.has(y) ? this.adjacency_list.get(y)!.add(x) : this.adjacency_list.set(y, new Set([x]));
    }

    public addEdgesFromNode(key: T, edges: T[]) {
        for (const e of edges)
            this.addEdge(key, e)

    }

    public getEdges(key: T): T[] {
        let values: T[] = []
        this.adjacency_list.get(key)!.forEach(edge => values.push(edge))
        return values;
    }


    public getNodes(): Set<T> {
        let nodes: Set<T> = new Set<T>()
        this.adjacency_list.forEach((value, key) => {
            nodes.add(key)
        })
        return nodes;
    }


    public getAdjacents(key: T): Set<T> | null {
        return this.adjacency_list.get(key)!;
    }

    public print() {
        for (const key of this.adjacency_list.keys()) {
            console.log(`${key}: ${this.getEdges(key)}`)
        }
    }

}

class Queue<T> {
    public queue: T[] = [];

    get length() {
        return this.queue.length;
    }

    public push(value: T) {
        this.queue.push(value);
    }

    public pop(): T {
        let value: T = this.queue[this.queue.length - 1];
        this.queue.splice(this.queue.length - 1)
        return value;
    }

    public print() {
        console.log(this.queue.toString())
    }

}

let graph: Graph<number> = new Graph();


let printSet = (set: Set<any>) => {
    let keys = []
    for (const key in set.keys()) {
        keys.push(key)
    }
    console.log(keys.toString())
}


graph.addEdgesFromNode(1, [4, 5, 2])
graph.addEdgesFromNode(2, [6, 1, 4])
graph.addEdge(3, 7)
graph.addEdgesFromNode(4, [1, 2, 5])
graph.addEdgesFromNode(5, [4, 1])
graph.addEdge(6, 2)
graph.addEdge(7, 3)

graph.print()

let notVisited: Set<number> = graph.getNodes()
let q: Queue<number> = new Queue<number>();
let neighNum = 1;

for (const node of notVisited) {

    q.push(node)
    // console.log('Enqueue', node, 'Queue:', q);
    notVisited.delete(node)
    console.log(node)
    // console.log(`Mark ${node} as visited. Visited ->`, visited, 'Not visited ->', notVisited)
    // console.log(`While queue isn't empty... len(q) -> `, q.length)
    while (q.length > 0) {
        console.log(`L${neighNum++}`)
        let u = q.pop();
        // console.log(`u = ${u} = q.pop(); q->`, q)

        // console.log(`Adj[${u}] = `, graph.getAdjacents(u));
        for (const v of graph.getAdjacents(u)!) {
            if (notVisited.has(v)) {
                notVisited.delete(v)
                console.log(v)
                q.push(v)
            }
        }
    }

}


