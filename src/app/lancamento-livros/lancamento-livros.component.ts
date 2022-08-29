import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ScheduleService } from '../services/schedule.service';

@Component({
  selector: 'app-lancamento-livros',
  templateUrl: './lancamento-livros.component.html',
  styleUrls: ['./lancamento-livros.component.scss']
})
export class LancamentoLivrosComponent implements OnInit {

  public livros: any[] = [];
  carregando = false;
  regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

  constructor(
    private scheduleService: ScheduleService,
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.scheduleService.retrieveSchedules(9, "all").subscribe((res: any) => {
      this.carregando = false;
      this.livros = res;
    }, err => {
      this.carregando = false;
      console.log(err);
    });
  }

}
