import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from "../../service/api.service";
import { GitUser } from "../../model/git_user";
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';


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
    @Input() maxFollowersToVisitPerUser: number = 10;
    @Input() providedToken: string = '';
    public showResults: boolean = false;
    public path?: string[];
    public messages: string[] = [];
    public stop: boolean = false;

    public kevinBaconNumber?: number = undefined;


    constructor(private service: ApiService, private snackBar: MatSnackBar) {

    }

    public getLastMessages(qtd?: number): string[] {
        if (qtd)
            return this.formatArray(this.messages, qtd)
        return this.messages;

    }



    private formatArray(array: any[], qtd = 7): any[] {
        if (array.length > qtd) {
            const start = array.length - qtd + 1;
            return [array[0], array[1], '...', ...array.slice(start)]
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
            this.path = path;
        });
    }

    public notify(msg: string, isError = false) {
        const emoji = isError ? '⚠️' : '✅';
        const message = `${emoji} ${msg}`
        this.snackBar.open(message, 'Fechar', { duration: 2000 });
    }

    private handleError(e: HttpErrorResponse, inputValue: string) {
        if (e.status == 404)
            this.notify(`Usuário ${inputValue} não encontrado no GitHub.`, true)
        else if (e.status == 403)
            this.notify('Limite de acessos à API Rest atingido. Aguarde uma hora para tentar novamente ou forneça um token, clicando no ícone ⚙️.', true)
        else
            this.notify(`Erro ao buscar seguidores do usuário ${inputValue}. Descrição: ${e.message}`, true)
    }


    async bfs(): Promise<string[]> {
        try {
            // Variables used in messages formatting
            let qtdVisitedUsers: number = 0;
            let visitedUsers: string[] = [];

            // Time control
            let start = Date.now();

            // Variables
            const originUsername = this.userOrigin;
            let originUser: no = { login: originUsername, path: [originUsername] }
            let queue = [originUser];
            let visited = new Set();
            let level = 0;
            let targetUser = null;
            let currentNeighbor = undefined;


            // Functions
            const isTarget = (currentNode?: no) => {
                return currentNode ? currentNode.login == this.userTarget : false
            }

            const visit = (user?: no) => {

                if (!visited.has(user))
                    visitedUsers.push(user!.login)
                qtdVisitedUsers++;
                this.msg(`Visiting user: ${user?.login} | Current level: L${level < 0 ? 0 : level} <br/>
                            Visited GitHub ${qtdVisitedUsers} user(s) until now: 
                            [${this.formatArray(visitedUsers, 3)}]`);
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

            while (queue.length > 0 && level <= this.maxLevel && !this.stop) {
                let currentUser = queue.shift()!;
                visit(currentUser);
                if (this.stop) {
                    this.messages.push('Stopped search!')
                    return [];
                }
                let neighbors = [];
                let page = 1;
                let response;
                while (page <= this.maxFollowersToVisitPerUser) {
                    response = await this.service.getFollowing(currentUser.login, page++, this.providedToken).toPromise()
                        .catch(error => this.handleError(error, currentUser.login));
                    console.log(response);
                    neighbors.push(...response!)
                    if (response!.length < 100) break;
                    if (response!.length == 0) break;
                    
                }

                for (currentNeighbor of neighbors!.map((viz: GitUser) => ({
                    login: viz.login, path: [viz.login]
                }))!) {
                    if (this.stop) {
                        this.messages.push('Stopped search!')
                        return [];
                    }
                    currentNeighbor.path = [...currentUser!.path, ...currentNeighbor.path]
                    level = currentNeighbor.path.length - 1
                    if (!visited.has(currentNeighbor) && !(queue.indexOf(currentNeighbor) != -1)) {
                        if (isTarget(currentNeighbor)) {
                            targetUser = currentNeighbor;
                            break;
                        }
                        queue.push(currentNeighbor);
                    }
                }
                if (isTarget(currentNeighbor))
                    break;
            }
            if (this.stop) {
                this.messages.push('Stopped search!')
                return [];
            }
            if (level >= this.maxLevel || targetUser == null) {
                this.msg(`No path was found between 
                                    ${this.userOrigin} and ${this.userTarget} 
                                   within ${this.maxLevel} degrees. :( `);
                return [];
            } else {
                this.msg(`Found path between 
                                    ${this.userOrigin} and ${this.userTarget}<br/>
                                    ${targetUser.path.join(' ➜ ')}`)
                this.msg('Rendering results...')
                this.kevinBaconNumber = level;
                this.showResults = true;
                return targetUser.path;
            }
        } catch (e) {
            this.notify('Ocorreu um erro ao realizar a busca.', true);
            return [];
        }

    }


}
