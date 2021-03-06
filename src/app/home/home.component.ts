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
    'Universidade Federal do Rio de Janeiro ??? UFRJ',
    'Universidade Federal do Estado do Rio de Janeiro ??? UNIRIO',
    'Universidade Federal Fluminense ??? UFF',
    'Universidade Federal Rural do Rio de Janeiro ??? UFRRJ',
    'Universidade do Estado do Rio de Janeiro ??? UERJ',
    'Universidade Est??cio de S?? ??? UNESA',
    'Universidade Cat??lica de Petr??polis ??? UCP',
    'Pontif??cia Universidade Cat??lica do Rio de Janeiro ??? PUC-Rio',
    'Instituto Benjamim Constant ??? IBC',
    'Instituto Nacional de Educa????o de Surdos ??? INES',
    'Instituto Superior de Educa????o do Rio de Janeiro ??? ISERJ'
  ];

  coordenacoesGerais = [
    'Andr??a Rosana Fetzner ??? UNIRIO',
    'Antonio Flavio Barbosa Moreira ??? UCP',
    'Carmen Teresa Gabriel ??? UFRJ',
    'Claudia de Oliveira Fernandes ??? UNIRIO',
    'Giseli Barreto da Cruz ??? UFRJ',
    'Gra??a Regina Reis ??? EB/Cap-UFRJ',
    'In??s Barbosa de Oliveira ??? UNESA',
    'Maria In??s Marcondes ??? PUC-Rio',
    'Naiara Miranda Rust ??? IBC',
    'Rosanne Evangelista Dias ??? UERJ',
    'Vera Maria Ferr??o Candau ??? PUC-Rio',
    'Yrlla Ribeiro de Oliveira Carneiro da Silva ??? INES'
  ];

  imagensApoiadores = [
    './assets/img/parceiros/ufrj2.png',
    './assets/img/parceiros/unirio.png',
    './assets/img/parceiros/ufrrj.png',
    './assets/img/parceiros/uff.png',
    './assets/img/parceiros/uerj.png',
    './assets/img/parceiros/ucp.png',
    './assets/img/parceiros/puc.png',
    './assets/img/parceiros/iserj.png',
    './assets/img/parceiros/ines.png',
    './assets/img/parceiros/febf.png',
    './assets/img/parceiros/estacio.png',
    './assets/img/parceiros/assb.png',
  ];

  imagensParcerias = [
    './assets/img/parcerias/CAPES.png',
    './assets/img/parcerias/cnpq.png',
    './assets/img/parcerias/Faculdade de Educa????o.jpg',
    './assets/img/parcerias/faperj.png',
    './assets/img/parcerias/FEBF.png',
    './assets/img/parcerias/FUJB.png',
    './assets/img/parcerias/UCP.jpg',
    './assets/img/parcerias/UERJ_LOGO_COR_TP.png',
    './assets/img/parcerias/UFRJ.png'
  ];

  comites = [
    'Andrea Villela Mafra da Silva ??? ISERJ',
    'Antonio Flavio Barbosa Moreira ??? UCP',
    'Claudia de Oliveira Fernandes ??? UNIRIO',
    'Claudia Miranda ??? UNIRIO',
    'D??bora Barreiros ??? UERJ',
    'Edm??a Oliveira dos Santos ??? UFRRJ',
    'Giseli Barreto da Cruz ??? UFRJ',
    'In??s Barbosa de Oliveira ??? UNESA',
    'Luis Paulo Cruz Borges ??? EB/CAp-UERJ',
    'Maria das Gra??as Nascimento ??? UFRJ',
    'Maria In??s Marcondes ??? PUC-Rio',
    'M??nica Vasconcellos ??? UFF',
    'Naiara Miranda Rust ??? IBC',
    'Patricia Bastos de Azevedo ??? UFRRJ',
    'Sandra Maciel ??? UFF',
    'Talita Vidal ??? FEBF/UERJ',
    'Vania Finholdt Angelo Leite ??? FFP/UERJ',
    'Vera Maria Ferr??o Candau ??? PUC-Rio',
    'Yrlla Ribeiro de Oliveira Carneiro da Silva ??? INES'
  ];

  secretarias = [
    'Silvana Mesquita ??? PUC-Rio',
    'Helena Fontoura ??? FFP/UERJ',
    'Talita da Silva Campelo ??? EB/SME-Caxias'
  ];

  gruposDeTrabalho = [
    {
      nome: 'Apoio aos preletores',
      equipe: [
        'Patricia Bastos de Azevedo ??? UFRRJ (coord.)',
        'Andreia Gomes da Cruz ??? UFRRJ',
        'Felipe da Silva Ferreira ??? EB/CEFET-RJ',
        'Pedro Pinheiro Teixeira ??? PUC-Rio',
        'Priscila Monteiro Corr??a ??? FEBF/UERJ'

      ]
    },
    {
      nome: 'Atividades culturais',
      equipe: [
        'Sandra Maciel ??? UFF (coord.)',
        'Adrianne Ogeda ??? UNIRIO',
        'Cristiane Oliveira ??? EB/CPII',
        'Dagmar Melo Silva ??? UFF',
        'Flavia Barreto ??? FFP/UERJ',
        'Juliana Manh??es ??? UNIRIO',
        'Lea Tiriba ??? UNIRIO',
        'Lucia Cavalieri ??? UFF',
        'Monique Andries Nogueira ??? UFRJ',
        'Silvia Soter ??? UFRJ',
        'Tatiana Bezerra Fagundes ??? EB/SME-Rio e FME-Niter??i',
        'Wilson Cardoso J??nior ??? UFRJ'
      ]
    },
    {
      nome: 'Feira de Livros',
      equipe: [
        'Adriana Patricio Delgado ??? UFRJ (coord.)',
        'Elana Cristiana Costa ??? EB/FME-Niter??i',
        'Rita de Cassia de Oliveira e Silva - UFRJ'

      ]
    },
    {
      nome: 'Gest??o financeira',
      equipe: [
        'Giseli Barreto da Cruz ??? UFRJ (coord.)',
        'Elizabeth Macedo ??? UERJ',
        'Maria das Gra??as Nascimento ??? UFRJ',
        'Vera Maria Ferr??o Candau ??? PUC-Rio'
      ]
    },
    {
      nome: 'Hospedagem, transporte & alimenta????o',
      equipe: [
        'Talita Vidal ??? FEBF/UERJ (coord.)',
        'Dinah Terra ??? UFF',
        'Fernanda Lahtermaher Oliveira ??? EB/CApU-UFRJ',
        'Rafaela Vilela ??? EB/EEI-UFRJ'
      ]
    },
    {
      nome: 'Inclus??o & acessibilidade',
      equipe: [
        'Bianca Della Libera ??? IBC (coord.)',
        'Yrlla Ribeiro de Oliveira Carneiro da Silva ??? INES (coord)',
        'Adriana do Carmo Corr??a Gon??alves ??? FEBF/UERJ',
        '??rika Souza Leme ??? UFF',
        'Flavia Faissal de Souza ??? FEBF/UERJ',
        'Glauber de Souza Lemos - INES',
        'Helenice Maia ??? UNESA',
        'Karine Vieira da Rocha ??? INES'
      ]
    },
    {
      nome: 'Local & infraestrutura',
      equipe: [
        'Claudia de Oliveira Fernandes ??? UNIRIO (coord.)',
        'Andrea Villela Mafra da Silva ??? ISERJ (coord.)',
        'Alessandra do Nascimento dos Santos Moraes ??? EB/CAp-UFRJ',
        'Ana Teresa de Carvalho Corr??a de Oliveira ??? UFRJ',
        'Crizan Sasson Oliveira ??? EB/CAp-UERJ',
        'Luis Paulo Braga ??? IBC',
        'Maria de F??tima da Silva ??? EB/FME-Niter??i',
        'Nizia Ponte ??? ISERJ'
      ]
    },
    {
      nome: 'Material do congressista',
      equipe: [
        'Vania Finholdt Angelo Leite ??? FFP/UERJ (coord.)',
        'Alice Akemi Yamasaki ??? UFF',
        'Cristina Spolidoro Freund ??? EB/CPII',
        'Dinah Terra ??? UFF',
      ]
    },
    {
      nome: 'Programa????o',
      equipe: [
        'Lu??s Paulo Borges ??? EB/CAp UERJ (coord.)',
        'Adriana Patr??cio Delgado ??? UFRJ',
        'Bonier Axer ??? EB/CAp-UERJ',
        'Daniela Frida Drelich Valentim ??? UERJ',
        'Isabel Martins ??? UFRJ',
        'Lea Tiriba ??? UNIRIO',
        'Ludmila Thom?? de Andrade ??? UFRJ',
        'Luiza Alves de Oliveira ??? UFRRJ'
      ]
    },
    {
      nome: 'Publica????es',
      equipe: [
        'Claudia de Oliveira Fernandes (UNIRIO)',
        'Giseli Barreto da Cruz (UFRJ)',
        'Helena Fontoura (FFP UERJ)',
        'Lu??s Paulo Cruz Borges (EB)',
        'Silvana Mesquita (PUC-Rio)',
        'Vera Maria Ferr??o Candau (PUC-Rio)',
      ]
    },
    {
      nome: 'Rela????o com as redes de ensino',
      equipe: [
        'Claudia Miranda ??? UNIRIO (coord.)',
        'Maria das Gra??as Nascimento ??? UFRJ (coord.)',
        'Alexandra Garcia ??? FFP/UERJ',
        'Elana Cristiana Costa ??? EB/FME-Niter??i',
        'Marcella da Silva Estevez Pacheco Guedes ??? FEBF/UERJ',
        'Marize Peixoto da Silva Figueiredo ??? FEBF/UERJ',
        'M??nica dos Santos Toledo ??? EB/COLUNI/UFF',
        'Patricia Coelho da Costa ??? PUC-Rio',
        'Rejany dos Santos Dominick ??? UFF',
      ]
    },
    {
      nome: 'Servi??o de monitoria e recep????o',
      equipe: [
        'Cec??lia Silvano Batalha ??? EB/FME-Niter??i (coord.)',
        'Aline Crispin ??? EB/EEI-UFRJ',
        'Daniela de Oliveira Guimar??es ??? UFRJ',
        'Erika Souza Leme ??? UFF'
      ]
    },
    {
      nome: 'Imagem, Comunica????o & Tecnologia',
      equipe: [
        'M??nica Vasconcellos ??? UFF (coord.)',
        'Edm??a Oliveira Santos ??? UFRRJ (coord.)',
        'Silvana Mesquita ??? PUC-Rio (coord.)',
        'Bosco Mesquita (design gr??fico)',
        'Edna Regina Aguiar ??? EB/COLUNI/UFF',
        'Felipe da Silva Ferreira ??? EB/CEFET-RJ',
        'Fernanda Lahtermaher Oliveira ??? EB/CAp-UFRJ',
        'Helen Pereira Ferreira ??? UFF',
        'Marcia Maria e Silva ??? UFF',
        'Priscila Andrade Rodrigues ??? UFRJ',
        'Talita da Silva Campelo ??? EB/SME-Caxias'

      ]
    },
    {
      nome: 'Secretaria Executiva',
      equipe: [
        'Silvana Mesquita ??? PUC-Rio (coord.)',
        'Helena Amaral Fontoura ??? FFP/UERJ (coord.)',
        'Talita da Silva Campelo ??? EB/SME-Caxias',
        'Alessandra do Nascimento dos Santos Moraes ??? EB/CAp-UFRJ (Apoio T??cnico)',
        'Cristina Lucia Lima Alves (Apoio T??cnico)',
        'Leticia Mesquita (Apoio T??cnico)',
        'Leticia Oliveira (Apoio T??cnico)'
      ]
    },
  ];

  eixos = [
    {
      titulo: 'Eixo 1',
      tema: 'Did??tica(s) entre di??logos, insurg??ncias e pol??ticas: tens??es e perspectivas na rela????o com <span class="red" id="red">Forma????o docente</span>',
      temaCurto: 'com Forma????o docente',
      descricao: `Esse eixo tem??tico prioriza as pol??ticas de forma????o docente e os desafios de sua implementa????o,
      perman??ncia e consolida????o; concep????es de forma????o de professores; forma????o centrada na escola e espa??os colaborativos de forma????o;
      forma????o inicial e continuada; est??gios curriculares e parcerias com as escolas; did??ticas nos cursos de forma????o de professores;
      estrat??gias formativas e media????es did??ticas; forma????o presencial, semipresencial e a dist??ncia; narrativas:
      investiga????o e forma????o de professores;
      metodologias e pr??ticas curriculares de forma????o docente.`,
      coordenacao: [
        'Alexandra Garcia Ferreira Lima ??? FFP/UERJ',
        'Gra??a Regina Reis ??? CAp UFRJ',
        'Maria das Gra??as Chagas de Arruda Nascimento - UFRJ',
        'Naiara Miranda Rust ??? IBC',
        'Victor Giraldo ??? UFRJ'
      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 2',
      tema: 'Did??tica(s) entre di??logos, insurg??ncias e pol??ticas: tens??es e perspectivas na rela????o com <span class="red" id="red">Curr??culo e Avalia????o</span>',
      temaCurto: 'com Curr??culo e Avalia????o',
      descricao: `Esse eixo tem??tico prioriza os curr??culos e as avalia????es nos contextos hist??ricos e contempor??neos;
      pol??ticas curriculares, as escolas e as salas de aula; culturas, conhecimentos e curr??culos; aprendizagens, curr??culos e avalia????es;
      pol??ticas de avalia????o, as escolas e as salas de aula; culturas, conhecimentos e as diferentes dimens??es da avalia????o:
      pol??ticas, sociais, pedag??gicas e curriculares; metodologias e pr??ticas curriculares e avaliativas.`,
      coordenacao: [
        'Maria In??s Marcondes ??? PUC-Rio',
        'Rosanne Evangelista Dias ??? UERJ',
        'Vania Finholdt Angelo Leite ??? FFP/UERJ'
      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 3',
      tema: `Did??tica(s) entre di??logos, insurg??ncias e pol??ticas: tens??es e perspectivas na rela????o em <span class="red" id="red">Direitos Humanos,
       Interculturalidade e Religi??es</span>`,
      temaCurto: `em Direitos Humanos, Interculturalidade e Religi??es`,
      descricao: `Esse eixo tem??tico prioriza as diferen??as culturais que desafiam o cotidiano escolar;
      rela????es entre diferen??as, direitos humanos e processos de ensino-aprendizagem; quest??es religiosas,
      interculturalidade e did??tica; articula????o entre igualdade e diferen??a nas pr??ticas pedag??gicas,
      construindo processos educativos que questionam as l??gicas dominantes e empoderem sujeitos subalternizados,
      seus saberes e pr??ticas; metodologias e pr??ticas curriculares em Direitos Humanos, Interculturalidade e Religi??es.`,
      coordenacao: [
        'Ana Ivenicki ??? UFRJ',
        'Andr??a Rosana Fetzner ??? UNIRIO',
        'Vera Maria Ferr??o Candau ??? PUC-Rio'
      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 4',
      tema: `Did??tica(s) entre di??logos, insurg??ncias e pol??ticas: tens??es e perspectivas na rela????o entre <span class="red" id="red">Novas epistemologias,
       Diferen??a, Biodiversidade, Democracia e Inclus??o</span>`,
      temaCurto: `entre Novas epistemologias, Diferen??a, Biodiversidade, Democracia e Inclus??o`,
      descricao: `Esse eixo tem??tico prioriza produ????es que, de uma perspectiva insurgente,
      lan??am m??o de novas epistemologias para pensar as tens??es e desafios educacionais no contexto atual;
      reflex??es e pesquisas que apostam na pot??ncia de projetos e pr??ticas cotidianas que assumem a tessitura da escola democr??tica
      como devir e como possibilidade; processo que s?? pode se viabilizar com e na diferen??a, no respeito m??tuo, no cuidado de
      todas as formas de vida, n??o apenas a humana, e na valoriza????o da alteridade, numa perspectiva inclusiva.`,
      coordenacao: [
        'In??s Barbosa de Oliveira ??? UNESA',
        'Marcia Pletsch ??? UFRRJ',
        'Talita Vidal Pereira ??? FEBF/UERJ',
        'Yrlla Ribeiro de Oliveira Carneiro da Silva ??? INES'
      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 5',
      tema: `Did??tica(s) entre di??logos, insurg??ncias e pol??ticas: tens??es e perspectivas na rela????o entre <span class="red" id="red">Educa????o,
       Comunica????o e Tecnologia</span>`,
      temaCurto: `entre Educa????o, Comunica????o e Tecnologia`,
      descricao: `Esse eixo tem??tico prioriza o debate sobre educar com as m??dias, para as m??dias e pelas m??dias;
      imagens, literacias e linguagens multimodais nas pr??ticas pedag??gicas e na forma????o de professores;
      cinema e educa????o; a inform??tica na educa????o: a did??tica e o pensamento computacional na escola b??sica
      e na forma????o de professores; potenciais das m??dias digitais em rede para as did??ticas e as pr??ticas
      educativas nas m??ltiplas redes educativas; educa????o online: dos ambientes virtuais de aprendizagens ??s
      pr??ticas de app-learning; educar em tempos de fake news, fazeressaberes did??ticos; educa????o e Cibercultura;
      pol??ticas de forma????o na interface Educa????o e Comunica????o.`,
      coordenacao: [
        'Adriana Hoffman ??? UNIRIO',
        'Edm??a Oliveira dos Santos ??? UFRRJ',
        'Walcea Barreto Alves ??? UFF'
      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 6',
      tema: `Did??tica(s) entre di??logos, insurg??ncias e pol??ticas: tens??es e perspectivas na rela????o entre <span class="red" id="red">Inf??ncias,
      Juventudes e Vida Adulta</span>`,
      temaCurto: `entre Inf??ncias, Juventudes e Vida Adulta`,
      descricao: `Esse eixo tem??tico prioriza as abordagens te??ricas, metodol??gicas e epistemol??gicas sobre inf??ncias,
      juventudes e vida adulta e sua rela????o com a educa????o; pol??ticas p??blicas de educa????o para beb??s, crian??as, jovens,
      adultos e idosos; perspectivas de futuro, garantia de direitos e vulnerabilidade das inf??ncias e juventudes pobres no Brasil;
      estudantes imigrantes e filhos de mulheres e adolescentes privadas de liberdade; insurg??ncias nas pr??ticas pedag??gicas cotidianas;
      metodologias e pr??ticas de ensino com crian??as, jovens, adultos e idosos; conflitos nas rela????es intergeracionais;
      programas de governo, movimentos sociais e a sociedade civil nas a????es educativas.`,
      coordenacao: [
        'Anelise Nascimento ??? UFRRJ',
        'Patricia Baroni ??? UFRJ',
        'W??nia Gonzalez ??? UNESA'
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
        this.toastr.error('Ocorreu um erro ao listar noticias', 'Aten????o: ');
      });

    this.anaisService.listar()
      .subscribe((res: any) => {
        this.anais = res;
      }, err => {
        this.toastr.error('Ocorreu um erro ao listar anais', 'Aten????o: ');
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
        vm.toastr.error('Voc?? precisa estar logado para fazer o download', 'Aten????o: ');
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
      case 'Sess??es especiais':
        this.dialog.open(ModalSessoesEspeciaisComponent, {
          data: { item: programacao }
        });
        break;

      case 'Simp??sios':
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
