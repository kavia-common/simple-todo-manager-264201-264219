"use client";

import { useEffect, useMemo, useState } from "react";
import { isExperimentEnabled } from "@/lib/config";
import { useTodos } from "@/hooks/useTodos";

export default function Home() {
  const {
    todos,
    loading,
    submitting,
    error,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
  } = useTodos();

  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const newChipEnabled = useMemo(() => isExperimentEnabled("showNewChip"), []);

  // Accessibility helper: focus management for edit state
  useEffect(() => {
    if (editingId) {
      // Attempt to focus the input by id
      const el = document.getElementById("edit-input");
      el?.focus();
    }
  }, [editingId]);

  const handleAdd = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    await addTodo(trimmed);
    setTitle("");
  };

  const handleKeyDownAdd = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleAdd();
    }
  };

  const startEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const confirmEdit = async () => {
    if (editingId && editingTitle.trim()) {
      await editTodo(editingId, editingTitle.trim());
      setEditingId(null);
      setEditingTitle("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  return (
    <main className="py-10">
      <section className="container-ocean">
        <div className="card-ocean overflow-hidden">
          <header
            className="header-gradient px-5 py-6 border-b border-gray-100"
            role="banner"
          >
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Simple Todo
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Keep track of tasks with a clean, modern interface.
            </p>
          </header>

          {newChipEnabled && (
            <div className="px-5 pt-4" aria-live="polite">
              <span className="chip bg-blue-50 text-blue-700 border-blue-200">
                New look enabled
              </span>
            </div>
          )}

          <div className="px-5 py-5">
            <div className="flex gap-2" role="form" aria-label="Add todo form">
              <label htmlFor="new-todo" className="visually-hidden">
                Add a new todo
              </label>
              <input
                id="new-todo"
                name="new-todo"
                className="input flex-1"
                type="text"
                placeholder="What do you need to do?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDownAdd}
                aria-disabled={submitting}
                aria-label="Todo title"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAdd}
                aria-label="Add todo"
                disabled={submitting || !title.trim()}
              >
                {submitting ? "Adding…" : "Add"}
              </button>
            </div>

            {error && (
              <div
                className="mt-4 px-3 py-2 rounded-md border border-red-200 bg-red-50 text-red-700"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-sm font-medium text-gray-600 sr-only">
                Todo list
              </h2>

              {loading ? (
                <ul
                  role="status"
                  aria-live="polite"
                  className="space-y-2"
                >
                  <li className="todo-item animate-pulse">
                    <div className="checkbox" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </li>
                  <li className="todo-item animate-pulse">
                    <div className="checkbox" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </li>
                </ul>
              ) : todos.length === 0 ? (
                <div
                  className="text-center py-10 text-gray-600"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-base">No todos yet.</p>
                  <p className="text-sm">Add your first task above.</p>
                </div>
              ) : (
                <ul
                  className="space-y-2"
                  role="list"
                  aria-label="Todo items"
                >
                  {todos.map((t) => {
                    const isEditing = editingId === t.id;
                    return (
                      <li
                        key={t.id}
                        className="todo-item"
                        role="listitem"
                        aria-label={`Todo: ${t.title}`}
                      >
                        {/* Toggle */}
                        <button
                          type="button"
                          className="checkbox"
                          aria-checked={t.completed}
                          role="checkbox"
                          data-checked={t.completed}
                          onClick={() => toggleTodo(t.id)}
                          title={t.completed ? "Mark as incomplete" : "Mark as complete"}
                        >
                          {t.completed ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              className="w-3.5 h-3.5"
                              aria-hidden="true"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          ) : null}
                          <span className="visually-hidden">
                            {t.completed ? "Completed" : "Not completed"}
                          </span>
                        </button>

                        {/* Title or edit field */}
                        <div className="min-w-0">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <label htmlFor="edit-input" className="visually-hidden">
                                Edit todo title
                              </label>
                              <input
                                id="edit-input"
                                className="input flex-1"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    void confirmEdit();
                                  } else if (e.key === "Escape") {
                                    cancelEdit();
                                  }
                                }}
                              />
                              <button
                                className="btn btn-secondary"
                                onClick={() => void confirmEdit()}
                                aria-label="Save changes"
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-ghost"
                                onClick={cancelEdit}
                                aria-label="Cancel editing"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <p
                                className={`text-sm sm:text-base text-gray-900 truncate ${t.completed ? "line-through text-gray-400" : ""}`}
                              >
                                {t.title}
                              </p>
                              {t.completed ? (
                                <span className="chip bg-green-50 text-green-700 border-green-200">
                                  Done
                                </span>
                              ) : null}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        {!isEditing ? (
                          <div className="flex items-center gap-1">
                            <button
                              className="btn btn-ghost text-blue-700"
                              onClick={() => startEdit(t.id, t.title)}
                              aria-label={`Edit ${t.title}`}
                              title="Edit"
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-ghost text-red-600"
                              onClick={() => deleteTodo(t.id)}
                              aria-label={`Delete ${t.title}`}
                              title="Delete"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <div />
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
