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
    'Universidade Federal do Estado do Rio de Janeiro – UNIRIO',
    'Universidade Federal Fluminense – UFF',
    'Universidade Federal Rural do Rio de Janeiro – UFRRJ',
    'Universidade do Estado do Rio de Janeiro – UERJ',
    'Universidade Estácio de Sá – UNESA',
    'Universidade Católica de Petrópolis – UCP',
    'Pontifícia Universidade Católica do Rio de Janeiro – PUC-Rio',
    'Instituto Benjamim Constant – IBC',
    'Instituto Nacional de Educação de Surdos – INES',
    'Instituto Superior de Educação do Rio de Janeiro – ISERJ'
  ];

  coordenacoesGerais = [
    'Andréa Rosana Fetzner – UNIRIO',
    'Antonio Flavio Barbosa Moreira – UCP',
    'Carmen Teresa Gabriel – UFRJ',
    'Claudia de Oliveira Fernandes – UNIRIO',
    'Giseli Barreto da Cruz – UFRJ',
    'Graça Regina Reis – EB/Cap-UFRJ',
    'Inês Barbosa de Oliveira – UNESA',
    'Maria Inês Marcondes – PUC-Rio',
    'Naiara Miranda Rust – IBC',
    'Rosanne Evangelista Dias – UERJ',
    'Vera Maria Ferrão Candau – PUC-Rio',
    'Yrlla Ribeiro de Oliveira Carneiro da Silva – INES'
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
    './assets/img/parcerias/Faculdade de Educação.jpg',
    './assets/img/parcerias/faperj.png',
    './assets/img/parcerias/FEBF.png',
    './assets/img/parcerias/FUJB.png',
    './assets/img/parcerias/UCP.jpg',
    './assets/img/parcerias/UERJ_LOGO_COR_TP.png',
    './assets/img/parcerias/UFRJ.png'
  ];

  comites = [
    'Andrea Villela Mafra da Silva – ISERJ',
    'Antonio Flavio Barbosa Moreira – UCP',
    'Claudia de Oliveira Fernandes – UNIRIO',
    'Claudia Miranda – UNIRIO',
    'Débora Barreiros – UERJ',
    'Edméa Oliveira dos Santos – UFRRJ',
    'Giseli Barreto da Cruz – UFRJ',
    'Inês Barbosa de Oliveira – UNESA',
    'Luis Paulo Cruz Borges – EB/CAp-UERJ',
    'Maria das Graças Nascimento – UFRJ',
    'Maria Inês Marcondes – PUC-Rio',
    'Mônica Vasconcellos – UFF',
    'Naiara Miranda Rust – IBC',
    'Patricia Bastos de Azevedo – UFRRJ',
    'Sandra Maciel – UFF',
    'Talita Vidal – FEBF/UERJ',
    'Vania Finholdt Angelo Leite – FFP/UERJ',
    'Vera Maria Ferrão Candau – PUC-Rio',
    'Yrlla Ribeiro de Oliveira Carneiro da Silva – INES'
  ];

  secretarias = [
    'Silvana Mesquita – PUC-Rio',
    'Helena Fontoura – FFP/UERJ',
    'Talita da Silva Campelo – EB/SME-Caxias'
  ];

  gruposDeTrabalho = [
    {
      nome: 'Apoio aos preletores',
      equipe: [
        'Patricia Bastos de Azevedo – UFRRJ (coord.)',
        'Andreia Gomes da Cruz – UFRRJ',
        'Felipe da Silva Ferreira – EB/CEFET-RJ',
        'Pedro Pinheiro Teixeira – PUC-Rio',
        'Priscila Monteiro Corrêa – FEBF/UERJ'

      ]
    },
    {
      nome: 'Atividades culturais',
      equipe: [
        'Sandra Maciel – UFF (coord.)',
        'Adrianne Ogeda – UNIRIO',
        'Cristiane Oliveira – EB/CPII',
        'Dagmar Melo Silva – UFF',
        'Flavia Barreto – FFP/UERJ',
        'Juliana Manhães – UNIRIO',
        'Lea Tiriba – UNIRIO',
        'Lucia Cavalieri – UFF',
        'Monique Andries Nogueira – UFRJ',
        'Silvia Soter – UFRJ',
        'Tatiana Bezerra Fagundes – EB/SME-Rio e FME-Niterói',
        'Wilson Cardoso Júnior – UFRJ'
      ]
    },
    {
      nome: 'Feira de Livros',
      equipe: [
        'Adriana Patricio Delgado – UFRJ (coord.)',
        'Elana Cristiana Costa – EB/FME-Niterói',
        'Rita de Cassia de Oliveira e Silva - UFRJ'

      ]
    },
    {
      nome: 'Gestão financeira',
      equipe: [
        'Giseli Barreto da Cruz – UFRJ (coord.)',
        'Elizabeth Macedo – UERJ',
        'Maria das Graças Nascimento – UFRJ',
        'Vera Maria Ferrão Candau – PUC-Rio'
      ]
    },
    {
      nome: 'Hospedagem, transporte & alimentação',
      equipe: [
        'Talita Vidal – FEBF/UERJ (coord.)',
        'Dinah Terra – UFF',
        'Fernanda Lahtermaher Oliveira – EB/CApU-UFRJ',
        'Rafaela Vilela – EB/EEI-UFRJ'
      ]
    },
    {
      nome: 'Inclusão & acessibilidade',
      equipe: [
        'Bianca Della Libera – IBC (coord.)',
        'Yrlla Ribeiro de Oliveira Carneiro da Silva – INES (coord)',
        'Adriana do Carmo Corrêa Gonçalves – FEBF/UERJ',
        'Érika Souza Leme – UFF',
        'Flavia Faissal de Souza – FEBF/UERJ',
        'Glauber de Souza Lemos - INES',
        'Helenice Maia – UNESA',
        'Karine Vieira da Rocha – INES'
      ]
    },
    {
      nome: 'Local & infraestrutura',
      equipe: [
        'Claudia de Oliveira Fernandes – UNIRIO (coord.)',
        'Andrea Villela Mafra da Silva – ISERJ (coord.)',
        'Alessandra do Nascimento dos Santos Moraes – EB/CAp-UFRJ',
        'Ana Teresa de Carvalho Corrêa de Oliveira – UFRJ',
        'Crizan Sasson Oliveira – EB/CAp-UERJ',
        'Luis Paulo Braga – IBC',
        'Maria de Fátima da Silva – EB/FME-Niterói',
        'Nizia Ponte – ISERJ'
      ]
    },
    {
      nome: 'Material do congressista',
      equipe: [
        'Vania Finholdt Angelo Leite – FFP/UERJ (coord.)',
        'Alice Akemi Yamasaki – UFF',
        'Cristina Spolidoro Freund – EB/CPII',
        'Dinah Terra – UFF',
      ]
    },
    {
      nome: 'Programação',
      equipe: [
        'Luís Paulo Borges – EB/CAp UERJ (coord.)',
        'Adriana Patrício Delgado – UFRJ',
        'Bonier Axer – EB/CAp-UERJ',
        'Daniela Frida Drelich Valentim – UERJ',
        'Isabel Martins – UFRJ',
        'Lea Tiriba – UNIRIO',
        'Ludmila Thomé de Andrade – UFRJ',
        'Luiza Alves de Oliveira – UFRRJ'
      ]
    },
    {
      nome: 'Publicações',
      equipe: [
        'Claudia de Oliveira Fernandes (UNIRIO)',
        'Giseli Barreto da Cruz (UFRJ)',
        'Helena Fontoura (FFP UERJ)',
        'Luís Paulo Cruz Borges (EB)',
        'Silvana Mesquita (PUC-Rio)',
        'Vera Maria Ferrão Candau (PUC-Rio)',
      ]
    },
    {
      nome: 'Relação com as redes de ensino',
      equipe: [
        'Claudia Miranda – UNIRIO (coord.)',
        'Maria das Graças Nascimento – UFRJ (coord.)',
        'Alexandra Garcia – FFP/UERJ',
        'Elana Cristiana Costa – EB/FME-Niterói',
        'Marcella da Silva Estevez Pacheco Guedes – FEBF/UERJ',
        'Marize Peixoto da Silva Figueiredo – FEBF/UERJ',
        'Mônica dos Santos Toledo – EB/COLUNI/UFF',
        'Patricia Coelho da Costa – PUC-Rio',
        'Rejany dos Santos Dominick – UFF',
      ]
    },
    {
      nome: 'Serviço de monitoria e recepção',
      equipe: [
        'Cecília Silvano Batalha – EB/FME-Niterói (coord.)',
        'Aline Crispin – EB/EEI-UFRJ',
        'Daniela de Oliveira Guimarães – UFRJ',
        'Erika Souza Leme – UFF'
      ]
    },
    {
      nome: 'Imagem, Comunicação & Tecnologia',
      equipe: [
        'Mônica Vasconcellos – UFF (coord.)',
        'Edméa Oliveira Santos – UFRRJ (coord.)',
        'Silvana Mesquita – PUC-Rio (coord.)',
        'Bosco Mesquita (design gráfico)',
        'Edna Regina Aguiar – EB/COLUNI/UFF',
        'Felipe da Silva Ferreira – EB/CEFET-RJ',
        'Fernanda Lahtermaher Oliveira – EB/CAp-UFRJ',
        'Helen Pereira Ferreira – UFF',
        'Marcia Maria e Silva – UFF',
        'Priscila Andrade Rodrigues – UFRJ',
        'Talita da Silva Campelo – EB/SME-Caxias'

      ]
    },
    {
      nome: 'Secretaria Executiva',
      equipe: [
        'Silvana Mesquita – PUC-Rio (coord.)',
        'Helena Amaral Fontoura – FFP/UERJ (coord.)',
        'Talita da Silva Campelo – EB/SME-Caxias',
        'Alessandra do Nascimento dos Santos Moraes – EB/CAp-UFRJ (Apoio Técnico)',
        'Cristina Lucia Lima Alves (Apoio Técnico)',
        'Leticia Mesquita (Apoio Técnico)',
        'Leticia Oliveira (Apoio Técnico)'
      ]
    },
  ];

  eixos = [
    {
      titulo: 'Eixo 1',
      tema: 'A Didática como campo epistemológico e disciplinar <span class="red" id="red">Formação docente</span>',
      temaCurto: 'com Formação docente',
      descricao: `Esse eixo temático prioriza as políticas de formação docente e os desafios de sua implementação,
      permanência e consolidação; concepções de formação de professores; formação centrada na escola e espaços colaborativos de formação;
      formação inicial e continuada; estágios curriculares e parcerias com as escolas; didáticas nos cursos de formação de professores;
      estratégias formativas e mediações didáticas; formação presencial, semipresencial e a distância; narrativas:
      investigação e formação de professores;
      metodologias e práticas curriculares de formação docente.`,
      coordenacao: [
        'Alexandra Garcia Ferreira Lima – FFP/UERJ',
        'Graça Regina Reis – CAp UFRJ',
        'Maria das Graças Chagas de Arruda Nascimento - UFRJ',
        'Naiara Miranda Rust – IBC',
        'Victor Giraldo – UFRJ'
      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 2',
      tema: 'A Didática e os Saberes docentes estruturantes na formação de professores <span class="red" id="red">Currículo e Avaliação</span>',
      temaCurto: 'com Currículo e Avaliação',
      descricao: `Esse eixo temático prioriza os currículos e as avaliações nos contextos históricos e contemporâneos;
      políticas curriculares, as escolas e as salas de aula; culturas, conhecimentos e currículos; aprendizagens, currículos e avaliações;
      políticas de avaliação, as escolas e as salas de aula; culturas, conhecimentos e as diferentes dimensões da avaliação:
      políticas, sociais, pedagógicas e curriculares; metodologias e práticas curriculares e avaliativas.`,
      coordenacao: [
        'Maria Inês Marcondes – PUC-Rio',
        'Rosanne Evangelista Dias – UERJ',
        'Vania Finholdt Angelo Leite – FFP/UERJ'
      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 3',
      tema: `A Didática e as tecnologias da informação e comunicação no currículo e práticas  <span class="red" id="red">Direitos Humanos,
       Interculturalidade e Religiões</span>`,
      temaCurto: `em Direitos Humanos, Interculturalidade e Religiões`,
      descricao: `Esse eixo temático prioriza as diferenças culturais que desafiam o cotidiano escolar;
      relações entre diferenças, direitos humanos e processos de ensino-aprendizagem; questões religiosas,
      interculturalidade e didática; articulação entre igualdade e diferença nas práticas pedagógicas,
      construindo processos educativos que questionam as lógicas dominantes e empoderem sujeitos subalternizados,
      seus saberes e práticas; metodologias e práticas curriculares em Direitos Humanos, Interculturalidade e Religiões.`,
      coordenacao: [
        'Ana Ivenicki – UFRJ',
        'Andréa Rosana Fetzner – UNIRIO',
        'Vera Maria Ferrão Candau – PUC-Rio'
      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 4',
      tema: `A Didática e Práticas de Ensino na perspectiva da Educação como Direito Constitucional e os desafios políticos da atualidade <span class="red" id="red">Novas epistemologias,
       Diferença, Biodiversidade, Democracia e Inclusão</span>`,
      temaCurto: `entre Novas epistemologias, Diferença, Biodiversidade, Democracia e Inclusão`,
      descricao: `Esse eixo temático prioriza produções que, de uma perspectiva insurgente,
      lançam mão de novas epistemologias para pensar as tensões e desafios educacionais no contexto atual;
      reflexões e pesquisas que apostam na potência de projetos e práticas cotidianas que assumem a tessitura da escola democrática
      como devir e como possibilidade; processo que só pode se viabilizar com e na diferença, no respeito mútuo, no cuidado de
      todas as formas de vida, não apenas a humana, e na valorização da alteridade, numa perspectiva inclusiva.`,
      coordenacao: [
        'Inês Barbosa de Oliveira – UNESA',
        'Marcia Pletsch – UFRRJ',
        'Talita Vidal Pereira – FEBF/UERJ',
        'Yrlla Ribeiro de Oliveira Carneiro da Silva – INES'
      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 5',
      tema: `A Didática e as Práticas de ensino nas políticas de formação de Pedagogos(as) <span class="red" id="red">Educação,
       Comunicação e Tecnologia</span>`,
      temaCurto: `entre Educação, Comunicação e Tecnologia`,
      descricao: `Esse eixo temático prioriza o debate sobre educar com as mídias, para as mídias e pelas mídias;
      imagens, literacias e linguagens multimodais nas práticas pedagógicas e na formação de professores;
      cinema e educação; a informática na educação: a didática e o pensamento computacional na escola básica
      e na formação de professores; potenciais das mídias digitais em rede para as didáticas e as práticas
      educativas nas múltiplas redes educativas; educação online: dos ambientes virtuais de aprendizagens às
      práticas de app-learning; educar em tempos de fake news, fazeressaberes didáticos; educação e Cibercultura;
      políticas de formação na interface Educação e Comunicação.`,
      coordenacao: [
        'Adriana Hoffman – UNIRIO',
        'Edméa Oliveira dos Santos – UFRRJ',
        'Walcea Barreto Alves – UFF'
      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 6',
      tema: `A Didática e as Práticas de Ensino nos cursos de Licenciatura: entre tensionamentos e perspectivas <span class="red" id="red">Infâncias,
      Juventudes e Vida Adulta</span>`,
      temaCurto: `entre Infâncias, Juventudes e Vida Adulta`,
      descricao: `Esse eixo temático prioriza as abordagens teóricas, metodológicas e epistemológicas sobre infâncias,
      juventudes e vida adulta e sua relação com a educação; políticas públicas de educação para bebês, crianças, jovens,
      adultos e idosos; perspectivas de futuro, garantia de direitos e vulnerabilidade das infâncias e juventudes pobres no Brasil;
      estudantes imigrantes e filhos de mulheres e adolescentes privadas de liberdade; insurgências nas práticas pedagógicas cotidianas;
      metodologias e práticas de ensino com crianças, jovens, adultos e idosos; conflitos nas relações intergeracionais;
      programas de governo, movimentos sociais e a sociedade civil nas ações educativas.`,
      coordenacao: [
        'Anelise Nascimento – UFRRJ',
        'Patricia Baroni – UFRJ',
        'Wânia Gonzalez – UNESA'
      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 7',
      tema: `A Didática, Práticas de Ensino - Infâncias, Juventudes e Vida Adulta <span class="red" id="red">Infâncias,
      Juventudes e Vida Adulta</span>`,
      temaCurto: `entre Infâncias, Juventudes e Vida Adulta`,
      descricao: `Esse eixo temático prioriza as abordagens teóricas, metodológicas e epistemológicas sobre infâncias,
      juventudes e vida adulta e sua relação com a educação; políticas públicas de educação para bebês, crianças, jovens,
      adultos e idosos; perspectivas de futuro, garantia de direitos e vulnerabilidade das infâncias e juventudes pobres no Brasil;
      estudantes imigrantes e filhos de mulheres e adolescentes privadas de liberdade; insurgências nas práticas pedagógicas cotidianas;
      metodologias e práticas de ensino com crianças, jovens, adultos e idosos; conflitos nas relações intergeracionais;
      programas de governo, movimentos sociais e a sociedade civil nas ações educativas.`,
      coordenacao: [
        'Anelise Nascimento – UFRRJ',
        'Patricia Baroni – UFRJ',
        'Wânia Gonzalez – UNESA'
      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 8',
      tema: `A Didática, Práticas de Ensino, Educação das Relações Étnico-raciais, Diversidade e Inclusão Escolar <span class="red" id="red">Infâncias,
      Juventudes e Vida Adulta</span>`,
      temaCurto: `entre Infâncias, Juventudes e Vida Adulta`,
      descricao: `Esse eixo temático prioriza as abordagens teóricas, metodológicas e epistemológicas sobre infâncias,
      juventudes e vida adulta e sua relação com a educação; políticas públicas de educação para bebês, crianças, jovens,
      adultos e idosos; perspectivas de futuro, garantia de direitos e vulnerabilidade das infâncias e juventudes pobres no Brasil;
      estudantes imigrantes e filhos de mulheres e adolescentes privadas de liberdade; insurgências nas práticas pedagógicas cotidianas;
      metodologias e práticas de ensino com crianças, jovens, adultos e idosos; conflitos nas relações intergeracionais;
      programas de governo, movimentos sociais e a sociedade civil nas ações educativas.`,
      coordenacao: [
        'Anelise Nascimento – UFRRJ',
        'Patricia Baroni – UFRJ',
        'Wânia Gonzalez – UNESA'
      ],
      pareceristas: []
    },
    {
      titulo: 'Eixo 9',
      tema: `A Didática da Educação Superior <span class="red" id="red">Infâncias,
      Juventudes e Vida Adulta</span>`,
      temaCurto: `entre Infâncias, Juventudes e Vida Adulta`,
      descricao: `Esse eixo temático prioriza as abordagens teóricas, metodológicas e epistemológicas sobre infâncias,
      juventudes e vida adulta e sua relação com a educação; políticas públicas de educação para bebês, crianças, jovens,
      adultos e idosos; perspectivas de futuro, garantia de direitos e vulnerabilidade das infâncias e juventudes pobres no Brasil;
      estudantes imigrantes e filhos de mulheres e adolescentes privadas de liberdade; insurgências nas práticas pedagógicas cotidianas;
      metodologias e práticas de ensino com crianças, jovens, adultos e idosos; conflitos nas relações intergeracionais;
      programas de governo, movimentos sociais e a sociedade civil nas ações educativas.`,
      coordenacao: [
        'Anelise Nascimento – UFRRJ',
        'Patricia Baroni – UFRJ',
        'Wânia Gonzalez – UNESA'
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
