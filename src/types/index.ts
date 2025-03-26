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

export interface Friend {
    id: string;
    name: string;
}

export interface Expense {
    id: string;
    description: string;
    amount: number;
    paidBy: string;
    participants: string[];
    date: string;
} 