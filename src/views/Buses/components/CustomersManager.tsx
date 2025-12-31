"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Users, Plus, Search, Edit, Trash2, ArrowLeft, Phone, Mail, MapPin, Calendar } from "lucide-react"
import CustomerForm from "./CustomerForm"

// Datos de ejemplo - reemplazar con datos de tu base de datos
const initialClientes = [
  {
    id: 1,
    nombre: "Juan PΓ©rez GΓ³mez",
    telefono: "5512345678",
    email: "juan.perez@email.com",
    direccion: "Av. Insurgentes 123, CDMX",
    fechaRegistro: "2024-01-15",
    viajesRealizados: 12,
    activo: true,
  },
  {
    id: 2,
    nombre: "MarΓ­a LΓ³pez HernΓ'ndez",
    telefono: "5523456789",
    email: "maria.lopez@email.com",
    direccion: "Calle Reforma 456, Guadalajara",
    fechaRegistro: "2024-02-01",
    viajesRealizados: 8,
    activo: true,
  },
  {
    id: 3,
    nombre: "Carlos RamΓ­rez SΓ'nchez",
    telefono: "5534567890",
    email: "carlos.ramirez@email.com",
    direccion: "Blvd. Juarez 789, Monterrey",
    fechaRegistro: "2024-02-10",
    viajesRealizados: 25,
    activo: true,
  },
  {
    id: 4,
    nombre: "Ana MartΓ­nez Torres",
    telefono: "5545678901",
    email: "",
    direccion: "Av. Hidalgo 321, Puebla",
    fechaRegistro: "2024-01-20",
    viajesRealizados: 3,
    activo: false,
  },
  {
    id: 5,
    nombre: "Roberto GonzΓ'lez Flores",
    telefono: "5556789012",
    email: "roberto.gonzalez@email.com",
    direccion: "Calle Morelos 654, QuerΓ©taro",
    fechaRegistro: "2024-03-01",
    viajesRealizados: 15,
    activo: true,
  },
]

type Cliente = (typeof initialClientes)[0]

export default function CustomersManager() {
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes)
  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState<"list" | "add" | "edit">("list")
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono.includes(searchTerm) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.direccion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCliente = (newCliente: Omit<Cliente, "id" | "fechaRegistro" | "viajesRealizados">) => {
    const id = Math.max(...clientes.map((c) => c.id), 0) + 1
    const fechaRegistro = new Date().toISOString().split("T")[0]
    setClientes([...clientes, { ...newCliente, id, fechaRegistro, viajesRealizados: 0 }])
    setView("list")
  }

  const handleEditCliente = (updatedCliente: Omit<Cliente, "id" | "fechaRegistro" | "viajesRealizados">) => {
    if (editingCliente) {
      setClientes(
        clientes.map((c) =>
          c.id === editingCliente.id
            ? {
                ...updatedCliente,
                id: editingCliente.id,
                fechaRegistro: editingCliente.fechaRegistro,
                viajesRealizados: editingCliente.viajesRealizados,
              }
            : c,
        ),
      )
      setEditingCliente(null)
      setView("list")
    }
  }

  const handleDeleteCliente = (id: number) => {
    if (confirm("ΒΏEstΓ's seguro de que deseas eliminar este cliente?")) {
      setClientes(clientes.filter((c) => c.id !== id))
    }
  }

  const handleToggleActivo = (id: number) => {
    setClientes(clientes.map((c) => (c.id === id ? { ...c, activo: !c.activo } : c)))
  }

  const startEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setView("edit")
  }

  if (view === "add") {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setView("list")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a la lista
        </Button>
        <CustomerForm onSubmit={handleAddCliente} onCancel={() => setView("list")} />
      </div>
    )
  }

  if (view === "edit" && editingCliente) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setView("list")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a la lista
        </Button>
        <CustomerForm
          initialData={editingCliente}
          onSubmit={handleEditCliente}
          onCancel={() => {
            setEditingCliente(null)
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
          <h1 className="text-3xl font-bold text-balance mb-2">GestiΓ³n de Clientes</h1>
          <p className="text-muted-foreground text-pretty">Administra la informaciΓ³n de tus clientes</p>
        </div>
        <Button onClick={() => setView("add")} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Agregar Cliente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nombre, telΓ©fono, email o direcciΓ³n..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClientes.map((cliente) => (
          <Card key={cliente.id} className={`transition-all hover:shadow-md ${!cliente.activo ? "opacity-60" : ""}`}>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-balance truncate">{cliente.nombre}</h3>
                    <p className="text-sm text-muted-foreground">{cliente.viajesRealizados} viajes realizados</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={cliente.activo ? "default" : "secondary"} className="text-xs">
                  {cliente.activo ? "Activo" : "Inactivo"}
                </Badge>
                {cliente.viajesRealizados > 10 && (
                  <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400" variant="secondary">
                    Cliente Frecuente
                  </Badge>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium text-foreground truncate">{cliente.telefono}</span>
                </div>
                {cliente.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium text-foreground truncate">{cliente.email}</span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-pretty line-clamp-2">{cliente.direccion}</span>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Registro: <span className="font-medium text-foreground">{cliente.fechaRegistro}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => startEdit(cliente)} className="flex-1 gap-2">
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleToggleActivo(cliente.id)} className="flex-1">
                  {cliente.activo ? "Desactivar" : "Activar"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCliente(cliente.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClientes.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron clientes</h3>
          <p className="text-muted-foreground mb-4">Intenta con otra bΓΊsqueda o agrega un nuevo cliente</p>
          <Button onClick={() => setView("add")} className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar Primer Cliente
          </Button>
        </div>
      )}
    </div>
  )
}
