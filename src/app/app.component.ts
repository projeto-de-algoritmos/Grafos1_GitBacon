import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public usuarioA: string = '';
    public usuarioB: string = '';
    public formBusca: FormGroup = this.formBuilder.group(
        {
            usuarioA: null,
            usuarioB: null
        }
    );

    constructor(private formBuilder: FormBuilder) {
    }


    public searchUser(formControlName: string) {
        const inputValue = this.formBusca.get(formControlName)?.value
        if (inputValue) {
            if (formControlName.search('usuarioA'))
                this.usuarioA = inputValue;
            else
                this.usuarioB = inputValue;
        }
    }

    public swap() {
        let temp = this.formBusca.get('usuarioA')?.value
        this.formBusca.get('usuarioA')?.setValue(this.formBusca.get('usuarioB')?.value)
        this.formBusca.get('usuarioB')?.setValue(temp)
        this.searchUser('usuarioA')
        this.searchUser('usuarioB')

    }
}


