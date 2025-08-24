import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({ providedIn: 'root' })
export class ApiService {

private baseUrl = environment.apiUrl;


  constructor(private http: HttpClient) {}

  generateUI(prompt: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/generate-ui`, { userProblem: prompt });
  }

 enhancePrompt(prompt: string): Observable<{ enhancedPrompt: string }> {
  return this.http.post<{ enhancedPrompt: string }>(
    `${this.baseUrl}/api/enhance-prompt`,
    { prompt }
  );
}
}
