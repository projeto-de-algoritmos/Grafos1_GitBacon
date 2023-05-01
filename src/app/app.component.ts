import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "./service/api.service";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public githubTokenInfo = 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token';

    public usuarioA!: string;
    public usuarioB!: string;

    public usersValid: boolean = false;

    private validyStatus: { userA?: boolean, userB?: boolean } = {}

    public lblUserA = 'usuarioA'
    public lblUserB = 'usuarioB'

    public showSettings = false;
    public showInfo = false;

    public formBusca: FormGroup = this.formBuilder.group(
        {
            usuarioA: [null, Validators.required],
            usuarioB: [null, Validators.required],
            maxLevels: [4],
            token: [null]
        }
    );

    constructor(private formBuilder: FormBuilder,
        private apiService: ApiService,
        private snackBar: MatSnackBar
    ) {
    }

    get providedToken() {
        return this.formBusca.get('token')?.value;
    }

    private handleError(e: HttpErrorResponse, inputValue: string) {
        if (e.status == 404)
            this.notify(`Usuário ${inputValue} não encontrado no GitHub.`, true)
        else if (e.status == 403)
            this.notify('Limite de acessos à API Rest atingido. Aguarde uma hora para tentar novamente ou forneça um token, clicando no ícone ⚙️.', true)
        else
            this.notify(`Erro au buscar usuário ${inputValue}. Descrição: ${e.message}`, true)
    }

    public onInputFocusOut(formControlName: string) {
        const inputValue = this.formBusca.get(formControlName)?.value
        if (inputValue) {
            if (formControlName == this.lblUserA) {
                this.apiService.getGithubUser(inputValue, this.providedToken).subscribe(
                    user => {
                        this.usuarioA = user.avatar_url;
                        this.validyStatus['userA'] = true;
                        this.usersValid = (!!this.validyStatus['userA'] && !!this.validyStatus['userB']);
                    },
                    error => this.handleError(error as HttpErrorResponse, inputValue)
                );
            } else {
                this.apiService.getGithubUser(inputValue, this.providedToken).subscribe(
                    user => {
                        this.usuarioB = user.avatar_url;
                        this.validyStatus['userB'] = true;
                        this.usersValid = (!!this.validyStatus['userA'] && !!this.validyStatus['userB']);
                    },
                    error => this.handleError(error as HttpErrorResponse, inputValue)
                );
            }
        }
    }

    get token() {
        return this.formBusca.get('token')?.value ? this.formBusca.get('token')!.value! : null;
    }

    get userOrigin() {
        return this.formBusca.get(this.lblUserA)!.value!
    }

    get userTarget() {
        return this.formBusca.get(this.lblUserB)!.value!
    }

    public swap() {
        let temp = this.formBusca.get(this.lblUserA)?.value
        this.formBusca.get(this.lblUserA)?.setValue(this.formBusca.get(this.lblUserB)?.value)
        this.formBusca.get(this.lblUserB)?.setValue(temp)
        this.onInputFocusOut(this.lblUserA)
        this.onInputFocusOut(this.lblUserB)
    }


    public notify(msg: string, isError = false) {
        const emoji = isError ? '⚠️' : '✅';
        const message = `${emoji} ${msg}`
        this.snackBar.open(message, 'Fechar', { duration: 2000 });
    }
}


