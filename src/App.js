import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './App.css'
import maya from './maya.jpeg'

import { Deploy } from './Component/Deploy/Deploy';

function App() {
  const [rows,setRows] = useState(1)
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('https://maya-daniel-todolist.herokuapp.com/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    try {
      const response = await fetch('https://maya-daniel-todolist.herokuapp.com/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTaskText }),
      });
      const data = await response.json();
      setTasks([...tasks, data]);
      setNewTaskText('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (taskId, text, completed) => {
    try {
      await fetch(`https://maya-daniel-todolist.herokuapp.com/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, completed }),
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(`https://maya-daniel-todolist.herokuapp.com/tasks/${taskId}`, {
        method: 'DELETE',
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="App">
      <Deploy></Deploy>
      <img src={maya} alt="maya and daniel in mitzpe" />
      <h1>Maya & Daniel's <br></br>TO DO List</h1>
      <textarea value={newTaskText}  name="var_1" rows={rows} cols="30" wrap="soft" onChange={(e) => {setNewTaskText(e.target.value);setRows(Math.ceil(newTaskText.length/30)*2)}}></textarea>
      <button className='button-3' onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <button style={{marginRight:10}} className="delete-button" onClick={() => deleteTask(task.id)}>
            <FontAwesomeIcon icon={faTrash} />
            </button>

            <div className='checkbox' onClick={()=>updateTask(task.id, task.text,!task.completed)} style={{backgroundColor: task.completed ?'#4ade30':'#de304d', marginRight:10}}></div>
            {/* <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => updateTask(task.id, task.text, e.target.checked)}
            /> */}
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.text}
            </span>
            
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;