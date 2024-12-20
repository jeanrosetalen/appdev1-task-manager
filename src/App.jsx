import { useEffect, useState } from 'react'
import './App.css'
import { db } from './firebase'
//these are the following functions that will be used:
import { collection, doc, getDocs, deleteDoc, addDoc, updateDoc, getDoc } from "firebase/firestore";

function App() {

  //STATE FOR FETCHING TASKS
  const [tasks, setTasks] = useState([]);

  //STATE FOR ADDING TASKS
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  //FETCHING THE DOCUMENTS FROM THE COLLECTION
  const fetchTasks = async () => {
    const collectionRef = collection(db, 'tasks');
    const querySnapshot = await getDocs(collectionRef);

    //map all the tasks and get their respective id
    const tasks = querySnapshot.docs.map((task) => ({
      id: task.id,
      ...task.data() 
    }))
    setTasks(tasks)
  }

  //CALL THE FUNCTION USING useEffect
  useEffect(() => {
    fetchTasks();
  }, []);

  //FUNCTION THAT DELETES DOC FROM THE FIRESTORE
  const deleteTask = async (id) => {

    //calling the document reference, to delete a specific task
    const docRef = doc(db, 'tasks', id)
    await deleteDoc(docRef)

    //Reflecting changes in user perspective
    setTasks((prevTasks) => prevTasks.filter(task => task.id !== id))
  }

  //ADDING TASK FUNCTION AND REFLECTING TO USER PERSPECTIVE
  const addTask = async (e) => {
    e.preventDefault();
    //calling the collection
    const collectionRef = collection(db, 'tasks');
    await addDoc(collectionRef, {
      title: title,
      body: body,
      status: 'pending'
    })
    //calling the setTitle and setBody with empty parameters to clear the input line
    setTitle('')
    setBody('')
    alert('Task added')
  }

  //CHANGING FIELD STATUS
  //creating a function called 'handleStatus'
  const handleStatus = async (id) => {
    try {
      const itemRef = doc(db, 'tasks', id);
      const currentTask = await getDoc(itemRef);
      const currentStatus = currentTask.data().status;
      const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';

      //using the updateDoc function to make changes in the database
      await updateDoc(itemRef, {
        status: newStatus,
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <>
      {/*ADDING TASKS COMPONENT*/}
      <div className="formStyle">
        <h1>My Tasks</h1>
        <h3>Add New Task</h3>
        <form onSubmit={addTask} className='container'>
          <input type="text" name="title" id="title" placeholder="title" value={title} required onChange={(e) => setTitle(e.target.value)} />
          <textarea name="desc" id="desc" placeholder="description" value={body} required onChange={(e) => setBody(e.target.value)}></textarea>
          <button type="submit" id='submit' onClick={() => { setTimeout(() => { window.location.reload() }, 1500) }}>Add task</button>
        </form>
      </div>

      {/*DISPLAYING THE TASKS*/}
      {
        tasks.map((task) => (
          <div key={task.id} id='display-container'>
            <div id='task-title'>
              Title: {task.title}
            </div>
            <div id='task-body'>
              Description: {task.body}
            </div>
            <div id='task-status'>
               status:    
              <button onClick={() => {handleStatus(task.id)}}>
                {task.status}
              </button>
            </div >
            <button id='task-delete' onClick={() => deleteTask(task.id)}>
              Delete task
            </button>
          </div>

        ))
      }
    </>
  )
}

export default App