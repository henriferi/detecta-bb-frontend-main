import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Upload de arquivo para análise com OCR
  uploadBoleto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post(`${this.baseUrl}/api/upload/analyze-file`, formData) // ← ROTA CORRETA
      .pipe(catchError(this.handleError));
  }

  // Análise manual (sem arquivo, enviando dados JSON)
  analisarBoleto(dados: {
    banco: string;
    codigo_banco: number;
    agencia: number;
    valor: number;
    linha_digitavel: string;
  }): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/api/analyze`, dados, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Auth
  login(email: string, senha: string): Observable<any> {
    const body = { email, senha };
    return this.http
      .post(`${this.baseUrl}/api/auth/login`, body, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  register(data: { nome: string; email: string; senha: string }): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/api/auth/register`, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUserData(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http
      .get(`${this.baseUrl}/api/auth/me`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Histórico e estatísticas
  getHistory(page: number = 1, perPage: number = 10): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http
      .get(`${this.baseUrl}/api/history?page=${page}&per_page=${perPage}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getStats(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/api/stats`)
      .pipe(catchError(this.handleError));
  }

  recoverPassword(email: string, novaSenha: string): Observable<any> {
    const body = { email, nova_senha: novaSenha };
    return this.http
      .put(`${this.baseUrl}/api/auth/recover-password`, body, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro da API:', error);
    
    let errorMessage = 'Erro desconhecido';
    
    if (error.status === 0) {
      errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    } else if (error.status >= 400 && error.status < 500) {
      errorMessage = error.error?.error || error.error?.erro || error.error?.message || 'Erro na requisição';
    } else if (error.status >= 500) {
      errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
    }
    
    const enhancedError = {
      ...error,
      userMessage: errorMessage
    };
    
    return throwError(() => enhancedError);
  }
}