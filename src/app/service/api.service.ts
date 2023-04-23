import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {GitUser} from "../model/git_user";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    // Insira aqui seu token de acesso pessoal ao github.
    private TOKEN: string = ''
    private BASE_URL: string = 'https://api.github.com/users';
    private httpOptions: HttpHeaders = new HttpHeaders({
        'Authorization': this.TOKEN ? `Bearer ${this.TOKEN}` : ''
    })

    constructor(private http: HttpClient) {


    }


    public getGithubUser(username: string): Observable<GitUser> {
        return this.http.get<GitUser>(`${this.BASE_URL}/${username}`,
            {headers: this.httpOptions})
    }


    public getAvatar(username: string): Promise<string> {

        return new Promise<string>(resolve => {
            this.http.get(`${this.BASE_URL}/${username}`, {headers: this.httpOptions})
                .subscribe(
                    value => {
                        const user = value as GitUser;
                        resolve(user.avatar_url);
                    }
                )
        });

    }

}
