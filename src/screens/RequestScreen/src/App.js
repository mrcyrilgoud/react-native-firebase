import Header from './components/Header'
import Tasks from './components/Tasks'
import { useState, useEffect} from "react"
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'

function App() {
  const [tasks,setTasks] = useState([])

  const[showAddTask, setShowAddTask] = useState(false)

  useEffect( () =>{
      const getTasks = async()=>{
        const tasksFromServer = await fetchTasks()
        setTasks(tasksFromServer)

      }

    getTasks()
  }, [])

  const fetchTasks = async()=>{
    const res=await fetch('http://localhost:5000/tasks')
    const data= await res.json()

    return data
  }

  const fetchTask = async(id)=>{
    const res=await fetch(`http://localhost:5000/tasks/${id}`)
    const data= await res.json()

    return data
  }

  const addTask = async(task)=>{
      const res = await fetch('http://localhost:5000/tasks',{
        method: 'Post',
        headers:{
          'Content-type': 'application/json'

        },
        body: JSON.stringify(task)
      })

      const data = await res.json()

      setTasks([...tasks,data])
    //const id=Math.floor(Math.random()*10000)+1
   // const newTask = {id, ...task}
    //setTasks([...tasks,newTask])
  }

 const deleteTask = async(id) =>{
   await fetch(`http://localhost:5000/tasks/${id}`,{
     method: `DELETE`
   })
   setTasks(tasks.filter((task)=>task.id!==id))
 }

 const toggleReminder = async (id)=>{
   const taskToToggle = await fetchTask(id)
   const updTask = {...taskToToggle,
  reminder: !taskToToggle.reminder}

  const res = await fetch(`http://localhost:5000/tasks/${id}`,{
    method: 'PUT',
    headers:{
      'Content-type': 'application/json'
    },
    body: JSON.stringify(updTask)
  })

  const data = await res.json()
   setTasks(tasks.map((task) => task.id===id ? {...task, 
    reminder:data.reminder} :task))
 }



  return (
    <Router>
    <div className="container" 
    style={{backgroundColor :'#91c0c8'}}>
      <Header
      onAdd={()=>setShowAddTask(!showAddTask)}
      showAdd={showAddTask}
      /> <>
          {showAddTask && < AddTask
          onAdd={addTask}
          />}

          {tasks.length > 0 ? <Tasks tasks={tasks} 
          onDelete={deleteTask}
          onToggle={toggleReminder}
          /> :'No Requests'}
          </>
        
        
        
      
      
      <Footer />
    </div>
    </Router>
  )
}

export default App;
