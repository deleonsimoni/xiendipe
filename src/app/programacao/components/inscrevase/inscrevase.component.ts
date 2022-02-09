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
  public days = ["29/10", "30/10", "31/10", "01/11", "02/11", "03/11", "04/11", "05/11", "06/11", "07/11", "08/11", "09/11", "10/11", "11/11", "12/11"];
  daySelect;
  modalitySelect;
  pressbutton;
  carregando = false;
  axisId;
  workTitle;
  @ViewChild('selecioneDia', {static: false}) selecioneDia: any;
  public user: any;
  public loading = false;
  public modalities = [
    {
      name: 'Minicurso',
      type: 4
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
      name: 'Roda de Conversa',
      type: 2
    },
  ];

  public eixos = [
    { id: 1, name: "Formação docente" },
    { id: 2, name: "Currículo e avaliação" },
    { id: 3, name: "Direitos humanos, Interculturalidade e Religiões" },
    {
      id: 4,
      name:
        "Nova epistemologia, Diferença, Biodiversidade, Democracia e Inclusão",
    },
    { id: 5, name: "Educação, Comunicação e Técnologia" },
    { id: 6, name: "Infâncias, Juventudes e Vida Adulta" },
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

  public filterWorks(){
    this.pressbutton = Math.random();
  }


}
