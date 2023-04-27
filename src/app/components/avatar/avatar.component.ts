import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {GitUser} from "../../model/git_user";

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnChanges {
    @Input() public user?: GitUser | null;
    @Input() public isSmall: boolean = false;
    public avatarSrc!: string;
    public loading = false;
    public showAvatar = false;
    public githubUser: string = '';
    public login: string = '';

    constructor() {
    }



    ngOnChanges(changes: SimpleChanges) {
        if (changes['user']) {
            this.user = changes['user'].currentValue;
            if (this.user?.login) {
                this.avatarSrc = this.user?.avatar_url ? this.user?.avatar_url : '';
                this.githubUser = this.user?.login ? `https://github.com/${this.user?.login}` : ''
                this.showAvatar = true;
            }
        }
    }


}
