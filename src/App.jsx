import './App.css'
import Header from './componentes/Header/Header'
import { Outlet } from 'react-router-dom'


const App = () => {
  return (
    <>
    <Header/>
    <Outlet/>
    </>
  )
}
export default App
