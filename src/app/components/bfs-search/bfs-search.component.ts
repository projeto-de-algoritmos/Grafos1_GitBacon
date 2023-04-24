import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ApiService} from "../../service/api.service";
import {GitUser} from "../../model/git_user";


type no = { login: string, path: any[] }

@Component({
    selector: 'app-bfs-search',
    templateUrl: './bfs-search.component.html',
    styleUrls: ['./bfs-search.component.scss']
})
export class BfsSearchComponent implements OnChanges {
    @Input() public userOrigin!: string;
    @Input() public userTarget!: string;
    @Input() maxLevel: number = 6;
    public path?: string [];
    public messages: string[] = [];

    public kevinBaconNumber?: number = undefined;

    constructor(private service: ApiService) {
    }

    public getLastMessages(qtd?: number): string[] {
        if (qtd)
            return this.formatArray(this.messages, qtd)
        return this.messages;

    }

    private formatArray(array: any[], qtd = 7): any[] {
        if (array.length > qtd) {
            const start = array.length - qtd;
            return [array[0], '...', ...array.slice(start)]
        }
        return array;
    }

    msg(...data: any[]) {
        this.messages.push(`<p>${data.toString()}</p>`);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.start()
    }

    start() {
        this.bfs().then(path => {
            console.log(path);
            this.path = path;
        });

    }


    async bfs(): Promise<string[]> {

        // Variables
        const originUsername = this.userOrigin;
        let originUser: no = {login: originUsername, path: [originUsername]}
        let queue = [originUser];
        let visited = new Set();
        let level = 0;
        let t = null;
        let currentNeighbor = undefined;

        // Functions
        const isTarget = (currentNode?: no) => {
            return currentNode ? currentNode.login == this.userTarget : false
        }
        const visit = (user?: no) => {
            if (!visited.has(user))
                this.msg(`Visiting user: ${user?.login} | Current level: L${level < 0 ? 0 : level } <br/>
                            Visited GitHub ${visited.size} user(s) until now: 
                            [${this.formatArray(Array.from(visited).map((el: any) => el.login)).join(', ')}]`);
            visited.add(user);
        }

        // Algorithm

        if (isTarget(originUser)) {
            this.msg(`Found path between 
                                    ${this.userOrigin} and ${this.userTarget}<br/>
                                    [${originUsername}]`)
            this.msg('Rendering results...')
            return [originUser.login];
        }
        while (queue.length > 0 && level <= this.maxLevel) {
            let currentUser = queue.shift()!;
            visit(currentUser);
            const neighbors = await this.service.getFollowing(currentUser.login).toPromise()
            let neighborNodes = neighbors!.map((viz: GitUser) => ({
                login: viz.login, path: [viz.login]
            }))!
            for (currentNeighbor of neighborNodes) {
                currentNeighbor.path = [...currentUser!.path, ...currentNeighbor.path]
                level = currentNeighbor.path.length - 1
                const isExplored = visited.has(currentNeighbor);
                const isInFrontier = queue.indexOf(currentNeighbor) != -1;
                if (!isExplored && !isInFrontier) {
                    if (isTarget(currentNeighbor)) {
                        t = currentNeighbor;
                        break;
                    }
                    queue.push(currentNeighbor);
                }
            }
            if (isTarget(currentNeighbor))
                break;
        }
        if (level >= this.maxLevel || t == null) {
            this.msg(`No path was found between 
                                    ${this.userOrigin} and ${this.userTarget} 
                                   within ${this.maxLevel} degrees. :( `);
            return [];
        } else {
            this.msg(`Found path between 
                                    ${this.userOrigin} and ${this.userTarget}<br/>
                                    ${t.path.join(' ➜ ')}`)
            this.msg('Rendering results...')
            this.kevinBaconNumber = level;
            return t.path;
        }

    }


}
