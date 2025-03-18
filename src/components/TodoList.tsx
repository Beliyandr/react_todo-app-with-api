import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { OptionUpdate } from '../types/OptionsType';
import { updateTodo } from '../api/todos';
import { TodoItem } from './TodoItem';
import { TempTodoItem } from './TempTodoItem';

type Props = {
  todos: Todo[] | [];
  tempTodo: Todo | null;
  filteredTodos: Todo[] | null;
  removeTodo: (id: number) => void;
  updateChecked: (updatedTodo: Todo, option: OptionUpdate) => void;
  showError: (text: string) => void;
  setTodos: Function;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  filteredTodos,
  removeTodo = () => {},
  updateChecked = () => {},
  showError = () => {},
  setTodos = () => {},
}) => {
  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);
  const [waiterLoading, setWaiterLoading] = useState<number | null>(null);

  const updateTitle = (editTodo: Todo) => {
    const isEdit = todos.some(oldTodo => {
      return oldTodo.id === editTodo.id && oldTodo.title === editTodo.title;
    });

    console.log(isEdit);
    if (isEdit) {
      setEditedTodo(null);

      return;
    }

    if (!editTodo.title.trim()) {
      removeTodo(editTodo.id);

      return;
    }

    return updateTodo({ ...editTodo, title: editTodo.title.trim() })
      .then(todoItem => {
        setWaiterLoading(editTodo.id);
        setTodos((currentTodos: Todo[]) => {
          const newPosts = [...currentTodos];
          const index = newPosts.findIndex(
            todoIndex => todoIndex.id === editTodo.id,
          );

          newPosts.splice(index, 1, todoItem);

          return newPosts;
        });
        setEditedTodo(null);
      })
      .catch(() => {
        showError('Unable to update a todo');
      })
      .finally(() => {
        setWaiterLoading(null);
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos?.map(todoItem => (
        <TodoItem
          key={todoItem.id}
          todoItem={todoItem}
          updateChecked={updateChecked}
          editedTodo={editedTodo}
          setEditedTodo={setEditedTodo}
          removeTodo={removeTodo}
          waiterLoading={waiterLoading}
          updateTitle={updateTitle}
        />
      ))}

      {tempTodo && <TempTodoItem key={tempTodo.id} tempTodo={tempTodo} />}
    </section>
  );
};
