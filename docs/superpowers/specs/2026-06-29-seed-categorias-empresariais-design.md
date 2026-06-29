# Seed de Categorias Empresariais

## Contexto

O OpenMonetis hoje sobe uma seed de categorias majoritariamente pessoal/domestica em `DEFAULT_CATEGORIES`. Essa seed e reutilizada em tres fluxos importantes: criacao inicial de usuario, reset de conta e complemento de categorias no script de mock data. Para pequenas empresas de servicos e consultoria, a lista atual gera ruido no onboarding porque prioriza categorias como lazer, pets, presentes e delivery, enquanto deixa custos operacionais comuns menos evidentes.

O objetivo desta mudanca e substituir a seed atual por uma base hibrida, com peso empresarial, mantendo volume parecido ao atual e preservando apenas algumas categorias universais que ainda fazem sentido em pequenas operacoes.

## Objetivo

Atualizar a seed padrao de categorias para refletir melhor empresas de servicos e consultoria, sem alterar automaticamente categorias de usuarios existentes.

## Fora de Escopo

- migrar ou renomear categorias ja existentes em contas ativas;
- criar presets multiplos por segmento;
- alterar regras de categorias protegidas;
- alterar a interface de cadastro manual de categorias.

## Abordagem Escolhida

Seguir com uma seed hibrida, mas claramente orientada a empresa:

- priorizar despesas e receitas operacionais comuns em servicos e consultoria;
- manter apenas algumas categorias universais que continuam plausiveis em contexto PJ;
- preservar as categorias protegidas exigidas pelo sistema;
- preconfigurar `partyKind` nas categorias obvias de cliente e fornecedor para reduzir atrito operacional.

Essa abordagem equilibra dois objetivos: reduzir ruido para empresas e continuar util para pequenas operacoes que misturam alguns gastos universais no mesmo ambiente.

## Catalogo Proposto

### Despesas

- `Pro-labore`
- `Folha e encargos`
- `Impostos e taxas`
- `Contabilidade`
- `Servicos terceirizados`
- `Marketing e publicidade`
- `Software e SaaS`
- `Internet e telefonia`
- `Equipamentos e informatica`
- `Materiais de escritorio`
- `Aluguel e condominio`
- `Energia e agua`
- `Servicos bancarios`
- `Seguros`
- `Capacitacao e cursos`
- `Viagens e hospedagem`
- `Transporte e deslocamento`
- `Alimentacao de trabalho`
- `Assinaturas`
- `Pagamentos`
- `Outras despesas`

### Receitas

- `Servicos Prestados`
- `Mensalidades e contratos`
- `Vendas`
- `Comissoes`
- `Reembolso`
- `Rendimentos financeiros`
- `Investimentos`
- `Outras receitas`
- `Saldo inicial`
- `Transferencia interna`

## Regras de `partyKind`

As categorias abaixo devem nascer com `partyKind` definido automaticamente.

### Cliente

- `Servicos Prestados`
- `Mensalidades e contratos`
- `Vendas`
- `Comissoes`
- `Reembolso`

### Fornecedor

- `Servicos terceirizados`
- `Contabilidade`
- `Marketing e publicidade`
- `Software e SaaS`
- `Internet e telefonia`
- `Equipamentos e informatica`
- `Materiais de escritorio`
- `Aluguel e condominio`
- `Energia e agua`
- `Servicos bancarios`
- `Seguros`
- `Capacitacao e cursos`
- `Viagens e hospedagem`
- `Transporte e deslocamento`
- `Alimentacao de trabalho`
- `Assinaturas`
- `Impostos e taxas`

Categorias protegidas continuam com o comportamento especial atual e nao entram em regras novas alem do que o sistema ja exige.

## Impacto Tecnico

### Arquivos afetados

- `src/shared/lib/categories/defaults.ts`
- `src/features/settings/actions.ts`
- `scripts/mock-data.ts`
- testes relacionados a seed de categorias

### Mudancas previstas

1. Atualizar `DEFAULT_CATEGORIES` com o novo catalogo e os `partyKind` predefinidos.
2. Corrigir os pontos que hoje recriam categorias sem copiar `partyKind`:
   - reset de conta em `src/features/settings/actions.ts`;
   - complemento de categorias no `scripts/mock-data.ts`.
3. Adicionar cobertura de teste para garantir que:
   - a seed nova sobe as categorias empresariais esperadas;
   - categorias com `partyKind` mantem esse campo ao serem criadas ou recompostas.

## Compatibilidade

- novos usuarios passam a receber a nova seed;
- reset de conta recria a nova seed com o mesmo comportamento;
- o script de mock data passa a complementar categorias faltantes com a mesma definicao;
- usuarios existentes nao sofrem alteracao automatica.

## Riscos

- algum teste ou trecho do app pode depender implicitamente de nomes antigos da seed;
- o `mock-data` pode usar categorias removidas ou renomeadas em cenarios de preenchimento;
- o reset de conta hoje nao preserva `partyKind`, entao a mudanca precisa corrigir isso junto para nao gerar seed inconsistente.

## Validacao Esperada

- testes automatizados cobrindo a seed e a preservacao de `partyKind`;
- verificacao de referencias a nomes antigos removidos;
- `lint` e `tsc` verdes apos a alteracao.
