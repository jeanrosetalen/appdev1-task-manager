import { useEffect, useState } from 'react'
import ListTodos from './components/ListTodos'
import { BrowserRouter, Routes, Route } from "react-router";
import { Signin } from './components/Signin';
import { Signup } from './components/Signup';
import { onAuthStateChanged  } from 'firebase/auth';
import { auth } from './firebase';


function App() {

  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return unsubscribe
  }, [])


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <ListTodos user={user} /> : <Signin /> } />
          <Route path="/Signin" element={<Signin />} />
          <Route path="/Signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
      
      
      {/* <h1>Todo React App</h1>
      {user ? (
        <ListTodos user={user} />
      ) : (
        <p>You must login to view the todo lists.</p>
      )}
     */}
    </> 
  )
}

export default App
