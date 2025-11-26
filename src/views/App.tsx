import { useEffect, useState } from 'react'
import './App.css'

function App() {
  useEffect(() => {

    // window.electron.getUsers().then((data) => console.log(data));

  }, []);

  const handlerOnclick = async () => {
    const user: User = {
      name: 'julio',
      email: `elbonsai87`,
      password: '123',
      role: 'developer',
      status: 'register'
    }

    // const userts: User = await window.electron.users.gePromise<void>tById(1);
    // console.log(userts);

    const addUser = await window.electron.users.addUser(user);
    console.log('adddd', addUser);



  }

  return (
    <>
      <div>
        <p>mi nombre es: </p>

        <p>mi email es: </p>
      </div>

      <button onClick={handlerOnclick} >agregar</button>
    </>
  )
}

export default App
