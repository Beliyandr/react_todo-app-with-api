import classNames from 'classnames';
import React, { forwardRef, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import { KeyValue, OptionUpdate } from '../types/OptionsType';

type Props = {
  todoItem: Todo;
  updateChecked?: (updatedTodo: Todo, option: OptionUpdate) => void;
  editedTodo?: Todo | null;
  setEditedTodo?: Function;
  removeTodo?: Function;
  waiterLoading?: number | null;
  updateTitle?: Function;
};

export const TodoItem: React.FC<Props> = ({
  todoItem,
  editedTodo,
  waiterLoading,
  updateChecked = () => {},
  setEditedTodo = () => {},
  removeTodo = () => {},
  updateTitle = () => {},
}) => {
  const editTodoRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    {
      editedTodo && editTodoRef.current?.focus();
    }
  }, [editedTodo]);

  const editOndDoubleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    editTodoRef.current?.focus();
    setEditedTodo((prev: Todo) =>
      prev ? { ...prev, title: event.target.value } : null,
    );
  };

  const onKeyClick = (
    event: React.KeyboardEvent<HTMLInputElement>,
    editedTodoValue?: Todo,
  ) => {
    if (event.key === KeyValue.Enter && editedTodoValue) {
      event.preventDefault();
      updateTitle(editedTodoValue);

      return;
    }

    if (event.key === KeyValue.Esc) {
      setEditedTodo(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todoItem.completed,
      })}
      key={todoItem.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => {
            updateChecked(todoItem, 'once');
          }}
          checked={todoItem.completed}
        />
      </label>

      {editedTodo?.id !== todoItem.id ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditedTodo(todoItem);
            }}
          >
            {todoItem.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              removeTodo(todoItem.id);
            }}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': waiterLoading === todoItem.id,
            })}
          >
            <div
              className="modal-background
                              has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </>
      ) : (
        <React.Fragment key={todoItem.id}>
          <form>
            <input
              ref={editTodoRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              checked={todoItem.completed}
              value={editedTodo.title}
              onBlur={event => {
                event.preventDefault();
                updateTitle(editedTodo);
              }}
              onKeyUp={event => onKeyClick(event)}
              onKeyDown={event => onKeyClick(event, editedTodo)}
              onChange={event => {
                editOndDoubleClick(event);
              }}
            />
          </form>

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': waiterLoading === todoItem.id,
            })}
          >
            <div
              className="modal-background
                                has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};
