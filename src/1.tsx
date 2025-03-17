<React.Fragment key={todoItem.id}>
  {/* This todo is being edited */}
  <div
    data-cy="Todo"
    className={classNames('todo', {
      completed: todoItem.completed,
    })}
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        onChange={() => {
          updateChecked(todoItem);
        }}
        checked={todoItem.completed}
      />
    </label>

    {/* This form is shown instead of the title and remove button */}
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
          editeOndDoubleClick(event);
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
  </div>
</React.Fragment>;
