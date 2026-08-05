import { z } from "zod";

function apenasDigitos(valor: string) {
  return valor.replace(/\D/g, "");
}

export const telefoneSchema = z
  .string()
  .min(1, "Informe o WhatsApp")
  .transform(apenasDigitos)
  .refine((valor) => valor.length === 10 || valor.length === 11, {
    message: "Informe um telefone válido com DDD",
  });

export const dataNascimentoSchema = z
  .string()
  .min(1, "Informe a data de nascimento")
  .refine((valor) => !Number.isNaN(new Date(valor).getTime()), {
    message: "Data de nascimento inválida",
  })
  .refine((valor) => new Date(valor).getTime() < Date.now(), {
    message: "Data de nascimento não pode ser no futuro",
  });

export const inscricaoFormSchema = z.object({
  nomeCompleto: z
    .string()
    .trim()
    .min(3, "Informe o nome completo")
    .max(200, "Nome muito longo"),
  dataNascimento: dataNascimentoSchema,
  telefone: telefoneSchema,
  email: z
    .union([z.literal(""), z.string().trim().email("E-mail inválido")])
    .optional(),
  igreja: z.string().trim().max(160).optional().or(z.literal("")),
  cidade: z.string().trim().min(2, "Informe a cidade").max(160),
  restricaoAlimentar: z.string().trim().max(1000).optional().or(z.literal("")),
  necessidadeAcessibilidade: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .or(z.literal("")),
  observacoes: z.string().trim().max(1000).optional().or(z.literal("")),
  consentimentoPrivacidade: z.literal(true, {
    error: "É necessário autorizar o uso dos dados para continuar",
  }),
});

export type InscricaoFormValues = z.infer<typeof inscricaoFormSchema>;

export const consultaInscricaoSchema = z.object({
  codigo: z
    .string()
    .trim()
    .min(4, "Informe o código da inscrição")
    .max(20),
  contato: z
    .string()
    .trim()
    .min(3, "Informe o telefone ou e-mail usado na inscrição"),
});

export type ConsultaInscricaoValues = z.infer<typeof consultaInscricaoSchema>;
