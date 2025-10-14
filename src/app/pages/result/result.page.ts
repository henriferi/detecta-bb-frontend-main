import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
  standalone: false,
})
export class ResultPage {
 
  resultado: any;
  explicacao: string = ''; // Adicionado: Propriedade para armazenar o texto da explicação
 
  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.resultado = nav?.extras.state?.['resultado'];
 
    // Adicionado: Extrair a explicação se ela existir
    if (this.resultado && this.resultado.explicacao && this.resultado.explicacao.explicacao_texto) {
      this.explicacao = this.resultado.explicacao.explicacao_texto;
    }
  }
 
   irParaHome() {
    this.router.navigate(['/home-page']);
  }
 
}
