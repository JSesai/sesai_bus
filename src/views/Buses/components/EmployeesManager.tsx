import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Users, Plus, Search, Edit, Trash2, ArrowLeft, Phone, UserCircle } from "lucide-react"
import EmployeeForm from "./EmployeeForm"

// Datos de ejemplo - reemplazar con datos de tu base de datos
const initialUsuarios = [
    {
        id: 1,
        nombre: "Carlos MartΓ­nez LΓ³pez",
        usuario: "cmartinez",
        telefono: "5512345678",
        rol: "taquillero",
        activo: true,
        fechaRegistro: "2024-01-15",
    },
    {
        id: 2,
        nombre: "Ana GarcΓ­a Torres",
        usuario: "agarcia",
        telefono: "5523456789",
        rol: "encargado",
        activo: true,
        fechaRegistro: "2024-02-01",
    },
    {
        id: 3,
        nombre: "Roberto Flores SΓ'nchez",
        usuario: "rflores",
        telefono: "5534567890",
        rol: "chofer",
        activo: true,
        fechaRegistro: "2024-02-10",
    },
    {
        id: 4,
        nombre: "MarΓ­a RodrΓ­guez PΓ©rez",
        usuario: "mrodriguez",
        telefono: "5545678901",
        rol: "checador",
        activo: false,
        fechaRegistro: "2024-01-20",
    },
    {
        id: 5,
        nombre: "Luis HernΓ°ndez Ruiz",
        usuario: "lhernandez",
        telefono: "5556789012",
        rol: "taquillero",
        activo: true,
        fechaRegistro: "2024-03-01",
    },
]

type Usuario = (typeof initialUsuarios)[0]

const rolColors = {
    taquillero: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    encargado: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    chofer: "bg-green-500/10 text-green-700 dark:text-green-400",
    checador: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
}

const rolLabels = {
    taquillero: "Taquillero",
    encargado: "Encargado",
    chofer: "Chofer",
    checador: "Checador",
}

export default function EmployeesManager() {
    const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios)
    const [searchTerm, setSearchTerm] = useState("")
    const [view, setView] = useState<"list" | "add" | "edit">("list")
    const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null)

    const filteredUsuarios = usuarios.filter(
        (usuario) =>
            usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.telefono.includes(searchTerm),
    )

    const handleAddUsuario = (newUsuario: Omit<Usuario, "id" | "fechaRegistro">) => {
        const id = Math.max(...usuarios.map((u) => u.id), 0) + 1
        const fechaRegistro = new Date().toISOString().split("T")[0]
        setUsuarios([...usuarios, { ...newUsuario, id, fechaRegistro }])
        setView("list")
    }

    const handleEditUsuario = (updatedUsuario: Omit<Usuario, "id" | "fechaRegistro">) => {
        if (editingUsuario) {
            setUsuarios(
                usuarios.map((u) =>
                    u.id === editingUsuario.id
                        ? { ...updatedUsuario, id: editingUsuario.id, fechaRegistro: editingUsuario.fechaRegistro }
                        : u,
                ),
            )
            setEditingUsuario(null)
            setView("list")
        }
    }

    const handleDeleteUsuario = (id: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            setUsuarios(usuarios.filter((u) => u.id !== id))
        }
    }

    const handleToggleActivo = (id: number) => {
        setUsuarios(usuarios.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u)))
    }

    const startEdit = (usuario: Usuario) => {
        setEditingUsuario(usuario)
        setView("edit")
    }

    if (view === "add") {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => setView("list")} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Volver a la lista
                </Button>
                <EmployeeForm onSubmit={handleAddUsuario} onCancel={() => setView("list")} />
            </div>
        )
    }

    if (view === "edit" && editingUsuario) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => setView("list")} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Volver a la lista
                </Button>
                <EmployeeForm
                    initialData={editingUsuario}
                    onSubmit={handleEditUsuario}
                    onCancel={() => {
                        setEditingUsuario(null)
                        setView("list")
                    }}
                    isEditing
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-balance mb-2">Gestión de Usuarios</h1>
                    <p className="text-muted-foreground text-pretty">Administra los empleados del sistema</p>
                </div>
                <Button onClick={() => setView("add")} size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Agregar Usuario
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Buscar por nombre, usuario, rol o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11"
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredUsuarios.map((usuario) => (
                    <Card key={usuario.id} className={`transition-all hover:shadow-md ${!usuario.activo ? "opacity-60" : ""}`}>
                        <CardContent className="p-5 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <UserCircle className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-base text-balance truncate">{usuario.nombre}</h3>
                                        <p className="text-sm text-muted-foreground">@{usuario.usuario}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge className={rolColors[usuario.rol as keyof typeof rolColors]} variant="secondary">
                                    {rolLabels[usuario.rol as keyof typeof rolLabels]}
                                </Badge>
                                <Badge variant={usuario.activo ? "default" : "secondary"} className="text-xs">
                                    {usuario.activo ? "Activo" : "Inactivo"}
                                </Badge>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">
                                        TelΓ©fono: <span className="font-medium text-foreground">{usuario.telefono}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <UserCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">
                                        Usuario: <span className="font-medium text-foreground">@{usuario.usuario}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-border pt-3">
                                <p className="text-xs text-muted-foreground">
                                    Fecha de registro: <span className="font-medium text-foreground">{usuario.fechaRegistro}</span>
                                </p>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm" onClick={() => startEdit(usuario)} className="flex-1 gap-2">
                                    <Edit className="h-4 w-4" />
                                    Editar
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleToggleActivo(usuario.id)} className="flex-1">
                                    {usuario.activo ? "Desactivar" : "Activar"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteUsuario(usuario.id)}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredUsuarios.length === 0 && (
                <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No se encontraron usuarios</h3>
                    <p className="text-muted-foreground mb-4">Intenta con otra bΓΊsqueda o agrega un nuevo usuario</p>
                    <Button onClick={() => setView("add")} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Agregar Primer Usuario
                    </Button>
                </div>
            )}
        </div>
    )
}
