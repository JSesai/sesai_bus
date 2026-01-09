import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"

export default function FinishStep() {
  const navigate = useNavigate()

  const finish = async () => {
    // await window.electron.invoke("updateAppConfig", {
    //   initial_setup_completed: 1
    // })

    navigate("/dashboard")
  }

  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400">
        🎉 Configuración completa
      </h2>

      <p className="text-slate-400">
        Tu sistema está listo para operar.
      </p>

      <Button size="lg" onClick={finish}>
        Ir al dashboard
      </Button>
    </div>
  )
}
