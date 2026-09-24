'use client';

import { useEffect, useState } from 'react';

import Footer from '../components/footer';
import Header from '../components/header';
import styles from './tarefas.module.css';

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
        {task.due && (
          <span>
            Prazo: {task.due}
          </span>
        )}

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
            Nenhuma tarefa cadastrada.
          </p>
        )}
      </div>

      {tasks.length > 0 && (
        <div
          className={styles.more}
          aria-hidden="true"
        >
          •••
        </div>
      )}
    </section>
  );
}

export default function TarefasPage() {
  const [tasks, setTasks] = useState([]);
  const [pomodoroRunning, setPomodoroRunning] =
    useState(false);
  const [pomodoroSeconds, setPomodoroSeconds] =
    useState(25 * 60);
  const [showTaskForm, setShowTaskForm] =
    useState(false);

  const [formData, setFormData] = useState({
    title: '',
    due: '',
    priority: 'Média',
    description: '',
  });

  useEffect(() => {
    if (!pomodoroRunning) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setPomodoroSeconds((current) => {
        if (current <= 1) {
          setPomodoroRunning(false);
          return 25 * 60;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [pomodoroRunning]);

  function formatPomodoroTime() {
    const minutes = Math.floor(
      pomodoroSeconds / 60,
    );

    const seconds = pomodoroSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(
      seconds,
    ).padStart(2, '0')}`;
  }

  function updateForm(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setFormData({
      title: '',
      due: '',
      priority: 'Média',
      description: '',
    });

    setShowTaskForm(false);
  }

  function formatDate(value) {
    if (!value) {
      return '';
    }

    const [year, month, day] = value.split('-');

    return `${day}/${month}/${year}`;
  }

  function submitTask(event) {
    event.preventDefault();

    const title = formData.title.trim();

    if (!title) {
      return;
    }

    setTasks((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title,
        due: formatDate(formData.due),
        priority: formData.priority,
        description: formData.description.trim(),
        status: 'doing',
      },
    ]);

    resetForm();
  }

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
            : new Date().toLocaleDateString(
                'pt-BR',
              ),
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
    const task = tasks.find(
      (item) => item.id === id,
    );

    if (!task) {
      return;
    }

    const title = window.prompt(
      'Edite o nome da tarefa:',
      task.title,
    );

    if (!title || !title.trim()) {
      return;
    }

    setTasks((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              title: title.trim(),
            }
          : item,
      ),
    );
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

            <strong aria-live="polite">
              {formatPomodoroTime()}
            </strong>

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
            onClick={() =>
              setShowTaskForm(true)
            }
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

      {showTaskForm && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setShowTaskForm(false);
            }
          }}
        >
          <section
            className={styles.taskModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-task-title"
          >
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.modalEyebrow}>
                  Cadastro de tarefa
                </p>

                <h2 id="new-task-title">
                  Cadastrar tarefa
                </h2>
              </div>

              <button
                className={styles.closeButton}
                type="button"
                aria-label="Fechar formulário"
                onClick={() =>
                  setShowTaskForm(false)
                }
              >
                <i
                  className="fa-solid fa-xmark"
                  aria-hidden="true"
                />
              </button>
            </div>

            <form
              className={styles.taskForm}
              onSubmit={submitTask}
            >
              <label>
                Nome da tarefa

                <input
                  type="text"
                  value={formData.title}
                  onChange={(event) =>
                    updateForm(
                      'title',
                      event.target.value,
                    )
                  }
                  placeholder="Digite o nome da tarefa"
                  required
                  autoFocus
                />
              </label>

              <div className={styles.formGrid}>
                <label>
                  Prazo

                  <input
                    type="date"
                    value={formData.due}
                    onChange={(event) =>
                      updateForm(
                        'due',
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label>
                  Prioridade

                  <select
                    value={formData.priority}
                    onChange={(event) =>
                      updateForm(
                        'priority',
                        event.target.value,
                      )
                    }
                  >
                    <option value="Baixa">
                      Baixa
                    </option>

                    <option value="Média">
                      Média
                    </option>

                    <option value="Alta">
                      Alta
                    </option>
                  </select>
                </label>
              </div>

              <label>
                Descrição

                <textarea
                  value={formData.description}
                  onChange={(event) =>
                    updateForm(
                      'description',
                      event.target.value,
                    )
                  }
                  placeholder="Adicione uma descrição opcional"
                  rows={4}
                />
              </label>

              <div className={styles.formActions}>
                <button
                  className={styles.cancelButton}
                  type="button"
                  onClick={() =>
                    setShowTaskForm(false)
                  }
                >
                  Cancelar
                </button>

                <button
                  className={styles.submitButton}
                  type="submit"
                >
                  <i
                    className="fa-solid fa-plus"
                    aria-hidden="true"
                  />

                  Cadastrar tarefa
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <Footer />
    </div>
  );
}