export interface EtapaItem {
  key: string;
  label: string;
}

export interface Etapa {
  id: string;
  label: string;
  items: EtapaItem[];
  isCustom?: boolean;
  dbId?: string;
}

export const defaultEtapasConfig: Etapa[] = [
  {
    id: "conferir_medidas",
    label: "Conferir medidas do vão",
    items: [
      { key: "medir_largura", label: "Medir largura do vão" },
      { key: "medir_altura", label: "Medir altura do vão" },
      { key: "verificar_prumo", label: "Verificar prumo e nível" },
      { key: "conferir_esquadro", label: "Conferir esquadro" },
      { key: "registrar_medidas", label: "Registrar medidas no sistema" },
      { key: "foto_vao", label: "Tirar foto do vão" },
    ],
  },
  {
    id: "solicitar_materiais",
    label: "Solicitar materiais",
    items: [
      { key: "listar_acessorios", label: "Acessórios – listar e conferir" },
      { key: "listar_aluminios", label: "Alumínios – listar perfis necessários" },
      { key: "listar_vidros", label: "Vidros – especificar tipo, cor e espessura" },
      { key: "enviar_pedido_fornecedor", label: "Enviar pedido ao fornecedor" },
      { key: "confirmar_prazo", label: "Confirmar prazo de entrega" },
    ],
  },
  {
    id: "recebimento",
    label: "Recebimento dos materiais",
    items: [
      { key: "conferir_nf", label: "Conferir nota fiscal" },
      { key: "conferir_quantidades", label: "Conferir quantidades recebidas" },
      { key: "verificar_danos", label: "Verificar danos no transporte" },
      { key: "armazenar", label: "Armazenar materiais corretamente" },
      { key: "dar_baixa_estoque", label: "Dar baixa no estoque" },
    ],
  },
  {
    id: "instalacao",
    label: "Instalação",
    items: [
      { key: "preparar_local", label: "Preparar local de instalação" },
      { key: "montar_esquadria", label: "Montar esquadria" },
      { key: "fixar_contramarco", label: "Fixar contramarco" },
      { key: "instalar_vidros", label: "Instalar vidros" },
      { key: "aplicar_silicone", label: "Aplicar silicone e vedação" },
      { key: "testar_funcionamento", label: "Testar funcionamento (abrir/fechar)" },
      { key: "limpar_local", label: "Limpar local após instalação" },
    ],
  },
  {
    id: "entrega",
    label: "Entrega",
    items: [
      { key: "agendar_entrega", label: "Agendar data de entrega com cliente" },
      { key: "embalar_pecas", label: "Embalar peças para transporte" },
      { key: "carregar_veiculo", label: "Carregar veículo" },
      { key: "entregar_cliente", label: "Entregar ao cliente" },
      { key: "coletar_assinatura", label: "Coletar assinatura de recebimento" },
    ],
  },
  {
    id: "vistoria",
    label: "Vistoria",
    items: [
      { key: "verificar_acabamento", label: "Verificar acabamento final" },
      { key: "testar_vedacao", label: "Testar vedação contra água" },
      { key: "verificar_ferragens", label: "Verificar ferragens e fechaduras" },
      { key: "cliente_aprovar", label: "Cliente aprovar o serviço" },
      { key: "registrar_garantia", label: "Registrar garantia" },
      { key: "foto_final", label: "Tirar foto do serviço finalizado" },
    ],
  },
];
