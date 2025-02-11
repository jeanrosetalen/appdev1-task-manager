import { useEffect, useState } from 'react'
import { db } from '../firebase.js'
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc }from 'firebase/firestore'
import { Signout } from './Signout.jsx'

const ListTodos = ({ user }) => {
    const [loading, setLoading] = useState(true)
    const [newTodo, setNewTodo] = useState('')
    const [todos, setTodos] = useState([])

    const fetchTodos = async () => {
        try {
            const collectionRef = collection(db, 'todos')
            const querySnapshot = await getDocs(collectionRef)
            const todos = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))

            setTodos(todos)
            setLoading(false)
        } catch(error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        fetchTodos()

    }, [])
    
    const handleToggleTodo = async (id, completed) => {

        const todoRef = doc(db, 'todos', id)
        await updateDoc(todoRef, {
            completed: !completed
        })


        setTodos(todos.map(todo => (
        todo.id === id ? {...todo, completed: !completed } : todo
        )))
    }

    const handleDeleteTodo = async (id) => {
        const todoRef = doc(db, 'todos', id)
        await deleteDoc(todoRef)
        setTodos(todos.filter(todo => todo.id !== id))
    }

    const handleNewTodo = async () => {
        const collectionRef = collection(db, 'todos')
        const docRef = await addDoc(collectionRef, {
            title: newTodo,
            completed: false

        })
        setTodos([...todos, {id: docRef.id, title: newTodo, completed: false }])
        setNewTodo('')
    }

    if (loading) return <>Loading ....</>

    return (
        <>
            <div>
                <h1>Todo React App</h1>
                <h3>Welcome, {user.displayName || user.email} | <Signout /></h3>
                <input type="text" value={newTodo} placeholder='Add todo' onChange={(e) => setNewTodo(e.target.value)} />
                <button onClick={handleNewTodo}>Add</button>

                {todos.map(todo => (
                    <li key={todo.id}>
                        <input type="checkbox" 
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo.id, todo.completed)}/>
                        {todo.completed ?<s>{todo.title}</s> : todo.title }
                        <button onClick={() => handleDeleteTodo(todo.id)}>delete</button>
                    </li>
                ))}
                
            </div>
        
        </>
    )
}

export default ListTodos