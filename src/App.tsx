import { useState, useEffect} from 'react'
import { TodoItem } from './TodoItem'

type Task = {
  id: number
  title: string
  priority: string
  done: boolean
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(()=>{
    const saved=localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [priorityValue, setPriorityValue] = useState('')
  const [filter,setFilter]=useState<'all'|'active'|'done'>('all')
  const [editingId,setEditingId]=useState<number|null>(null)
  const [editingVaule,setEditingVaule]=useState('')

  const handleAdd = () => {
    if (inputValue.trim() === '') return
    const priority = priorityValue.trim() === '' ? 'средний' : priorityValue
    const newTask: Task = {
      id: Date.now(),
      title: inputValue,
      priority: priority,
      done: false,
    }
    setTasks([...tasks, newTask])
    setInputValue('')
    setPriorityValue('')
  }

  const handleDelete = (idToDelete: number) => {
    setTasks(tasks.filter((task) => task.id !== idToDelete))
  }

  const handleToggle = (idToToggle: number)=> {
    setTasks(
      tasks.map((task)=> task.id === idToToggle?{...task,done:!task.done}:task)
    )
  }
  const handleEdit=(task:Task)=>{
    setEditingId(task.id)
    setEditingVaule(task.title)
  }
  const filteredTasks=tasks.filter(task =>{
    if(filter==='active')return !task.done
    if(filter==='done')return task.done
    return true
  })
  const handleSave=(id:number)=>{
    if(editingVaule.trim()=='') return
    setTasks(
      tasks.map((task)=>
        task.id === id?{...task, title:editingVaule}:task
    ))
    
    setEditingId(null)
    setEditingVaule('')
  }
  useEffect(()=>{
    localStorage.setItem('tasks',JSON.stringify(tasks))
  }, [tasks])
  return (

    <div className='min-h-screenbg-gray-100'>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
      <h1 className="3x1 font bold text-gray-800 mb-6">Мои задачи</h1>
      <div className="flex gap-2">
        <button onClick={()=>setFilter('all')}
          className={`rounded-b-full font-medium px-4 py-0.5 transition-colors
            ${filter === 'all' ? 'bg-blue-500 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
          >все</button>
        <button onClick={()=>setFilter('active')}
          className={`rounded-b-full font-medium px-4 py-0.5 transition-colors
            ${filter === 'all' ? 'bg-blue-500 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
          >активные</button>
        <button onClick={()=>setFilter('done')}
          className={`rounded-b-full font-medium px-4 py-0.5 transition-colors
            ${filter === 'all' ? 'bg-blue-500 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
          >выпониные</button>
      </div>
      <ul>
        {filteredTasks.map((task) => (
          <TodoItem 
            task={task}
            editingId={editingId}
            editingValue='editingValue'
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onSave={handleSave}
            setEditingValue={setEditingVaule}
          />
        ))}
      </ul>
      <div className='flex flex-col gap-1 mt-5'>
      <input
        type="text"
        placeholder="задача"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
        className="border border-gray-300 rounded-lg px-3 py-1 text-sm outline-none focus:border-blue-400 transition-colors"
      />
      <input
        type="text"
        placeholder="приоритет"
        value={priorityValue}
        onChange={(e) => setPriorityValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
        className="border border-gray-300 rounded-lg px-3 py-1 text-sm outline-none focus:border-blue-400 transition-colors"
      />
      <button onClick={handleAdd} className=
      "bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors"
      >Добавить</button>
      </div>
      </div>
    </div>
  )
}