'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
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
        body: JSON.stringify({ title: task.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      setTask('');
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ padding: '50px', maxWidth: '500px', margin: '0 auto', color: '#ffffff' }}>
      <h1 style={{ color: '#ffffff', marginBottom: '24px' }}>Task Manager</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          disabled={isLoading}
          style={{ 
            flex: 1,
            padding: '12px', 
            color: '#000000', 
            backgroundColor: '#ffffff', 
            border: '2px solid #ccc', 
            borderRadius: '6px',
            fontSize: '16px'
          }}
        />
        <button 
          type="submit" 
          disabled={isLoading} 
          style={{ 
            padding: '12px 24px', 
            cursor: 'pointer', 
            backgroundColor: '#0070f3', 
            color: '#ffffff', 
            border: 'none', 
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '16px',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {error && <p style={{ color: '#ff4d4d', marginTop: '10px', fontWeight: 'bold' }}>{error}</p>}

      <h2 style={{ color: '#ffffff', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '16px' }}>Your Tasks</h2>
      {taskList.length === 0 ? (
        <p style={{ color: '#aaaaaa' }}>No tasks found. Add one above!</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {taskList.map((t) => (
            <li 
              key={t._id} 
              style={{ 
                padding: '14px', 
                backgroundColor: '#1a1a1a', 
                color: '#ffffff',
                marginBottom: '10px', 
                borderRadius: '6px',
                borderLeft: '5px solid #0070f3',
                fontSize: '16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {t.title}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}