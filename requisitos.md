# 5.1 - Convenções, termos e abreviações
A correta interpretação deste documento exige o conhecimento de algumas convenções e termos específicos, que são descritos a seguir.

## 5.1.1 Identificação dos Requisitos
Por convenção, os requisitos funcionais são identificados de acordo com o esquema abaixo: 
[RF<<número do requisito>>]

E os requisitos não funcionais: [RNF<<número do requisito>>]

# 5.2 - Requisitos funcionais (casos de uso)
[RF01] O sistema deve permitir o cadastro de usuários, solicitando nome, e-mail e senha.

[RF02] O sistema deve permitir que o usuário realize login utilizando e-mail e senha cadastrados.

[RF03] O sistema deve permitir que o usuário autenticado realize logout.

[RF04] O sistema deve permitir que o usuário altere suas informações pessoais de perfil (apenas nome e e-mail).

[RF05] O sistema deve permitir que o usuário visualize suas tarefas cadastradas.

[RF06] O sistema deve permitir que o usuário crie, edite e exclua tarefas contendo título e prazo de entrega (opcional).

[RF07] O sistema deve definir automaticamente o status da tarefa como:
A fazer: quando a tarefa não possuir data de conclusão e o prazo ainda não tiver expirado;
Concluída: quando houver data de conclusão;
Atrasada: quando não houver data de conclusão e o prazo tiver expirado;

[RF08] O sistema deve exibir as tarefas do usuário priorizando aquelas com maior urgência, ordenando-as pelo prazo mais próximo da data atual.

[RF09] O sistema deve permitir a conclusão rápida da tarefa ao clicar no marcador (bolinha/checkbox), registrando automaticamente a data de conclusão.

[RF10] O sistema deve disponibilizar um temporizador baseado no método Pomodoro, permitindo iniciar, pausar, reiniciar e encerrar sessões de foco.

[RF11] O sistema deve exibir um relatório sobre os últimos 7 dias contendo a quantidade de tarefas concluídas e não concluídas no período, além de um gráfico com o cumprimento das tarefas dentro do prazo.

# 5.3 - Requisitos não funcionais
Segurança

[RNF01] O sistema deve armazenar as senhas dos usuários utilizando função de hash, impedindo a recuperação da senha original.

[RNF02] O sistema deve utilizar autenticação baseada em token para controlar o acesso às funcionalidades protegidas.

[RNF03] O sistema deve validar os dados inseridos pelos usuários, garantindo que campos obrigatórios sejam preenchidos e que o e-mail esteja em formato válido.

Usabilidade

[RNF04] O sistema deve permitir que o usuário execute as principais funcionalidades (cadastro, login e gerenciamento de tarefas) sem necessidade de instruções externas.

[RNF05] O sistema deve disponibilizar mecanismos de navegação consistentes em todas as páginas.

