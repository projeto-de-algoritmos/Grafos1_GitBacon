import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "./service/api.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public usuarioA!: string;
    public usuarioB!: string;

    public lblUserA = 'usuarioA'
    public lblUserB = 'usuarioB'

    public search = false;
    public showSettings = false;
    public showInfo = false;
    public userOrigin: string = '';
    public userTarget: string = '';

    public formBusca: FormGroup = this.formBuilder.group(
        {
            usuarioA: [null, Validators.required],
            usuarioB: [null, Validators.required],
            maxLevels: [4],
            token: [null]
        }
    );

    constructor(private formBuilder: FormBuilder,
                private apiService: ApiService
    ) {
    }

    public searchUser(formControlName: string) {
        const inputValue = this.formBusca.get(formControlName)?.value
        if (inputValue) {
            if (formControlName == this.lblUserA) {
                this.apiService.getGithubUser(inputValue).subscribe(
                    user => this.usuarioA = user.login
                );
            } else {
                this.apiService.getGithubUser(inputValue).subscribe(
                    user => this.usuarioB = user.login
                );


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


    public async runBFS() {
        if (this.formBusca.get(this.lblUserA)?.value != null && this.formBusca.get(this.lblUserB)?.value != null) {
            this.search = true;
            this.userOrigin = this.formBusca.get(this.lblUserA)!.value!;
            this.userTarget = this.formBusca.get(this.lblUserB)!.value!;
        }

    }
}


