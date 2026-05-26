'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const STATUS_CLASSES = {
  'in progress': 'status-in-progress',
  'done': 'status-done',
  'not done': 'status-not-done',
};

const parseDateLocal = (dateString) => {
  if (!dateString) return null;
  const [y, m, d] = dateString.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const formatDateDisplay = (dateString) => {
  const date = parseDateLocal(dateString);
  if (!date) return null;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTimeDisplay = (timeString) => {
  if (!timeString) return null;
  const [hour, minute] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const isOverdue = (dateString, status) => {
  if (!dateString || status === 'done') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parseDateLocal(dateString) < today;
};

export default function Home() {
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const router = useRouter();

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.status === 401) return router.push('/auth');
      if (response.ok) {
        const data = await response.json();
        setTaskList(data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setIsFetching(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const pendingCount = taskList.filter(t => t.status !== 'done').length;
    if (pendingCount > 0) {
      document.title = `(${pendingCount}) My Task Manager`;
    } else {
      document.title = 'My Task Manager';
    }
  }, [taskList]);

  const handleEdit = (t) => {
    setEditingId(t._id);
    setEditTitle(t.title);
    setEditDate(t.dueDate || '');
    setEditTime(t.dueTime || '');
  };

  const handleEditSave = async (id) => {
    if (!editTitle.trim()) return;
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title: editTitle.trim(), dueDate: editDate || null, dueTime: editTime || null }),
      });
      if (response.status === 401) return router.push('/auth');
      if (response.ok) {
        setEditingId(null);
        fetchTasks();
      }
    } catch (err) {
      console.error('Edit failed:', err);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDate('');
    setEditTime('');
  };

  const handleDelete = async (id) => {
    setDeleteError('');
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;
    try {
      const response = await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
      if (response.status === 401) return router.push('/auth');
      if (response.ok) {
        fetchTasks();
      } else {
        setDeleteError('Could not delete the task. Please try again.');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setDeleteError('Could not delete the task. Please try again.');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (response.status === 401) return router.push('/auth');
      if (response.ok) await fetchTasks();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) {
      setError('Task cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.trim(), dueDate: dueDate || null, dueTime: dueTime || null }),
      });
      if (response.status === 401) return router.push('/auth');
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      setTask('');
      setDueDate('');
      setDueTime('');
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalCount = taskList.length;
  const notDoneCount = taskList.filter((t) => t.status === 'not done').length;
  const inProgressCount = taskList.filter((t) => t.status === 'in progress').length;
  const doneCount = taskList.filter((t) => t.status === 'done').length;

  const filterCounts = {
    all: totalCount,
    'not done': notDoneCount,
    'in progress': inProgressCount,
    done: doneCount,
  };

  const filterLabels = {
    all: '🌐 All',
    'not done': '❌ To-Do',
    'in progress': '⏳ Active',
    done: '✅ Completed',
  };

  const filteredTasks = taskList.filter((t) => {
    if (activeFilter === 'all') return true;
    return t.status === activeFilter;
  });

  return (
    <main className="task-container">
      <h1 className="task-title" style={{ textAlign: 'center' }}>Task Manager</h1>

      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          disabled={isLoading}
          className="task-input"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={isLoading}
          className="task-date-input"
        />
        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          disabled={isLoading}
          className="task-date-input"
        />
        <button type="submit" disabled={isLoading} className="task-button">
          {isLoading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {error && <p className="task-error">{error}</p>}
      {deleteError && <p className="task-error">{deleteError}</p>}

      <div className="analytics-grid">
        <div className="metric-card border-all">
          <p className="metric-label label-all">Total</p>
          <p className="metric-number">{totalCount}</p>
        </div>
        <div className="metric-card border-todo">
          <p className="metric-label label-todo">To-Do</p>
          <p className="metric-number text-todo">{notDoneCount}</p>
        </div>
        <div className="metric-card border-active">
          <p className="metric-label label-active">Active</p>
          <p className="metric-number text-active">{inProgressCount}</p>
        </div>
        <div className="metric-card border-done">
          <p className="metric-label label-done">Done</p>
          <p className="metric-number text-done">{doneCount}</p>
        </div>
      </div>

      <div className="filter-bar">
        {Object.entries(filterLabels).map(([filterName, label]) => (
          <button
            key={filterName}
            onClick={() => setActiveFilter(filterName)}
            className={`filter-btn ${activeFilter === filterName ? 'filter-active' : ''}`}
          >
            {label} ({filterCounts[filterName]})
          </button>
        ))}
      </div>

      <h2 className="task-subtitle">Your Tasks</h2>

      {isFetching ? (
        <p className="task-empty">Loading tasks...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="task-empty">No tasks match this filter category.</p>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((t) => (
            <li key={t._id} className="task-item">
              <div className="task-item-content">
                {editingId === t._id ? (
                  <div className="task-text-block">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="task-input"
                    />
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="task-date-input"
                    />
                    <input
                      type="time"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                      className="task-date-input"
                    />
                    <button onClick={() => handleEditSave(t._id)} className="task-button">Save</button>
                    <button onClick={handleEditCancel} className="delete-btn">Cancel</button>
                  </div>
                ) : (
                  <div className="task-text-block">
                    <span className={t.status === 'done' ? 'task-text-done' : 'task-text-active'}>
                      {t.title}
                    </span>
                    {t.dueDate && (
                      <span className={`task-date-badge ${isOverdue(t.dueDate, t.status) ? 'date-overdue' : ''}`}>
                        📅 {isOverdue(t.dueDate, t.status)
                          ? `Overdue: ${formatDateDisplay(t.dueDate)}`
                          : formatDateDisplay(t.dueDate)}
                        {t.dueTime && ` ⏰ ${formatTimeDisplay(t.dueTime)}`}
                      </span>
                    )}
                  </div>
                )}

                {editingId !== t._id && (
                  <>
                    <select
                      value={t.status}
                      onChange={(e) => handleStatusChange(t._id, e.target.value)}
                      className={`status-select-badge ${STATUS_CLASSES[t.status] ?? 'status-not-done'}`}
                      aria-label={`Status for "${t.title}"`}
                    >
                      <option value="not done">❌ Not Done</option>
                      <option value="in progress">⏳ In Progress</option>
                      <option value="done">✅ Done</option>
                    </select>

                    <button
                      onClick={() => handleEdit(t)}
                      className="edit-btn"
                      aria-label={`Edit "${t.title}"`}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(t._id)}
                      className="delete-btn"
                      aria-label={`Delete "${t.title}"`}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}