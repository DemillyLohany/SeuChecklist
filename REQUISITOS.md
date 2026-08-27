# 5.1 - Convenções, termos e abreviações
A correta interpretação deste documento exige o conhecimento de algumas convenções e termos específicos, que são descritos a seguir.

## 5.1.1 Identificação dos Requisitos
Por convenção, os requisitos funcionais são identificados de acordo com o esquema abaixo: 
[RF<<número do requisito>>]

E os requisitos não funcionais: [RNF<<número do requisito>>]

# 5.2 - Requisitos funcionais (casos de uso)

[RF01] Cadastro de Usuário

O usuário realiza o próprio cadastro informando nome, e-mail e senha.

[RF02] Login

O usuário realiza o login utilizando e-mail e senha cadastrados.

[RF03] Logout

O usuário autenticado encerra sua sessão.

[RF04] Edição de Perfil

O usuário altera suas informações pessoais de perfil (apenas nome e e-mail).

[RF05] Visualização de Tarefas
O usuário visualiza sua lista de tarefas cadastradas.

[RF06] Gestão de Tarefas

O usuário cria, edita e exclui tarefas contendo título, descrição e prazo de conclusão (opcional).

[RF07] Status Automático da Tarefa

- A aplicação atribui o status da tarefa automaticamente:
-- A fazer: sem data de conclusão e prazo não expirado.
-- Concluída: com data de conclusão registrada.
-- Atrasada: sem data de conclusão e prazo expirado.
  
[RF08] Ordenação por Urgência

A lista exibe as tarefas priorizando as de maior urgência, ordenadas pelo prazo mais próximo da data atual.

[RF09] Conclusão de Tarefa

O usuário marca a tarefa como concluída via marcador (checkbox), registrando a data atual automaticamente.

[RF10] Temporizador Pomodoro

O usuário inicia, pausa, reinicia e encerra sessões de foco no temporizador do método Pomodoro.

[RF11] Relatório de Desempenho

O painel exibe o relatório dos últimos 7 dias com o total de tarefas concluídas/não concluídas e o gráfico de cumprimento dos prazos.

# 5.3 - Requisitos não funcionais
Segurança

[RNF01] O sistema deve armazenar as senhas dos usuários utilizando função de hash, impedindo a recuperação da senha original.

[RNF02] O sistema deve utilizar autenticação baseada em token para controlar o acesso às funcionalidades protegidas.

[RNF03] O sistema deve validar os dados inseridos pelos usuários, garantindo que campos obrigatórios sejam preenchidos e que o e-mail esteja em formato válido.

Usabilidade

[RNF04] O sistema deve permitir que o usuário execute as principais funcionalidades (cadastro, login e gerenciamento de tarefas) sem necessidade de instruções externas.

[RNF05] O sistema deve disponibilizar mecanismos de navegação consistentes em todas as páginas.

Manutenibilidade

[RNF06] Toda alteração na estrutura ou nos dados iniciais do banco de dados deve ser realizada obrigatoriamente via scripts de migração (migrations).

Gerenciamento de Configuração

[RNF07] Os arquivos de migração devem ser versionados no repositório de código fonte junto com a respectiva alteração de código.


