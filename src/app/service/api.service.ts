import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GitUser } from "../model/git_user";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private BASE_URL: string = 'https://api.github.com/users';

    constructor(private http: HttpClient) {

    }


    public getGithubUser(username: string, token?: string): Observable<GitUser> {
        return this.http.get<GitUser>(`${this.BASE_URL}/${username}`,
            {
                headers: new HttpHeaders({
                    'Authorization': token ? `Bearer ${token}` : ''
                })
            })
    }


    public getFollowing(username: string, token?: string): Observable<GitUser[]> {
        return this.http.get<GitUser[]>(`${this.BASE_URL}/${username}/following`,
            {
                headers: new HttpHeaders({
                    'Authorization': token ? `Bearer ${token}` : ''
                })
            });
    }


}
