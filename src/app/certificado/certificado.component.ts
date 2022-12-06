import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { CertificadoService } from "./certificado.service";

import html2canvas from "html2canvas";
import { AuthService } from "../services/auth.service";
import * as jsPDF from "jspdf";
import { HttpClient } from "@angular/common/http";
import { Inject } from "@angular/core";

@Component({
  selector: "app-certificado",
  templateUrl: "./certificado.component.html",
  styleUrls: ["./certificado.component.scss"],
})
export class CertificadoComponent implements OnInit {
  constructor(
    private authService: AuthService,
    @Inject("BASE_API_URL") private baseUrl: string,
    private http: HttpClient
  ) { }

  user: any;
  carregando = false;
  nome: any;
  gt: any;
  textoTemplate: any;
  works: any;
  inscricoes: any;
  coringa = "";
  exibirGT = false;
  certificados = [];
  templateAutomatico = { target: { value: "" } };
  blacklist = ['ana_adiniz@hotmail.com', 'pauladinizfernandes@gmail.com', 'jonise@ufam.edu.br'];

  ngOnInit() {
    this.carregando = true;
    this.authService.refresh().subscribe((res: any) => {
      this.user = res.user;

      this.nome = this.user.fullname;

      if (!this.user.icAdmin) {
        if (this.user.payment && this.user.payment.icPaid) {
          this.templateAutomatico.target.value = 'PARTICIPAÇÃO GERAL';
          this.preencherTemplate(this.templateAutomatico, null, null);

          if (this.user.reviewer && this.user.reviewer.icCoordinator) {
            this.templateAutomatico.target.value = 'COORDENAÇÃO DE ATIVIDADE';
            this.preencherTemplate(this.templateAutomatico, null, null);

          }
          if (this.user.reviewer && this.user.reviewer.icModalityId && !this.user.reviewer.icCoordinator) {
            this.templateAutomatico.target.value = 'PARECERISTA';
            this.preencherTemplate(this.templateAutomatico, null, null);
          }

        }
        if (this.user.works && this.user.works.length > 0 && !this.blacklist.includes(this.user.email)) {
          this.carregarTrabalhosUsuario();
        }
        if (this.user.cursosInscritos && this.user.cursosInscritos.length > 0) {
          this.carregarInscricoes();
        }
      }
      this.carregando = false;
    });
  }

  private gerarCertificadosTrabalhos() {
    this.works.forEach((work) => {
      //MiniCurso
      if (
        work.modalityId == 4 && ((
          (work.reviewReviewer && work.reviewReviewer.review && work.reviewReviewer.review.icAllow != "Nao")) ||
          (work.recurso && work.recurso.icAllow == "Sim"))
      ) {
        this.templateAutomatico.target.value = "MEDIAÇÃO DE MINICURSO";
        this.preencherTemplate(this.templateAutomatico, work.title, "04");
      } else if (
        work.modalityId == 5 && ((
          (work.reviewReviewer && work.reviewReviewer.review && work.reviewReviewer.review.icAllow != "Nao")) ||
          (work.recurso && work.recurso.icAllow == "Sim"))
      ) {
        this.templateAutomatico.target.value = "MEDIAÇÃO DE PAINEL";
        this.preencherTemplate(this.templateAutomatico, work.title, "05");
      } else if (
        work.modalityId == 3 && ((
          (work.reviewReviewer && work.reviewReviewer.review && work.reviewReviewer.review.icAllow != "Nao")) ||
          (work.recurso && work.recurso.icAllow == "Sim"))
      ) {
        this.templateAutomatico.target.value = "PÔSTER";
        this.preencherTemplate(this.templateAutomatico, work.title, "03");
      }
    });
  }

  private gerarCertificadosInscricoes() {
    let control = 0;
    this.inscricoes.forEach((work) => {
      if (work) {

        if (!work.workTitle || work.workTitle == 'undefined') {
          work.workTitle = '';
        }

        if (this.user.cursosInscritos[control].icModalityId == 4) {
          this.templateAutomatico.target.value = "PARTICIPAÇÃO DE MINICURSO";
          let horas = 2;
          this.preencherTemplate(this.templateAutomatico, work.workTitle, horas);
        } else if (this.user.cursosInscritos[control].icModalityId == 5) {
          this.templateAutomatico.target.value = "PARTICIPAÇÃO DE PAINEL";
          this.preencherTemplate(this.templateAutomatico, work.worksPainel[0].workTitle, null);
        }
        else if (this.user.cursosInscritos[control].icModalityId == 3) {
          this.templateAutomatico.target.value = "PARTICIPAÇÃO DE PÔSTER";
          this.preencherTemplate(this.templateAutomatico, work.workTitle, null);
        }
      }
      control++;
    });
  }

  private carregarTrabalhosUsuario() {
    this.carregando = true;
    this.http.get(`${this.baseUrl}/user/worksReviewer/`).subscribe(
      (res: any) => {
        this.works = res.works;
        this.gerarCertificadosTrabalhos();
        this.carregando = false;
      },
      (err) => {
        console.log(err);
        this.carregando = false;
      }
    );
  }

  private carregarInscricoes() {
    this.carregando = true;
    this.http
      .get(`${this.baseUrl}/user/getWorksIncricoes?inscricoes=` + JSON.stringify(this.user.cursosInscritos))
      .subscribe(
        (res: any) => {
          this.inscricoes = res.works;
          this.gerarCertificadosInscricoes();
          this.carregando = false;
        },
        (err) => {
          console.log(err);
          this.carregando = false;
        }
      );
  }

