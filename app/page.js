'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState(''); // 🎯 NEW: Track selected calendar date
  const [taskList, setTaskList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.status === 401) return router.push('/auth');
      if (response.ok) {
        const data = await response.json();
        setTaskList(data);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
      if (response.status === 401) return router.push('/auth');
      if (response.ok) fetchTasks();
    } catch (err) {
      console.error("Delete failed:", err);
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
      console.error("Status update failed:", err);
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
        // 🎯 NEW: Send the dueDate string across the wire to the database
        body: JSON.stringify({ title: task.trim(), dueDate: dueDate || null }),
      });
      if (response.status === 401) return router.push('/auth');
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      
      setTask('');
      setDueDate(''); // Clear the calendar input field
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusClassName = (status) => {
    if (status === 'in progress') return 'status-in-progress';
    if (status === 'done') return 'status-done';
    return 'status-not-done';
  };

  // Helper to format dates cleanly on the card (e.g., "May 19, 2026")
  const formatDateDisplay = (dateString) => {
    if (!dateString) return null;
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Helper to check if a task is overdue
  const isOverdue = (dateString, status) => {
    if (!dateString || status === 'done') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateString) < today;
  };

  const totalCount = taskList.length;
  const notDoneCount = taskList.filter(t => t.status === 'not done').length;
  const inProgressCount = taskList.filter(t => t.status === 'in progress').length;
  const doneCount = taskList.filter(t => t.status === 'done').length;

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
        {/* 🎯 NEW: Calendar Input field inside the form layout */}
        <input 
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={isLoading}
          className="task-date-input"
        />
        <button type="submit" disabled={isLoading} className="task-button">
          {isLoading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {error && <p className="task-error">{error}</p>}

      {/* Analytics Section */}
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

      {/* Category Navigation Bar */}
      <div className="filter-bar">
        {['all', 'not done', 'in progress', 'done'].map((filterName) => (
          <button
            key={filterName}
            onClick={() => setActiveFilter(filterName)}
            className={`filter-btn ${activeFilter === filterName ? 'filter-active' : ''}`}
          >
            {filterName === 'not done' ? '❌ To-Do' : filterName === 'in progress' ? '⏳ Active' : filterName === 'done' ? '✅ Completed' : '🌐 All'}
          </button>
        ))}
      </div>

      <h2 className="task-subtitle">Your Tasks</h2>
      {filteredTasks.length === 0 ? (
        <p className="task-empty">No tasks match this filter category.</p>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((t) => (
            <li key={t._id} className="task-item">
              <div className="task-item-content">
                <div className="task-text-block">
                  <span className={t.status === 'done' ? 'task-text-done' : 'task-text-active'}>
                    {t.title}
                  </span>
                  
                  {/* 🎯 NEW: Dynamic Deadline Alert sub-label */}
                  {t.dueDate && (
                    <span className={`task-date-badge ${isOverdue(t.dueDate, t.status) ? 'date-overdue' : ''}`}>
                      📅 {isOverdue(t.dueDate, t.status) ? `Overdue: ${formatDateDisplay(t.dueDate)}` : formatDateDisplay(t.dueDate)}
                    </span>
                  )}
                </div>
                
                <select 
                  value={t.status} 
                  onChange={(e) => handleStatusChange(t._id, e.target.value)}
                  className={`status-select-badge ${getStatusClassName(t.status)}`}
                >
                  <option value="not done">❌ Not Done</option>
                  <option value="in progress">⏳ In Progress</option>
                  <option value="done">✅ Done</option>
                </select>
                
                <button onClick={() => handleDelete(t._id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}