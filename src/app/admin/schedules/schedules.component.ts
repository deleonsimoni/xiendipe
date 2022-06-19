import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ModalSchedulesComponent } from "../modals/modal-schedules/modal-schedules.component";
import { ScheduleService } from "src/app/services/schedule.service";
import { SCHEDULE_TYPE } from "src/app/declarations";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-schedules",
  templateUrl: "./schedules.component.html",
  styleUrls: ["./schedules.component.scss"],
})
export class SchedulesComponent implements OnInit {
  public schedules$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public programacoes = SCHEDULE_TYPE;
  public days = ["20/11", "21/11", "22/11", "23/11", "24/11", "24/11", "24/11", "27/11"];
  public daySelected$: BehaviorSubject<string> = new BehaviorSubject<string>("20/11");
  public label = "Abertura";
  public typeId: any;
  public user: any;
  public loading = false;


  constructor(
    private dialog: MatDialog,
    private scheduleService: ScheduleService,
    private authService: AuthService,
    private router: Router
  ) {
    this.daySelected$.subscribe((_) => {
      this.listAllSchedules();
    });
  }

  ngOnInit() {
    this.listAllSchedules();

    this.authService.refresh().subscribe((res: any) => {
      this.user = res.user;
    });
  }

  private listAllSchedules() {
    this.loading = true;
    this.typeId = this.getType();
    const date = this.daySelected$.getValue().replace("/", "-");

    this.scheduleService.retrieveSchedules(this.typeId, date).subscribe((data) => {
      this.loading = false;
      this.schedules$.next(data);
    });

  }

  private getType() {
    const type = this.programacoes.find((el) => el.name == this.label);
    return type.id;
  }

  public addSchedule(type?: number, data?: {}) {
    const dialogRef = this.dialog.open(ModalSchedulesComponent, {
      maxHeight: "100vh",
      data: data ? { type: type, data: data } : null,
    });

    dialogRef.afterClosed().subscribe((res) => this.listAllSchedules());
  }

  public updateList() {
    this.listAllSchedules();
  }

  public currentTab($event) {
    this.label = $event.tab.textLabel;

    this.listAllSchedules();
  }

  public selectDay(day) {
    this.daySelected$.next(day);
  }

  public showGenericCard() {
    if (this.typeId) {
      return (
        this.typeId == 1 ||
        this.typeId == 9 ||
        this.typeId == 7 ||
        this.typeId == 10 ||
        this.typeId == 11 ||
        this.typeId == 12
      );
    }

    return false;
  }

  public showSimposioCard() {
    if (this.typeId) {
      return this.typeId == 8;
    }

    return false;
  }

  public showWorkCard() {
    if (this.typeId) {
      return this.typeId == 2 || this.typeId == 4 || this.typeId == 3 || this.typeId == 5;
    }

    return false;
  }

  public editSchedule(data) {
    this.addSchedule(this.getType(), data);
  }
}