  public captureScreen(index) {
    this.carregando = true;

    let data = document.getElementById("certificado" + index);

    html2canvas(data).then((canvas) => {
      let imgWidth = 300;
      let imgHeight = 190;

      const contentDataURL = canvas.toDataURL("image/png");
      let pdf = new jsPDF("l", "mm", "a4"); // A4 size page of PDF
      var position = 0;
      this.carregando = false;
      pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
      pdf.save("Certificado Endipe.pdf"); // Generated PDF
    });
  }

  preencherTemplate(templateSelecionado, complementoUm, complementoDois) {
    if (this.user.icAdmin) {
      this.certificados = [];
    }

    this.exibirGT = false;
    this.coringa = "";
    this.textoTemplate = this.templates.filter((element) => element.name == templateSelecionado.target.value)[0].value;
    if (templateSelecionado.target.value == "GT") {
      this.coringa = " participou do GT ";
      this.exibirGT = true;
    } else if (templateSelecionado.target.value == "PRESTAÇÃO DE SERVIÇO") {
      this.coringa = " atuou como prestadora de serviço na área de ";
      this.exibirGT = true;
    } else if (templateSelecionado.target.value == "MONITORIA") {
      this.coringa =
        " atuou como monitora, perfazendo um total de ______ horas de trabalho de pré-produção, produção e pós produção ";
      this.exibirGT = true;
    }
    /*else if (templateSelecionado.target.value == "COORDENAÇÃO DE ATIVIDADE") {
  this.coringa = " coordenou ";
  this.exibirGT = true;
} */
    else if (templateSelecionado.target.value == "SESSÃO ESPECIAL") {
      this.coringa =
        " integrou a Sessão Especial " +
        (complementoUm || "______________") +
        " com a palestra " +
        (complementoDois || "_______ ");
      this.exibirGT = true;
    } else if (templateSelecionado.target.value == "ATIVIDADE CULTURAL") {
      this.coringa = " realizou a apresentação cultural ";
      this.exibirGT = true;
    } else if (templateSelecionado.target.value == "SIMPOSIO") {
      this.coringa = " realizou o simpósio ";
      this.exibirGT = true;
    } else if (templateSelecionado.target.value == "MEDIAÇÃO DE MINICURSO") {
      this.coringa =
        " desenvolveu o Minicurso " +
        (complementoUm || "______________") +
        " com carga horária de " +
        (complementoDois || "_______ ") +
        " horas";
      this.exibirGT = true;
    } else if (templateSelecionado.target.value == "PARTICIPAÇÃO DE MINICURSO") {
      this.coringa =
        " participou do Minicurso " +
        (complementoUm || "______________") +
        " com carga horária de " +
        (complementoDois || "_______ ") +
        " horas";
      this.exibirGT = true;
    } else if (templateSelecionado.target.value == "PARTICIPAÇÃO DE PAINEL") {
      this.coringa = " participou do painel " + complementoUm || "______________" + " ";
      this.exibirGT = true;
    } else if (templateSelecionado.target.value == "MEDIAÇÃO DE PAINEL") {
      this.coringa = " apresentou o Painel intitulado " + (complementoUm || "______________");
      this.exibirGT = true;
    } else if (templateSelecionado.target.value == "PÔSTER") {
      this.coringa = " apresentou o trabalho " + (complementoUm || "______________");
      this.exibirGT = true;
    } else if (templateSelecionado.target.value == "PARTICIPAÇÃO DE PÔSTER") {
      this.coringa = " participou de apresentação de pôster " + complementoUm || "______________" + " ";
      this.exibirGT = true;
    }


    this.certificados.push({ nome: this.nome, coringa: this.coringa, textoTemplate: this.textoTemplate });
  }

  templates = [
    {
      name: "ATIVIDADE CULTURAL",
      value:
        "no XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },
    {
      name: "COMITÊ CIENTÍFICO",
      value:
        "fez parte do Comitê Científico do XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },
    {
      name: "COMITÊ ORGANIZADOR",
      value:
        "participou do Comitê Organizador no XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },
    {
      name: "COORDENAÇÃO DE ATIVIDADE",
      value:
        "participou da coordenação de eixo no XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },

    {
      name: "COORDENAÇÃO GERAL",
      value:
        "coordenou o XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },

    {
      name: "GT",
      value:
        "no XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },

    {
      name: "MEDIAÇÃO DE MINICURSO",
      value:
        "no XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },
    {
      name: "MEDIAÇÃO DE PAINEL",
      value:
        "no XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },

    {
      name: "MONITORIA",
      value:
        "no XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },


    {
      name: "PARECERISTA",
      value:
        "participou na condição de parecerista no XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },

    {
      name: "PARTICIPAÇÃO DE MINICURSO",
      value:
        "no XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },
    {
      name: "PARTICIPAÇÃO DE PAINEL",
      value:
        "no XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },
    {
      name: "PARTICIPAÇÃO DE PÔSTER",
      value:
        "no XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },


    {
      name: "PARTICIPAÇÃO GERAL",
      value:
        "participou do XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },

    {
      name: "PÔSTER",
      value:
        "na modalidade Pôster, durante o XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },

    {
      name: "PRESTAÇÃO DE SERVIÇO",
      value:
        "para fins de realização do XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },


    {
      name: "SESSÃO ESPECIAL",
      value:
        "no XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },

    {
      name: "SIMPOSIO",
      value:
        "no XXI Encontro Nacional de Didática e Prática de Ensino – XXI Endipe – Uberlândia 2022 – sediado pela Universidade Federal de Uberlândia, no período de 20 a 27 de novembro, com a carga horária total de 72 horas.",
    },
  ];
}
