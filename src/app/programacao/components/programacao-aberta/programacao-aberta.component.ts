import { Component, OnInit, ViewChild } from '@angular/core';

import { SCHEDULE_TYPE, WORK_OPTIONS } from "../../../declarations";
import { BehaviorSubject } from "rxjs";
import { ScheduleService } from "../../../services/schedule.service";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'app-programacao-aberta',
  templateUrl: './programacao-aberta.component.html',
  styleUrls: ['./programacao-aberta.component.scss']
})
export class ProgramacaoAbertaComponent implements OnInit {



  public workModalities = WORK_OPTIONS;
  public programacoes = SCHEDULE_TYPE;
  public schedules$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  @ViewChild('selecioneDia', { static: false }) selecioneDia: any;
  public days = ["20/11", "21/11", "22/11", "23/11", "24/11", "25/11", "26/11", "27/11"];
  daySelect;
  modalitySelect;
  carregando = false;
  public user: any;
  public loading = false;
  public modalities = [
    {
      name: 'Abertura',
      type: 1
    },
    {
      name: 'Painel',
      type: 5
    },
    {
      name: 'Pôster',
      type: 3
    },
    {
      name: 'Atividade Cultural',
      type: 7
    },
    /*  {
        name: 'Conexão Entrevista',
        type: 11
      },*/
    {
      name: 'Encerramento',
      type: 12
    },
    {
      name: 'Lançamentos de Livros',
      type: 9
    },
    {
      name: 'Sessão Especial',
      type: 10
    },
    {
      name: 'Simpósios',
      type: 8
    }
  ];


  constructor(
    private auth: AuthService,
  ) {

  }

  ngOnInit() {

    this.user = this.auth.getDecodedAccessToken(this.auth.getToken());

  }

  public selectDate(day) {
    this.daySelect = day;
  }

  public selectModality(modality) {
    this.modalitySelect = modality.type;
    this.selecioneDia.nativeElement.focus();

  }

}
