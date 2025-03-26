import { RouterProvider } from 'react-router-dom'
import { Routes } from './routes/AppRouter'

function App() {

  return (
    <>
      <RouterProvider router={Routes}/>
    </>
  )
}

export default App