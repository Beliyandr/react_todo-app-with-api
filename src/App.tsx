/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, USER_ID, updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { TodoHeader } from './components/TodoHeader';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterName, OptionUpdate } from './types/OptionsType';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [activeFilter, setActiveFilter] = useState<FilterName>(FilterName.All);

  const showError = (text: string) => {
    setErrorMsg(text);
    const timerId = window.setTimeout(() => {
      window.clearTimeout(timerId);
      setErrorMsg('');
    }, 3000);
  };

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(allTodos => {
        setTodos(allTodos);
      })
      .catch(() => showError('Unable to load todos'))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onFilteredTodos = (filterName: FilterName): Todo[] => {
    switch (filterName) {
      case FilterName.All:
        return todos;
      case FilterName.Active:
        return todos.filter(todoItem => !todoItem.completed);
      case FilterName.Completed:
        return todos.filter(todoItem => !!todoItem.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = onFilteredTodos(activeFilter);
  const activeTodos = onFilteredTodos(FilterName.Active);
  const completedTodos = onFilteredTodos(FilterName.Completed);

  const removeTodo = (id: number) => {
    console.log(id);
    // setWaiterLoading(id);
    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.filter(todoItem => todoItem.id !== id);
        });
      })
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => {
        // setWaiterLoading(null);
      });
  };

  const updateChecked = (
    updatedTodo: Todo,
    option: OptionUpdate = 'once',
  ): void => {
    let updateCompleted = !updatedTodo.completed;

    if (option === 'all') {
      updateCompleted = true;
    }

    // setWaiterLoading(updatedTodo.id);
    updateTodo({ ...updatedTodo, completed: updateCompleted })
      .then(todoItem => {
        setTodos(currentTodos => {
          const newPosts = [...currentTodos];
          const index = newPosts.findIndex(
            todoIndex => todoIndex.id === updatedTodo.id,
          );

          newPosts.splice(index, 1, todoItem);

          return newPosts;
        });
        // inputRef.current?.blur();
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => {
        // setWaiterLoading(null);
      });
  };

  const clearCompleted = (todosCompleted: Todo[]): void => {
    todosCompleted.forEach(itemTodo => {
      removeTodo(itemTodo.id);
    });
  };

  return (
    <>
      {!USER_ID ? (
        <UserWarning />
      ) : (
        <div className="todoapp">
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            <TodoHeader
              todos={todos}
              loading={loading}
              showError={showError}
              setLoading={setLoading}
              errorMsg={errorMsg}
              updateChecked={updateChecked}
              setErrorMsg={setErrorMsg}
              setTempTodo={setTempTodo}
              setTodos={setTodos}
            />

            <TodoList
              todos={todos}
              tempTodo={tempTodo}
              filteredTodos={filteredTodos}
              showError={showError}
              removeTodo={removeTodo}
              updateChecked={updateChecked}
              setTodos={setTodos}
            />

            {todos?.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {activeTodos.length} items left
                </span>

                <nav className="filter" data-cy="Filter">
                  <a
                    href="#/"
                    className={classNames('filter__link', {
                      selected: activeFilter === FilterName.All,
                    })}
                    data-cy="FilterLinkAll"
                    onClick={() => setActiveFilter(FilterName.All)}
                  >
                    All
                  </a>

                  <a
                    href="#/active"
                    className={classNames('filter__link', {
                      selected: activeFilter === FilterName.Active,
                    })}
                    data-cy="FilterLinkActive"
                    onClick={() => setActiveFilter(FilterName.Active)}
                  >
                    Active
                  </a>

                  <a
                    href="#/completed"
                    className={classNames('filter__link', {
                      selected: activeFilter === FilterName.Completed,
                    })}
                    data-cy="FilterLinkCompleted"
                    onClick={() => setActiveFilter(FilterName.Completed)}
                  >
                    Completed
                  </a>
                </nav>

                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  onClick={() => clearCompleted(completedTodos)}
                  disabled={completedTodos.length < 1}
                >
                  Clear completed
                </button>
              </footer>
            )}
          </div>

          <ErrorNotification
            errorMsg={errorMsg}
            handleCloseErrorButton={async () => setErrorMsg('')}
          />
        </div>
      )}
    </>
  );
};
