import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GitUser} from "./model/git_user";
import {ApiService} from "./service/api.service";
import {Observable} from "rxjs";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public usuarioA?: Observable<GitUser>;
    public usuarioB?: Observable<GitUser>;

    public usuarioAFollowing: GitUser[] = [];

    public lblUserA = 'usuarioA'
    public lblUserB = 'usuarioB'

    public formBusca: FormGroup = this.formBuilder.group(
        {
            usuarioA: [null, Validators.required],
            usuarioB: [null, Validators.required]
        }
    );

    constructor(private formBuilder: FormBuilder,
                private service: ApiService) {
    }

    public searchUser(formControlName: string) {
        const inputValue = this.formBusca.get(formControlName)?.value
        if (inputValue) {
            if (formControlName == this.lblUserA) {
                this.usuarioA = this.service.getGithubUser(inputValue);
                this.getFollowing(this.lblUserA)
            } else {
                this.usuarioB = this.service.getGithubUser(inputValue);
                this.getFollowing(this.lblUserB)
            }
        }
    }

    public swap() {
        let temp = this.formBusca.get(this.lblUserA)?.value
        this.formBusca.get(this.lblUserA)?.setValue(this.formBusca.get(this.lblUserB)?.value)
        this.formBusca.get(this.lblUserB)?.setValue(temp)
        this.searchUser(this.lblUserA)
        this.searchUser(this.lblUserB)
    }

    public getFollowing(formControlName: string) {
        if (formControlName == this.lblUserA)
            this.service.getFollowing(this.formBusca.get(this.lblUserA)?.value).subscribe(
                value => this.usuarioAFollowing = value
            )

    }
}


