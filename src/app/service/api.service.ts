import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {GitUser} from "../model/git_user";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    // Insira aqui seu token de acesso pessoal ao github.
    @Inject('token') private TOKEN: string = ''
    private BASE_URL: string = 'https://api.github.com/users';
    private httpOptions: HttpHeaders = new HttpHeaders({
        'Authorization': this.TOKEN ? `Bearer ${this.TOKEN}` : ''
    })


    constructor(private http: HttpClient) {
        console.log(this.TOKEN);
    }


    public getGithubUser(username: string): Observable<GitUser> {
        return this.http.get<GitUser>(`${this.BASE_URL}/${username}`,
            {headers: this.httpOptions})
    }


    public getFollowing(username: string): Observable<GitUser[]> {
        return this.http.get<GitUser[]>(`${this.BASE_URL}/${username}/following`,
            {headers: this.httpOptions});
    }


}
