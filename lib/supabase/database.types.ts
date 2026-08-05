export type StatusInscricao =
  | "aguardando_pagamento"
  | "confirmada"
  | "cancelada"
  | "lista_de_espera";

export type StatusPagamento = "pendente" | "confirmado" | "isento" | "cancelado";

export type Inscricao = {
  id: string;
  codigo: string;
  nome_completo: string;
  data_nascimento: string;
  telefone: string;
  email: string | null;
  igreja: string | null;
  cidade: string;
  restricao_alimentar: string | null;
  necessidade_acessibilidade: string | null;
  observacoes: string | null;
  consentimento_privacidade: boolean;
  status_inscricao: StatusInscricao;
  status_pagamento: StatusPagamento;
  valor_inscricao: number;
  data_confirmacao_pagamento: string | null;
  observacoes_administrativas: string | null;
  created_at: string;
  updated_at: string;
};

export type InscricaoInsert = Pick<
  Inscricao,
  | "nome_completo"
  | "data_nascimento"
  | "telefone"
  | "cidade"
  | "consentimento_privacidade"
> &
  Partial<
    Pick<
      Inscricao,
      | "email"
      | "igreja"
      | "restricao_alimentar"
      | "necessidade_acessibilidade"
      | "observacoes"
    >
  >;

export type Administrador = {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  created_at: string;
};

export type AuditoriaInscricao = {
  id: string;
  inscricao_id: string;
  administrador_id: string | null;
  campo_alterado: string;
  valor_anterior: string | null;
  valor_novo: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      inscricoes: {
        Row: Inscricao;
        Insert: Partial<Inscricao> & InscricaoInsert;
        Update: Partial<Inscricao>;
        Relationships: [];
      };
      administradores: {
        Row: Administrador;
        Insert: Partial<Administrador> & Pick<Administrador, "id" | "email">;
        Update: Partial<Administrador>;
        Relationships: [];
      };
      auditoria_inscricoes: {
        Row: AuditoriaInscricao;
        Insert: Partial<AuditoriaInscricao> &
          Pick<AuditoriaInscricao, "inscricao_id" | "campo_alterado">;
        Update: Partial<AuditoriaInscricao>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
