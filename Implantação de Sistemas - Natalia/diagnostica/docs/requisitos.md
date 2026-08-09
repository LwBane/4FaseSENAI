# Lista de Requisitos Funcionais

- **Sistema:** AgendaFácil — Sistema de Agendamento de Serviços de Limpeza
- **Banco de dados:** faxina_db

| Código | Requisito | Descrição | Regras / Critérios de aceite |
|--------|-----------|-----------|-------------------------------|
| RF01 | Autenticação de usuário | O sistema deve permitir login com email e senha. | Email não cadastrado → "Usuário não encontrado."; Senha incorreta → "Senha incorreta."; Falha de login mantém o usuário na tela de login; Senha armazenada com hash (criptografada); Sucesso gera token de sessão válido por 8h. |
| RF02 | Interface principal | Exibir a tela principal após o login, com nome do usuário logado. | Nome exibido corresponde ao usuário autenticado; Acesso visível às telas de Cadastro e Gestão de Agendamentos. |
| RF03 | Logout | Permitir encerrar a sessão do usuário. | Remove token e dados do usuário do armazenamento local; Redireciona para a tela de login. |
| RF04 | Listagem de agendamentos | Listar automaticamente os agendamentos cadastrados. | Exibição em tabela; Carregamento automático ao abrir a tela; Colunas: cliente, profissional, tipo de serviço, data, hora, status. |
| RF05 | Busca de agendamentos | Buscar agendamentos por termo digitado. | Compara com cliente, profissional, status e tipo de serviço; Atualiza a tabela com os resultados; Campo vazio → exibe todos os registros. |
| RF06 | Cadastro de agendamento | Criar novo agendamento vinculando cliente e profissional. | Campos obrigatórios: cliente, profissional, tipo de serviço, data, hora; Validação de preenchimento antes de salvar; Bloqueia conflito: mesmo profissional, mesma data/hora. |
| RF07 | Edição de agendamento | Editar um agendamento existente. | Formulário pré-preenchido com dados atuais; Mesmas validações do RF06; Permite alterar cliente, profissional, tipo, data, hora e status. |
| RF08 | Exclusão de agendamento | Excluir um agendamento existente. | Solicita confirmação antes de excluir; Remove o registro permanentemente do banco. |
| RF09 | Retorno à tela principal | Voltar à interface principal a partir de qualquer tela interna. | Disponível nas telas de Cadastro e Gestão de Agendamentos. |
| RF10 | Listagem ordenada (Gestão) | Listar agendamentos em ordem cronológica ou alfabética. | Alternância entre ordenação por data/hora e por nome do cliente; Ordenação processada por algoritmo (bubble sort) implementado no código. |
| RF11 | Movimentação de agendamento | Selecionar e alterar a alocação de um agendamento. | Permite escolher tipo de serviço (residencial/comercial); Permite realocar o profissional responsável; Permite alterar data e horário. |
| RF12 | Verificação de conflito de horário | Verificar automaticamente conflitos ao criar ou movimentar agendamentos. | Mesmo profissional + mesma data/hora → bloqueia e exibe alerta; Verificação ocorre tanto na criação quanto na edição/movimentação. |
| RF13 | Registro dos dados do agendamento | Manter, em cada agendamento, o registro de cliente, profissional e data de criação. | Campo `criado_em` preenchido automaticamente no momento do cadastro, garantindo rastreabilidade. |


# Requisitos de Infraestrutura


| Item | Especificação |
|------|---------------|
| **SGBD** | MySQL 8.0.42 |
| **Linguagem de programação (Backend)** | JavaScript — Node.js v22.18.0, com o framework Express |
| **Linguagem de programação (Frontend)** | JavaScript — React (via Vite), com estilização em Tailwind CSS |
| **Sistema Operacional utilizado no desenvolvimento** | Windows 11 |