import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { db } from './firebase'
import './App.css'



function App() {
  const [tasks, setTasks] = useState([]);

  // fetching documents
  const fetchTasks = async () => {
    const collectionRef = collection(db, 'tasks');
    const querySnapshot = await getDocs(collectionRef);
    const tasks = querySnapshot.docs.map((tasks) => ({
      id: tasks.id,
      ...task.data()
    }))
    setTasks(tasks)
  }

  useEffect(() => {
    fetchTasks();
  }, [])

  return (
    <>
    {
      tasks.map((task) =>(
        <div key={task.id}>
          <div>
            task title: {task.title}
          </div>
          <div>
            task body: {task.body}
          </div>
          <div>
            task title: {task.status}
          </div>
         
        </div>
      ))
    }
      
    </>
  )
}

export default App
