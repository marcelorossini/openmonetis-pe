# Design System do OpenMonetis PE

Este documento descreve a identidade visual implementada no OpenMonetis PE. Ele deve
ser usado como referência ao criar telas, revisar componentes e manter a
experiência consistente entre dashboard, relatórios, formulários e landing page.

## 1. Direção visual

O OpenMonetis PE busca tornar a gestão financeira de pequenas empresas clara e acolhedora. A interface
usa superfícies quentes, poucos elementos decorativos e uma cor laranja de
destaque para orientar o olhar sem transformar toda ação em urgência.

Princípios:

- priorizar legibilidade e hierarquia em telas com muitos dados;
- usar laranja para ações principais, seleção e foco;
- manter superfícies leves no tema claro e contraste confortável no tema escuro;
- aplicar cores semânticas para comunicar estado, não como decoração;
- preservar espaço suficiente entre blocos para evitar ruído visual;
- favorecer componentes responsivos e navegação acessível por teclado.

## 2. Fonte de verdade

Os tokens globais estão definidos em
[`src/app/globals.css`](./src/app/globals.css). Componentes reutilizáveis ficam
em [`src/shared/components/ui/`](./src/shared/components/ui/) e seguem o padrão
do shadcn/ui com Radix UI e Tailwind CSS 4.

Ao implementar uma tela:

1. use classes semânticas como `bg-background`, `bg-card`, `text-foreground`,
   `text-muted-foreground`, `border-border` e `ring-ring`;
2. reutilize os componentes em `src/shared/components/ui/`;
3. evite cores hexadecimais e valores arbitrários quando já existir um token;
4. valide os dois temas antes de concluir a alteração.

## 3. Cores

A paleta é definida em OKLCH para manter uma percepção de contraste mais
consistente. Não copie os valores para componentes: use os tokens semânticos.

| Token | Papel |
|---|---|
| `background` | Fundo geral da aplicação |
| `foreground` | Texto principal |
| `card` / `card-foreground` | Cards e conteúdo em destaque |
| `popover` / `popover-foreground` | Menus, popovers e overlays |
| `primary` / `primary-foreground` | Ações principais, foco e seleção |
| `secondary` / `secondary-foreground` | Ações secundárias e superfícies discretas |
| `muted` / `muted-foreground` | Apoio visual, descrições e metadados |
| `accent` / `accent-foreground` | Hover e seleção leve |
| `success` | Confirmações, recebimentos e estados positivos |
| `warning` | Atenção, vencimentos e estados intermediários |
| `info` | Informações auxiliares |
| `destructive` | Erros e ações destrutivas |
| `border`, `input`, `ring` | Bordas, campos e foco |

### Gráficos

Gráficos usam `chart-1` a `chart-10`. Visualizações que precisam de uma escala
sequencial quente podem usar `data-1` a `data-6`. A cor nunca deve ser o único
meio de distinguir uma série: inclua legenda, rótulo ou tooltip.

### Tema escuro

O tema escuro redefine a mesma camada semântica dentro de `.dark`. Não crie uma
segunda árvore de componentes para suportá-lo. Prefira tokens e, somente quando
necessário, variantes Tailwind `dark:`.

## 4. Tipografia

A família principal é **Bricolage Grotesque**, carregada com `next/font` em
[`public/fonts/font_index.ts`](./public/fonts/font_index.ts). Os pesos
disponíveis são `500`, `600` e `700`, com fallback para Arial e fontes sans-serif
do sistema.

Diretrizes:

- corpo e controles: `text-sm` ou `text-base`;
- descrições e metadados: `text-sm text-muted-foreground`;
- títulos de card: `text-base font-medium`;
- títulos de modal: `text-lg font-semibold`;
- títulos de página: hierarquia responsiva conforme a densidade da tela;
- números financeiros: destaque por peso e alinhamento, sem depender apenas da
  cor.

## 5. Espaçamento, raio e elevação

A escala base é de `0.25rem` (`4px`). Prefira a escala padrão do Tailwind para
padding, gap e margens. O raio base é `0.7rem`, exposto pelas classes
`rounded-sm`, `rounded-md`, `rounded-lg` e `rounded-xl`.

Sombras também são tokens. Cards comuns usam `shadow-xs`; menus, tooltips e
modais podem subir de nível conforme a necessidade. Evite adicionar sombra forte
a cada bloco: bordas e diferença de superfície devem resolver a maior parte da
hierarquia.

## 6. Componentes

### Botões

Use [`Button`](./src/shared/components/ui/button.tsx) e suas variantes:

| Variante | Uso |
|---|---|
| `default` | Ação principal da tela ou do fluxo |
| `secondary` | Ação complementar |
| `outline` | Ação neutra com contorno |
| `ghost` | Ação discreta em barras e grupos |
| `link` | Ação textual |
| `destructive` | Exclusão ou operação irreversível |
| `navbar` | Ferramentas da navegação superior |

Não coloque duas ações `default` competindo na mesma região. Para ícones sem
rótulo visível, inclua `aria-label` ou texto apenas para leitores de tela.

### Cards

Use [`Card`](./src/shared/components/ui/card.tsx) para agrupar informações
relacionadas. O componente já define fundo, borda, sombra leve, raio e destaque
de hover. Não transforme todo conteúdo em card: listas densas e tabelas podem
usar uma única superfície.

### Formulários

Campos devem usar os componentes compartilhados, como `Input`, `Select`,
`Checkbox`, `Switch` e `DatePicker`. Eles já aplicam foco com `ring`, estados
desabilitados e integração visual com os temas. Sempre associe controles a
`Label` e apresente erros próximos ao campo correspondente.

### Diálogos

Use [`Dialog`](./src/shared/components/ui/dialog.tsx) para tarefas focadas. Em
mobile, o conteúdo respeita a largura disponível; em telas maiores, o modal pode
ganhar mais espaço. Botões do rodapé devem preservar a ordem e a hierarquia da
ação principal.

### Feedback

Use toast para retorno breve, `Alert` para contexto persistente e componentes em
[`src/shared/components/feedback/`](./src/shared/components/feedback/) para
estados vazios, status e confirmações. Textos visíveis ao usuário devem estar em
português claro.

## 7. Layout e navegação

As páginas protegidas usam uma navbar fixa e um contêiner central com largura
máxima `max-w-8xl`, padding lateral responsivo e espaçamento vertical enxuto. A
navegação principal fica em
[`src/shared/components/navigation/navbar/`](./src/shared/components/navigation/navbar/).

Padrões:

- telas do App Router devem continuar finas;
- conteúdo principal começa abaixo da navbar fixa (`pt-16`);
- use uma coluna em telas pequenas e expanda grids progressivamente;
- tabelas e gráficos devem preservar leitura em viewport estreita;
- ações essenciais precisam continuar alcançáveis por toque e teclado.

## 8. Acessibilidade

- mantenha foco visível com os tokens `ring`;
- use HTML semântico antes de adicionar ARIA;
- não comunique estado apenas por cor;
- associe labels a inputs;
- forneça nome acessível para botões de ícone;
- confira contraste e navegação por teclado nos temas claro e escuro;
- mantenha áreas de toque confortáveis em mobile.

## 9. Checklist de revisão visual

- O componente compartilhado existente foi reutilizado?
- As cores usam tokens semânticos?
- A tela funciona em tema claro e escuro?
- O layout continua legível em mobile?
- Foco, labels e nomes acessíveis estão presentes?
- Estados vazio, carregando, erro e sucesso foram considerados?
- Valores financeiros continuam fáceis de comparar?
