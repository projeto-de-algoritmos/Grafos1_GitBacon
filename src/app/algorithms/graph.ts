let grafo2 = {
    3: [1, 9, 2],
    1: [2, 3, 4, 7],
    2: [5, 7, 10],
    4: [5, 6],
    5: [],
    6: [8, 9],
    7: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    8: [6, 9],
    9: [10, 7, 8],
    10: [1]
}

let grafo = {
    1: [2],
    2: [3],
    3: [1,5],
    4: [1],
    5: []
}


const targetNode = 5;

function isTarget(currentNode: no){

    return (currentNode.nografo == targetNode)

}

function getneighbors(currentNode: no){
    // @ts-ignore
    let vizinhos = grafo[currentNode.nografo];

    let nos:no[] = [];
    
    vizinhos.forEach((v:any )=> {
        nos.push({nografo:v, path:[v]})
    });
    
    return nos;
}

type no = {nografo: number, path: any[]}

function bfs(s: no, isTarget: any, getneighbors: any){

    if(isTarget(s)){
        return [s];
    }

    let frontier = [s];
    // const x = frontier.shift();
    let explored = new Set();

    s.path = [s];

    let t = null;

    while(frontier.length > 0){

        let u = frontier.shift();
        explored.add(u);

        const vizinhos = getneighbors(u);

        for(var v of vizinhos){
            v.path = [...s.path,...u!.path,...v.path]
            console.log("s.path=", s.path, "u.path=", u!.path), "v.path=", v.path;
            const isExplored = explored.has(v);
            const isInFrontier = frontier.indexOf(v) != -1;

           
            if(!isExplored && !isInFrontier){
                console.log("isTarget=", isTarget(v), "v=", v);
                if(isTarget(v)){
                    t = v;
                    break;
                }
                frontier.push(v);
                console.log(frontier);
            }

        }

        if(isTarget(v)){
            break;
        }

    }

    if(t == null){
        return [];
    }else{
        return t.path;
    }

}


const test = bfs({nografo: 4, path:[]}, isTarget, getneighbors);

console.log(test);