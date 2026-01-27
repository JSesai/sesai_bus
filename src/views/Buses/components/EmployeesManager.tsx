import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Users, Plus, Search, Edit, Trash2, ArrowLeft, Phone, UserCircle } from "lucide-react"
import { useDashboard } from "../../auth/context/DashBoardContext"
import { useSearchParams } from "react-router-dom"
import RegisterUser from "../../auth/screens/RegisterUser"
import { translateRole } from "../../../shared/utils/helpers"




const rolColors: Record<Exclude<Rol, null>, string> = {
    checkIn: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    manager: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    driver: "bg-green-500/10 text-green-700 dark:text-green-400",
    developer: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    ticketSeller: "bg-orange-500/10 text-orange-700 dark:text-cyan-400",
}

// const rolLabels: Record< Rol, string > = {
//     : "Taquillero",
//     encargado: "Encargado",
//     chofer: "Chofer",
//     checador: "Checador",
// }



export default function EmployeesManager({ configInitial = false }: { configInitial: boolean }) {

    const { employees, driverEmployees, numberRegisteredDriver } = useDashboard();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("")
    const [editingUsuario, setEditingUsuario] = useState<UserSample | null>(null)

    const users: UserSample[] = configInitial ? driverEmployees : employees;
    const viewActiveAtEmployees = searchParams.get("viewAtEmployees") ?? "list";

    console.log({ employees, driverEmployees, numberRegisteredDriver, users });



    // const handleAddUsuario = (newUsuario: Omit<Usuario, "id" | "fechaRegistro">) => {
    //     const id = Math.max(...usuarios.map((u) => u.id), 0) + 1
    //     const fechaRegistro = new Date().toISOString().split("T")[0]
    //     setUsuarios([...usuarios, { ...newUsuario, id, fechaRegistro }])
    //     setView("list")
    // }

    // const handleEditUsuario = (updatedUsuario: Omit<Usuario, "id" | "fechaRegistro">) => {
    //     if (editingUsuario) {
    //         setUsuarios(
    //             usuarios.map((u) =>
    //                 u.id === editingUsuario.id
    //                     ? { ...updatedUsuario, id: editingUsuario.id, fechaRegistro: editingUsuario.fechaRegistro }
    //                     : u,
    //             ),
    //         )
    //         setEditingUsuario(null)
    //         setView("list")
    //     }
    // }

    // const handleDeleteUsuario = (id: number) => {
    //     if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
    //         setUsuarios(usuarios.filter((u) => u.id !== id))
    //     }
    // }

    // const handleToggleActivo = (id: number) => {
    //     setUsuarios(usuarios.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u)))
    // }

    const startEdit = (usuario: UserSample) => {
        setEditingUsuario(usuario)
        setSearchParams(prev => {
            prev.set('viewAtEmployees', 'edit')
            return prev;
        })
    }

    if (viewActiveAtEmployees === "add") {
        return (
            <div className="space-y-6">

                <RegisterUser isEditing={false} configInitial={configInitial} onCancel={() => {
                    setSearchParams(prev => {
                        prev.set('viewAtEmployees', 'list')
                        return prev;
                    })

                }} />
            </div>
        )
    }

    if (viewActiveAtEmployees === "edit" && editingUsuario) {
        return (
            <div className="space-y-6">

                <RegisterUser
                    initialData={editingUsuario}
                    configInitial={configInitial}
                    isEditing
                    onCancel={() => {
                        setEditingUsuario(null)
                        setSearchParams(prev => {
                            prev.set('viewAtEmployees', 'list')
                            return prev;
                        })
                    }}

                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-balance mb-2">{configInitial ? 'Gestión de Operadores' : 'Gestión de Usuarios'}</h1>
                    {configInitial ?
                        <p className="text-muted-foreground text-pretty">Puedes agregar varios usuarios. Al menos un operador activo es obliogatorio</p>
                        :
                        <p className="text-muted-foreground text-pretty">Administra los empleados del sistema</p>
                    }
                </div>
                {numberRegisteredDriver > 0 && <Button onClick={() => {
                    setSearchParams(prev => {
                        prev.set('viewAtEmployees', 'add')
                        return prev;
                    })
                }} size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Agregar Usuario
                </Button>
                }
            </div>

            {configInitial ??
                < div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Buscar por nombre, usuario, rol o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11"
                    />
                </div>
            }

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                    <Card key={user.id} className={`transition-all hover:shadow-md ${user.status === 'disabled' ? "opacity-60" : ""}`}>
                        <CardContent className="p-5 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <UserCircle className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-base text-balance truncate">{user.name.toUpperCase()}</h3>
                                        <p className="text-sm text-muted-foreground">{user.userName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge className={rolColors[user.role as keyof typeof rolColors]} variant="secondary">
                                    {translateRole(user.role)}
                                </Badge>
                                <Badge variant={user.status === "active" ? "default" : "secondary"} className="text-xs">
                                    {user.status === "active" ? "Activo" : "Inactivo"}
                                </Badge>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">
                                        Teléfono: <span className="font-medium text-foreground">{user.phone}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <UserCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">
                                        Usuario: <span className="font-medium text-foreground">{user.userName}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-border pt-3">
                                <p className="text-xs text-muted-foreground">
                                    Fecha de registro: <span className="font-medium text-foreground">{user.created_at}</span>
                                </p>
                            </div>

                            {configInitial ?? <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm" onClick={() => startEdit(user)} className="flex-1 gap-2">
                                    <Edit className="h-4 w-4" />
                                    Editar
                                </Button>
                                <Button variant="outline" size="sm"
                                    // onClick={() => handleToggleActivo(user.id)}
                                    className="flex-1">
                                    {user.status === 'active' ? "Desactivar" : "Activar"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    // onClick={() => handleDeleteUsuario(usuario.id)}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                                }
                        </CardContent>
                    </Card>
                ))}
            </div>

            {
                users.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No se encontraron usuarios</h3>
                        {configInitial ?
                            <p className="text-muted-foreground mb-4">Agrega un nuevo usuario</p>
                            :
                            <p className="text-muted-foreground mb-4">Intenta con otra búsqueda o agrega un nuevo usuario</p>
                        }
                        <Button onClick={() => {
                            setSearchParams(prev => {
                                prev.set('viewAtEmployees', 'add')
                                return prev;
                            })
                        }} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Agregar Primer Usuario
                        </Button>
                    </div>
                )
            }
        </div >
    )
}
