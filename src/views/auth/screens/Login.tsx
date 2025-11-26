import { useNavigate } from "react-router-dom"


export default function Login(){

    const navigate = useNavigate()

    const handleClick = ()=> {
        navigate('/dashboard');
    }

    return(
        <>
        <h1>login</h1>
        <button onClick={handleClick}>INICIAR SESION</button>
        
        </>
    )
}