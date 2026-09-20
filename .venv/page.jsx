'use client';

import { useState } from 'react';

import Footer from '../components/footer';
import Header from '../components/header';
import styles from './tarefas.module.css';

const initialTasks = [
  {
    id: 1,
    title: '<<tarefa>>',
    due: '--/--/----',
    status: 'doing',
  },
  {
    id: 2,
    title: '<<tarefa>>',
    due: '--/--/----',
    status: 'doing',
  },
  {
    id: 3,
    title: '<<tarefa>>',
    due: '--/--/----',
    status: 'doing',
  },
  {
    id: 4,
    title: '<<tarefa>>',
    due: '--/--/----',
    status: 'late',
  },
  {
    id: 5,
    title: '<<tarefa>>',
    due: '--/--/----',
    doneAt: '--/--/----',
    status: 'done',
  },
];

function TaskRow({
  task,
  onToggle,
  onDelete,
  onEdit,
}) {
  const completed = task.status === 'done';

  return (
    <article className={styles.taskRow}>
      <button
        className={`${styles.check} ${
          completed ? styles.checked : ''
        }`}
        type="button"
        aria-label={
          completed
            ? 'Reabrir tarefa'
            : 'Concluir tarefa'
        }
        onClick={() => onToggle(task.id)}
      >
        {completed && (
          <i
            className="fa-solid fa-check"
            aria-hidden="true"
          />
        )}
      </button>

      <strong className={styles.taskTitle}>
        {task.title}
      </strong>

      <div className={styles.taskDates}>
        <span>Prazo: {task.due}</span>

        {task.doneAt && (
          <span>
            Conclusão: {task.doneAt}
          </span>
        )}
      </div>

      <div className={styles.rowActions}>
        <button
          type="button"
          aria-label="Editar tarefa"
          onClick={() => onEdit(task.id)}
        >
          <i
            className="fa-regular fa-pen-to-square"
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          aria-label="Excluir tarefa"
          onClick={() => onDelete(task.id)}
        >
          <i
            className="fa-regular fa-trash-can"
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
}

function TaskPanel({
  title,
  tasks,
  className,
  onToggle,
  onDelete,
  onEdit,
}) {
  return (
    <section
      className={`${styles.panel} ${className}`}
    >
      <h2>{title}</h2>

      <div className={styles.panelRows}>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}

        {tasks.length === 0 && (
          <p className={styles.noTasks}>
            Nenhuma tarefa por aqui.
          </p>
        )}
      </div>

      <div
        className={styles.more}
        aria-hidden="true"
      >
        •••
      </div>
    </section>
  );
}

export default function TarefasPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [pomodoroRunning, setPomodoroRunning] =
    useState(false);

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) {
          return task;
        }

        const isDone = task.status === 'done';

        return {
          ...task,
          status: isDone ? 'doing' : 'done',
          doneAt: isDone
            ? undefined
            : '--/--/----',
        };
      }),
    );
  }

  function deleteTask(id) {
    setTasks((current) =>
      current.filter((task) => task.id !== id),
    );
  }

  function editTask(id) {
    window.alert(`Editar tarefa ${id}`);
  }

  const doing = tasks.filter(
    (task) => task.status === 'doing',
  );

  const late = tasks.filter(
    (task) => task.status === 'late',
  );

  const done = tasks.filter(
    (task) => task.status === 'done',
  );

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.filterBar}>
        <strong>Filtrar por:</strong>

        <button type="button">
          <i
            className="fa-regular fa-pen-to-square"
            aria-hidden="true"
          />

          Importância e urgência
        </button>
      </div>

      <main className={styles.main}>
        <section className={styles.topArea}>
          <div className={styles.pomodoro}>
            <span className={styles.pomodoroLabel}>
              Pomodoro
            </span>

            <strong>25:00</strong>

            <i
              className="fa-regular fa-clock"
              aria-hidden="true"
            />

            <div className={styles.timerButtons}>
              <button
                type="button"
                aria-label="Iniciar Pomodoro"
                onClick={() =>
                  setPomodoroRunning(true)
                }
              >
                <i
                  className="fa-solid fa-play"
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                aria-label="Pausar Pomodoro"
                onClick={() =>
                  setPomodoroRunning(false)
                }
              >
                <i
                  className="fa-solid fa-pause"
                  aria-hidden="true"
                />
              </button>
            </div>

            <span className={styles.srOnly}>
              {pomodoroRunning
                ? 'Pomodoro iniciado'
                : 'Pomodoro pausado'}
            </span>
          </div>

          <div className={styles.titleBlock}>
            <h1>
              <i
                className="fa-regular fa-square-check"
                aria-hidden="true"
              />

              Lista de Afazeres
            </h1>
          </div>

          <button
            className={styles.addButton}
            type="button"
          >
            <i
              className="fa-solid fa-plus"
              aria-hidden="true"
            />

            Adicionar
          </button>
        </section>

        <section className={styles.columns}>
          <TaskPanel
            title="A fazer"
            tasks={doing}
            className={styles.doingPanel}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={editTask}
          />

          <div className={styles.sidePanels}>
            <TaskPanel
              title="Atrasadas"
              tasks={late}
              className={styles.latePanel}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={editTask}
            />

            <TaskPanel
              title="Concluídas"
              tasks={done}
              className={styles.donePanel}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={editTask}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}