import { Component, OnInit, ViewChild } from "@angular/core";

import { SCHEDULE_TYPE, WORK_OPTIONS } from "../../../declarations";
import { BehaviorSubject } from "rxjs";
import { ScheduleService } from "../../../services/schedule.service";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'app-inscrevase',
  templateUrl: './inscrevase.component.html',
  styleUrls: ['./inscrevase.component.scss']
})
export class InscrevaseComponent implements OnInit {

  public workModalities = WORK_OPTIONS;
  public programacoes = SCHEDULE_TYPE;
  public schedules$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public days = ["20/11", "21/11", "22/11", "23/11", "24/11", "25/11", "26/11", "27/11"];
  daySelect;
  modalitySelect;
  pressbutton;
  carregando = false;
  axisId;
  workTitle;
  @ViewChild('selecioneDia', { static: false }) selecioneDia: any;
  public user: any;
  public loading = false;
  public modalities = [
    {
      name: 'Minicurso',
      type: 4
    },
    /* {
       name: 'Painel',
       type: 5
     },
     {
       name: 'Pôster',
       type: 3
     },*/

  ];

  public eixos = [
    { id: 1, name: "Eixo 1: A Didática como campo epistemológico e disciplinar" },
    { id: 2, name: "Eixo 2: A Didática e os Saberes docentes estruturantes na formação de professores" },
    { id: 3, name: "Eixo 3: A Didática e as tecnologias da informação e comunicação no currículo e práticas de ensino" },
    { id: 4, name: "Eixo 4: A Didática e Práticas de Ensino na perspectiva da Educação como Direito Constitucional e os desafios políticos da atualidade" },
    { id: 5, name: "Eixo 5: A Didática e as Práticas de ensino nas políticas de formação de Pedagogos(as)" },
    { id: 6, name: "Eixo 6: A Didática e as Práticas de Ensino nos cursos de Licenciatura: entre tensionamentos e perspectivas" },
    { id: 7, name: "Eixo 7: A Didática, Práticas de Ensino - Infâncias, Juventudes e Vida Adulta" },
    { id: 8, name: "Eixo 8: A Didática, Práticas de Ensino, Educação das Relações Étnico-raciais, Diversidade e Inclusão Escolar" },
    { id: 9, name: "Eixo 9: A Didática da Educação Superior" },
  ];

  constructor(private scheduleService: ScheduleService,
    private authService: AuthService,
    private auth: AuthService,
  ) {

  }

  ngOnInit() {
    //this.listAllSchedules();

    this.user = this.auth.getDecodedAccessToken(this.auth.getToken());

  }

  /*
  private listAllSchedules() {
    this.typeId = this.getType();
    const date = this.daySelected$.getValue().replace("/", "-");

    this.scheduleService.retrieveSchedules(this.typeId, date).subscribe((data) => this.schedules$.next(data));
  }
*/

  public selectDate(day) {
    this.daySelect = day;
  }

  public selectModality(modality) {
    this.modalitySelect = modality.type;
    this.selecioneDia.nativeElement.focus();
  }

  public filterWorks() {
    this.pressbutton = Math.random();
  }


}
