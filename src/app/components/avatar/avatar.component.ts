import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from "../../service/api.service";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnChanges {
    @Input() public user?: string;
    @Input() public isSmall: boolean = false;
    @Input() public showArrow: boolean = false;
    @Input() public avatarSrc?: string | undefined;
    public loading = false;
    public showAvatar = false;
    public githubUser: string = '';
    public login: string = '';

    constructor(private service: ApiService,
        private snackBar: MatSnackBar) {
    }

    ngOnChanges(changes: SimpleChanges) {
        this.loading = true;
        if (changes['avatarSrc'] && !changes['avatarSrc'].currentValue) {
            this.showAvatar = false;
        }
        if (changes['avatarSrc'] && changes['avatarSrc'].currentValue != null) {
            if (changes['user']) {
                this.githubUser = `https://github.com/${changes['user'].currentValue}`
            }
            this.avatarSrc = changes['avatarSrc'].currentValue;
            this.showAvatar = true;
            this.loading = false;
        } else if (changes['user'] && changes['user'].currentValue != null) {
            const user = changes['user'].currentValue;
            this.service.getGithubUser(user).subscribe(
                gitUser => {
                    this.avatarSrc = gitUser.avatar_url;
                    this.githubUser = `https://github.com/${gitUser.login}`;
                    this.loading = false;
                    this.showAvatar = true;
                },
                error => {
                    const e = error as HttpErrorResponse;
                    if (e.status == 404)
                        this.notify(`Usuário ${user} não encontrado no GitHub.`, true)
                    else
                        this.notify(`Erro au buscar usuário ${user}. Descrição: ${e.message}`, true)
                }
            )
        } else {
            this.loading = false;
        }

    }

    public notify(msg: string, isError = false) {
        const emoji = isError ? '⚠️' : '✅';
        const message = `${emoji} ${msg}`
        this.snackBar.open(message, 'Fechar', { duration: 2000 });
    }


}
