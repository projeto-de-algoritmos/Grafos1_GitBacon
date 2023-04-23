import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ApiService} from "../../service/api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnChanges {
    @Input() public username?: string;
    public avatarSrc!: string;
    public loading = false;
    public showAvatar = false;

    constructor(private service: ApiService,
                private snackBar: MatSnackBar) {
    }

    get githubUser() {
        return this.username ? `https://github.com/${this.username}` : ''
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['username']) {
            this.username = changes['username'].currentValue;
            this.setAvatarUrl();
        }
    }

    private setAvatarUrl() {

        if (this.username && this.username != '') {
            this.loading = true;
            this.service.getGithubUser(this.username)
                .forEach(user => {
                    this.username = user.login;
                    this.avatarSrc = user.avatar_url;
                    this.showAvatar = true;
                    this.loading = false;
                })
                .then()
                .catch(error => {
                        const response = error as HttpErrorResponse;
                        let errorMsg;
                        if (response.status == 404)
                            errorMsg = `Nenhum usuário com username ${this.username} foi encontrado.`
                        else
                            errorMsg = `Erro ao buscar pelo usuário ${this.username}. Resposta do servidor: 
                            ${response.error['message']} (${response.status})`
                        this.snackBar.open(errorMsg, 'Fechar', {duration: 3000, verticalPosition: "top"})
                        this.loading = false;
                    }
                )

        }
    }


}
