"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TodoApiClient, TodoItem } from "@/lib/api";

/**
// PUBLIC_INTERFACE
 * useTodos
 * React hook to manage todo list with loading, errors, and CRUD actions.
 */
export function useTodos() {
  const api = useMemo(() => new TodoApiClient(), []);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listTodos();
      setTodos(data);
    } catch {
      setError("Unable to load todos.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void load();
  }, [load]);

  const addTodo = useCallback(
    async (title: string) => {
      if (!title.trim()) return;
      setSubmitting(true);
      setError(null);
      try {
        const created = await api.createTodo({ title: title.trim() });
        setTodos((prev) => [created, ...prev]);
      } catch {
        setError("Failed to add todo.");
      } finally {
        setSubmitting(false);
      }
    },
    [api]
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      setError(null);
      try {
        const existing = todos.find((t) => t.id === id);
        if (!existing) return;
        const updated = await api.updateTodo(id, { completed: !existing.completed });
        setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } catch {
        setError("Failed to update todo.");
      }
    },
    [api, todos]
  );

  const editTodo = useCallback(
    async (id: string, title: string) => {
      if (!title.trim()) return;
      setError(null);
      try {
        const updated = await api.updateTodo(id, { title: title.trim() });
        setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } catch {
        setError("Failed to rename todo.");
      }
    },
    [api]
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      setError(null);
      try {
        await api.deleteTodo(id);
        setTodos((prev) => prev.filter((t) => t.id !== id));
      } catch {
        setError("Failed to delete todo.");
      }
    },
    [api]
  );

  return {
    todos,
    loading,
    submitting,
    error,
    reload: load,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
  };
}
