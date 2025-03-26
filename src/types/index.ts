export interface Participante {
  id: string;
  nome: string;
}

export interface Despesa {
  id: string;
  descricao: string;
  valorTotal: number;
  pagadorId: string;
  divisao: {
    participanteId: string;
    valor: number;
  }[];
}

export interface Transacao {
  de: string;
  para: string;
  valor: number;
} 