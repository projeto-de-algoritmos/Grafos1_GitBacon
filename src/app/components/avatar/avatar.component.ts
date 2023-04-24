import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ApiService} from "../../service/api.service";

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnChanges {
    @Input() public user?: string;
    @Input() public isSmall: boolean = false;
    @Input() public showArrow: boolean = false;
    public avatarSrc!: string;
    public loading = false;
    public showAvatar = false;
    public githubUser: string = '';
    public login: string = '';

    constructor(private service: ApiService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.user) {
            this.loading = true;
            this.service.getGithubUser(this.user).subscribe(
                gitUser => {
                    this.avatarSrc = gitUser.avatar_url;
                    this.githubUser = `https://github.com/${gitUser.login}`;
                    this.loading = false;
                    this.showAvatar = true;
                }
            )
        }
    }


}
