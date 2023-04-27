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

    public getFollowers(username: string): Observable<GitUser[]> {
        return this.http.get<GitUser[]>(`${this.BASE_URL}/${username}/followers`,
            {headers: this.httpOptions});
    }

    public getFollowing(username: string, per_page: number = 1000, page: number = 0): Observable<GitUser[]> {
        return this.http.get<GitUser[]>(`${this.BASE_URL}/${username}/following?per_page=${per_page}`,
            {headers: this.httpOptions});
    }

    // Status code = 204 -> Following, 404 -> Not following;
    public isFollowing(username: string, target_user: string): Observable<any> {
        return this.http.get(`${this.BASE_URL}/user/${username}/following/${target_user}`,
            {headers: this.httpOptions});
    }

}
