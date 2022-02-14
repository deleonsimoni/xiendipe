import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ModalInscricaoComponent } from '../modal-inscricao/modal-inscricao.component';
import { ModalEixoComponent } from '../modal-eixo/modal-eixo.component';
import { ModalProgramacaoComponent } from '../modal-programacao/modal-programacao.component';
import { ModalNormasComponent } from '../modal-normas/modal-normas.component';
import { ModalApoiadoresComponent } from '../modal-apoiadores/modal-apoiadores.component';
import { ModalNormasRodaConversaComponent } from '../modal-normas/modal-mediador-conversa.component';
import { ModalNormasPainelComponent } from '../modal-normas/modal-expositor-painel.component';
import { ModalNormasMinicursoComponent } from '../modal-normas/modal-mediador-minu-curso.component';
import { ModalNormasPosterComponent } from '../modal-normas/modal-expositor-poster.component';
import { DownloadFileService } from '../services/download-file.service';
import { ToastrService } from 'ngx-toastr';
import { NoticiasService } from '../services/noticias.service';
import { ModalSessoesEspeciaisComponent } from '../modal-sessoes-especiais/modal-sessoes-especiais.component';
import { ModalSimposioComponent } from '../modal-simposio/modal-simposio.component';
import { ModalHospedagemComponent } from '../modal-hospedagem/modal-hospedagem.component';
import { ModalAlimentacaoComponent } from '../modal-alimentacao/modal-alimentacao.component';
import { ModalTransporteComponent } from '../modal-transporte/modal-transporte.component';
import { ModalTurismoComponent } from '../modal-turismo/modal-turismo.component';
import { ModalConferencistasComponent } from '../modal-conferencistas/modal-conferencistas.component';
import { PROGRAMACOES } from '../declarations';
import { ModalEncerramentoComponent } from '../modal-encerramento/modal-encerramento.component';
import { ModalAberturaComponent } from '../modal-abertura/modal-abertura.component';
import { AnaisService } from '../services/anais.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  subscriptionType: string;
  subscriptionValue: number;
  carregando = false;
  noticias = [];
  anais = [];

  configuracaoCarrossel = {
    nav: true,
    slideBy: 2,
    margin: 14,
    responsive: {
      '0': { items: 1, margin: 5 },
      '940': { items: 3, margin: 5 }
    }
  };

  instituicoes = [
    'Universidade Federal do Rio de Janeiro – UFRJ',
    /* 'Universidade Federal do Estado do Rio de Janeiro – UNIRIO',
     'Universidade Federal Fluminense – UFF',
     'Universidade Federal Rural do Rio de Janeiro – UFRRJ',
     'Universidade do Estado do Rio de Janeiro – UERJ',
     'Universidade Estácio de Sá – UNESA',
     'Universidade Católica de Petrópolis – UCP',
     'Pontifícia Universidade Católica do Rio de Janeiro – PUC-Rio',
     'Instituto Benjamim Constant – IBC',
     'Instituto Nacional de Educação de Surdos – INES',
     'Instituto Superior de Educação do Rio de Janeiro – ISERJ'*/
  ];

  coordenacoesGerais = [
    'Profa. Dra. Camila Lima Coimbra (UFU)',
    'Prof. Dr. Roberto Valdés Puentes'
  ];

  imagensApoiadores = [
    './assets/img/parceiros/ufrj2.png'

  ];

  imagensParcerias = [
    './assets/img/parcerias/CAPES.png'
  ];

  comites = [
    'Andrea Villela Mafra da Silva – ISERJ'

  ];

  secretarias = [
    'Silvana Mesquita – PUC-Rio'

  ];

  gruposDeTrabalho = [
    {
      nome: 'Apoio aos preletores',
      equipe: [
        'Patricia Bastos de Azevedo – UFRRJ (coord.)'


      ]
    },
    {
      nome: 'Atividades culturais',
      equipe: [
        'Sandra Maciel – UFF (coord.)'
      ]
    },
    {
      nome: 'Feira de Livros',
      equipe: [
        'Adriana Patricio Delgado – UFRJ (coord.)'


      ]
    },
    {
      nome: 'Gestão financeira',
      equipe: [
        'Giseli Barreto da Cruz – UFRJ (coord.)'

      ]
    },
    {
      nome: 'Inclusão & acessibilidade',
      equipe: [
        'Bianca Della Libera – IBC (coord.)'
      ]
    },
    {
      nome: 'Local & infraestrutura',
      equipe: [
        'Claudia de Oliveira Fernandes – UNIRIO (coord.)'

      ]
    },
    {
      nome: 'Material do congressista',
      equipe: [
        'Vania Finholdt Angelo Leite – FFP/UERJ (coord.)'

      ]
    },
    {
      nome: 'Programação',
      equipe: [
        'Luís Paulo Borges – EB/CAp UERJ (coord.)'

      ]
    },
    {
      nome: 'Publicações',
      equipe: [
        'Claudia de Oliveira Fernandes (UNIRIO)'

      ]
    },
    {
      nome: 'Relação com as redes de ensino',
      equipe: [
        'Claudia Miranda – UNIRIO (coord.)'

      ]
    },
    {
      nome: 'Serviço de monitoria e recepção',
      equipe: [
        'Cecília Silvano Batalha – EB/FME-Niterói (coord.)'

      ]
    },
    {
      nome: 'Imagem, Comunicação & Tecnologia',
      equipe: [
        'Mônica Vasconcellos – UFF (coord.)'

      ]
    },
    {
      nome: 'Secretaria Executiva',
      equipe: [
        'Silvana Mesquita – PUC-Rio (coord.)'

      ]
    },
  ];

  eixos = [
    {
      titulo: 'Eixo 1',
      tema: 'A Didática como campo epistemológico e disciplinar',
      temaCurto: 'com Formação docente',
      descricao: `Esse eixo temático.`,
      coordenacao: [
        'Alexandra Garcia Ferreira Lima – FFP/UERJ'

      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 2',
      tema: 'A Didática e os Saberes docentes estruturantes na formação de professores',
      temaCurto: 'com Currículo e Avaliação',
      descricao: `Esse eixo temático prioriza os currículos e as avaliações nos contextos históricos e contemporâneos;
     .`,
      coordenacao: [
        'Maria Inês Marcondes – PUC-Rio'

      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 3',
      tema: `A Didática e as tecnologias da informação e comunicação no currículo e práticas 
      `,
      temaCurto: `em Direitos Humanos, Interculturalidade e Religiões`,
      descricao: `Esse eixo temático prioriza as diferenças culturais que desafiam o cotidiano escolar;
      .`,
      coordenacao: [
        'Ana Ivenicki – UFRJ'
      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 4',
      tema: `A Didática e Práticas de Ensino na perspectiva da Educação como Direito Constitucional e os desafios políticos da atualidade 
       `,
      temaCurto: `entre Novas epistemologias, Diferença, Biodiversidade, Democracia e Inclusão`,
      descricao: `Esse eixo temático prioriza produções que, de uma perspectiva insurgente,
      .`,
      coordenacao: [
        'Inês Barbosa de Oliveira – UNESA'

      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 5',
      tema: `A Didática e as Práticas de ensino nas políticas de formação de Pedagogos(as) 
       `,
      temaCurto: `entre Educação, Comunicação e Tecnologia`,
      descricao: `Esse eixo temático prioriza o debate sobre educar com as mídias, para as mídias e pelas mídias;
      .`,
      coordenacao: [
        'Adriana Hoffman – UNIRIO'

      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 6',
      tema: `A Didática e as Práticas de Ensino nos cursos de Licenciatura: entre tensionamentos e perspectivas 
      `,
      temaCurto: `entre Infâncias, Juventudes e Vida Adulta`,
      descricao: `Esse eixo temático prioriza as abordagens teóricas, metodológicas e epistemológicas sobre infâncias,
      .`,
      coordenacao: [
        'Anelise Nascimento – UFRRJ'

      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 7',
      tema: `A Didática, Práticas de Ensino - Infâncias, Juventudes e Vida Adulta 
      `,
      temaCurto: `entre Infâncias, Juventudes e Vida Adulta`,
      descricao: `Esse eixo temático prioriza as abordagens teóricas, metodológicas e epistemológicas sobre infâncias,
     .`,
      coordenacao: [
        'Anelise Nascimento – UFRRJ'
      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 8',
      tema: `A Didática, Práticas de Ensino, Educação das Relações Étnico-raciais, Diversidade e Inclusão Escolar 
      `,
      temaCurto: `entre Infâncias, Juventudes e Vida Adulta`,
      descricao: `Esse eixo temático prioriza as abordagens teóricas, metodológicas e epistemológicas sobre infâncias,
      .`,
      coordenacao: [
        'Anelise Nascimento – UFRRJ'

      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 9',
      tema: `A Didática da Educação Superior 
     `,
      temaCurto: `entre Infâncias, Juventudes e Vida Adulta`,
      descricao: `Esse eixo temático prioriza as abordagens teóricas, metodológicas e epistemológicas sobre infâncias,
      `,
      coordenacao: [
        'Anelise Nascimento – UFRRJ'
      ],
      pareceristas: []
    }
  ];

  programacoes = PROGRAMACOES;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private download: DownloadFileService,
    private noticiasService: NoticiasService,
    private anaisService: AnaisService,
    private toastr: ToastrService,

  ) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const tree = this.router.parseUrl(this.router.url);
        if (tree.fragment) {
          const element = document.querySelector('#' + tree.fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
          }
        }
      }
    });

  }

  ngOnInit() {

    this.listarNoticias();

  }


  public listarNoticias() {
    this.noticiasService.listar()
      .subscribe((res: any) => {
        this.noticias = res;

        this.noticias.forEach(element => {
          element.description = this.urlify(element.description);
        });

      }, err => {
        this.toastr.error('Ocorreu um erro ao listar noticias', 'Atenção: ');
      });

    this.anaisService.listar()
      .subscribe((res: any) => {
        this.anais = res;
      }, err => {
        this.toastr.error('Ocorreu um erro ao listar anais', 'Atenção: ');
      });
  }

  urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
      return '<a target="_blank" href="' + url + '">' + url + '</a>';
    })
  }

  downloadTemplate(nameFile) {
    const vm = this;

    function sucessoDownload() {
      vm.carregando = false;
    }

    function falhaDownload(err) {
      if (err.status === 401) {
        vm.toastr.error('Você precisa estar logado para fazer o download', 'Atenção: ');
      } else {
        vm.toastr.error('Erro ao relizar download. Tente novamente mais tarde', 'Erro: ');
      }
      console.log(err);
      vm.carregando = false;
    }

    this.carregando = true;
    this.download.getFile(nameFile, sucessoDownload, falhaDownload);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalInscricaoComponent, {
      // width: '250px',
      data: { subscriptionType: this.subscriptionType, subscriptionValue: this.subscriptionValue }
    });

    dialogRef.afterClosed().subscribe();
  }

  public openDialogEixo(eixo) {
    const dialogRef = this.dialog.open(ModalEixoComponent, {
      data: { item: eixo }
    });
  }


  public openDialogProgramacao(programacao) {
    switch (programacao.titulo) {
      case 'Sessões especiais':
        this.dialog.open(ModalSessoesEspeciaisComponent, {
          data: { item: programacao }
        });
        break;

      case 'Simpósios':
        this.dialog.open(ModalSimposioComponent, {
          data: { item: programacao }
        });
        break;

      case 'Conferencistas':
        this.dialog.open(ModalConferencistasComponent);
        break;

      case 'Encerramento':
        this.dialog.open(ModalEncerramentoComponent, {
          data: { item: programacao }
        });
        break;

      case 'Abertura':
        this.dialog.open(ModalAberturaComponent, {
          data: { item: programacao }
        });
        break;

      default:
        this.dialog.open(ModalProgramacaoComponent, {
          data: { item: programacao }
        });
        break;
    }
  }

  public openDialogHospedagem() {
    const dialogRef = this.dialog.open(ModalHospedagemComponent);
  }

  public openDialogAlimentacao() {
    const dialogRef = this.dialog.open(ModalAlimentacaoComponent);
  }

  public openDialogTransporte() {
    const dialogRef = this.dialog.open(ModalTransporteComponent);
  }

  public openDialogTurismo() {
    const dialogRef = this.dialog.open(ModalTurismoComponent);
  }

  public openDialogNormas() {
    const dialogRef = this.dialog.open(ModalNormasComponent, {
      data: {},
      height: '550vh'
    });
  }

  public openDialogMinicurso() {
    const dialogRef = this.dialog.open(ModalNormasMinicursoComponent, {
      data: {},
      height: '550vh'
    });
  }

  public openDialogPainel() {
    const dialogRef = this.dialog.open(ModalNormasPainelComponent, {
      data: {},
      height: '550vh'
    });
  }

  public openDialogRoda() {
    const dialogRef = this.dialog.open(ModalNormasRodaConversaComponent, {
      data: {},
      height: '550vh'
    });
  }

  public openDialogPoster() {
    const dialogRef = this.dialog.open(ModalNormasPosterComponent, {
      data: {},
      height: '550vh'
    });
  }

  public openDialogApoiadores(apoiadores, imagens) {
    const dialogRef = this.dialog.open(ModalApoiadoresComponent, {
      data: { item: apoiadores, imagensApoiadores: imagens },
      height: '550vh'
    });
  }
}
