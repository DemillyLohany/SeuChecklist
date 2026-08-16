# SeuChecklist - Gerenciador de tarefas

## Integrantes: Camila Thaís Silva Medeiros, Demilly Lohany Gonçalves de Medeiros e Filipe Silva Souza Marcelino

## Descrição:
O sistema consiste em uma aplicação web para gerenciamento de tarefas e produtividade, desenvolvida com o objetivo de auxiliar os usuários na organização de suas atividades diárias. A plataforma permite o cadastro e acompanhamento de tarefas, controle de status, priorização por prazo e utilização de técnicas de foco, como o método Pomodoro, visando melhorar a produtividade e o gerenciamento do tempo.

## Tecnologias Utilizadas:
- Frontend: Next.js
- Backend: FastAPI (Python)
- ORM(Mapeamento Objeto-Relacional): SQLModel
- Banco de Dados: SQLite

## Funcionalidades Principais
- Cadastro e autenticação de usuários com JWT
- Gerenciamento completo de tarefas (CRUD)
- Controle automático de status das tarefas (a fazer, atrasada e concluída)
- Priorização de tarefas com base na data prevista
- Temporizador Pomodoro para foco nas atividades
- Relatório semanal de desempenho do usuário

##

## rodar o backend (/backend): uvicorn app:app --reload
## rodar o frontend (/frontend2): npm run dev

## instalar bibliotecas: pip install fastapi "uvicorn[standard]" sqlmodel bcrypt pydantic-settings python-multipart

## link pro navegador: http://localhost:3000

