import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { addTodo, USER_ID } from '../api/todos';
import { OptionUpdate } from '../types/OptionsType';

type Props = {
  todos: Todo[];
  loading: boolean;
  errorMsg: string;
  updateChecked: (updatedTodo: Todo, option: OptionUpdate) => void;
  setErrorMsg: (text: string) => void;
  setTempTodo: (todo: Todo | null) => void;
  setLoading: (value: boolean) => void;
  showError: (text: string) => void;

  setTodos: Function;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  loading,
  errorMsg,
  updateChecked = () => {},
  setErrorMsg = () => {},
  setTempTodo = () => {},
  setLoading = () => {},
  showError = () => {},
  setTodos = () => {},
}) => {
  const [todo, setTodo] = useState<string>('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isAllCompletedTots, setIsAllCompletedTots] = useState<boolean>(false);

  const checkingIsAllCompletedTodos = (allTodos: Todo[]) => {
    return allTodos.every(todoItem => todoItem.completed);
  };

  useEffect(() => {
    setIsAllCompletedTots(checkingIsAllCompletedTodos(todos));
  }, [todos]);

  useEffect(() => {
    if (!errorMsg) {
      return;
    }

    inputRef.current?.focus();
  }, [errorMsg]);

  const toggleAllTodos = (): void => {
    const isCompletedAllTodos = todos.some(item => !item.completed);

    if (isCompletedAllTodos) {
      const isNotActiveTodo = todos.filter(itemTodo => !itemTodo.completed);

      isNotActiveTodo.forEach(todoItem => {
        updateChecked(todoItem, 'all');
      });

      return;
    }

    todos.map(todoItem => {
      updateChecked(todoItem, 'once');
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    setTodo(event.target.value);
  };

  const createNewTodo = (title: string): Todo => {
    return {
      completed: false,
      id: 0,
      title: title,
      userId: USER_ID,
    };
  };

  const createTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!todo.trim()) {
      showError('Title should not be empty');

      return;
    }

    const newTempTodo = createNewTodo(todo.trim());

    setTempTodo(newTempTodo);
    setLoading(true);

    addTodo(newTempTodo)
      .then(newTodo => {
        setTodos((prev: Todo[]) => [...prev, newTodo]);
        setTempTodo(null);
        setTodo('');
      })
      .catch(() => {
        showError('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => setLoading(false));
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompletedTots,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={createTodo} onReset={() => setTodo('')}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={todo}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChange}
          disabled={loading}
        />
      </form>
    </header>
  );
};
