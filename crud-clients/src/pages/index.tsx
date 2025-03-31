"use client"

import { ICliente } from "@lib/models/Cliente";
import { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Form } from "rsuite";
import * as S from "./styles";
import "rsuite/dist/rsuite.min.css";

const { Column, HeaderCell, Cell } = Table;

type ClienteFormData = {
  _id?: string;
  nome: string;
  idade: number;
  sexo: string;
  email: string;
  telefone: string;
};

export default function Home() {
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [search, setSearch] = useState("");
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [editingCliente, setEditingCliente] = useState<ClienteFormData | null>(null);
  const [newCliente, setNewCliente] = useState<Partial<ClienteFormData>>({});

  const fetchClientes = async () => {
    try {
      const response = await fetch(`/api/clients?search=${search}`);
      if (!response.ok) throw new Error("Erro ao buscar clientes");
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar clientes");
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [search]);

  const handleCreate = async () => {
    if (Object.values(newCliente).some(value => !value)) {
      return alert("Todos os campos são obrigatórios");
    }

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCliente),
      });

      if (!response.ok) throw new Error("Erro ao criar cliente");

      setOpenModalCreate(false);
      setNewCliente({});
      fetchClientes();
      alert("Cliente criado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar cliente");
    }
  };

  const handleUpdate = async () => {
    if (!editingCliente?._id) return alert("Erro: Cliente inválido");

    try {
      const response = await fetch("/api/clients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCliente),
      });

      if (!response.ok) throw new Error("Erro ao atualizar cliente");

      setOpenModalEdit(false);
      setEditingCliente(null);
      fetchClientes();
      alert("Cliente atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar cliente");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return alert("ID do cliente inválido");
  
    console.log("ID recebido no frontend:", id);
  
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        const response = await fetch("/api/clients", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: id }),
        });
  
        console.log("Resposta do backend:", response);
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro do backend:", errorData);
  
          if (errorData.error === "Cliente não encontrado") {
            alert("O cliente que você tentou excluir não foi encontrado.");
          } else {
            throw new Error(errorData.message || "Erro ao excluir cliente");
          }
        }
  
        fetchClientes();
        alert("Cliente excluído com sucesso!");
      } catch (error) {
        console.error("Erro detalhado:", error);
        alert(error instanceof Error ? error.message : "Erro ao excluir cliente");
      }
    }
  };

  const toFormData = (cliente: ICliente): ClienteFormData => ({
    _id: cliente._id.toString(),
    nome: cliente.nome,
    idade: cliente.idade,
    sexo: cliente.sexo,
    email: cliente.email,
    telefone: cliente.telefone
  });

  return (
    <S.Container>
      <div style={{ display: "flex", marginBottom: 20, gap: 10 }}>
        <Input
          placeholder="Pesquisar por nome"
          value={search}
          onChange={setSearch}
        />
        <Button
          appearance="primary"
          onClick={() => setOpenModalCreate(true)}
        >
          Novo Cliente +
        </Button>
      </div>

      <Table data={clientes} autoHeight bordered hover>
        <Column flexGrow={1} width={100} align="center" fixed>
          <HeaderCell>ID</HeaderCell>
          <Cell dataKey="_id" />
        </Column>
        <Column flexGrow={1} width={150} align="center">
          <HeaderCell>Nome</HeaderCell>
          <Cell dataKey="nome" />
        </Column>
        <Column flexGrow={1} width={100} align="center">
          <HeaderCell>Idade</HeaderCell>
          <Cell dataKey="idade" />
        </Column>
        <Column flexGrow={1} width={100} align="center">
          <HeaderCell>Sexo</HeaderCell>
          <Cell dataKey="sexo" />
        </Column>
        <Column flexGrow={1} width={250} align="center">
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>
        <Column flexGrow={1} width={100} align="center">
          <HeaderCell>Telefone</HeaderCell>
          <Cell dataKey="telefone" />
        </Column>
        <Column flexGrow={1} width={100} align="center" fixed="right">
          <HeaderCell>Ações</HeaderCell>
          <Cell>
            {(rowData: ICliente) => (
              <div style={{ display: "flex", gap: 5 }}>
                <Button
                  appearance="primary"
                  size="xs"
                  onClick={() => {
                    setEditingCliente(toFormData(rowData));
                    setOpenModalEdit(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  appearance="default"
                  size="xs"
                  onClick={() => handleDelete(rowData._id.toString())}
                >
                  Excluir
                </Button>
              </div>
            )}
          </Cell>
        </Column>
      </Table>

      <Modal open={openModalCreate} onClose={() => setOpenModalCreate(false)}>
        <Modal.Header>
          <Modal.Title>Novo Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>Nome</Form.ControlLabel>
              <Form.Control
                name="nome"
                value={newCliente.nome || ""}
                onChange={(value) => setNewCliente({...newCliente, nome: value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Idade</Form.ControlLabel>
              <Form.Control
                name="idade"
                type="number"
                value={newCliente.idade || ""}
                onChange={(value) => setNewCliente({...newCliente, idade: Number(value)})}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Sexo</Form.ControlLabel>
              <Form.Control
                name="sexo"
                value={newCliente.sexo || ""}
                onChange={(value) => setNewCliente({...newCliente, sexo: value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control
                name="email"
                type="email"
                value={newCliente.email || ""}
                onChange={(value) => setNewCliente({...newCliente, email: value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Telefone</Form.ControlLabel>
              <Form.Control
                name="telefone"
                value={newCliente.telefone || ""}
                onChange={(value) => setNewCliente({...newCliente, telefone: value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreate} appearance="primary">
            Salvar
          </Button>
          <Button onClick={() => setOpenModalCreate(false)} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal open={openModalEdit} onClose={() => setOpenModalEdit(false)}>
        <Modal.Header>
          <Modal.Title>Editar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>Nome</Form.ControlLabel>
              <Form.Control
                name="nome"
                value={editingCliente?.nome || ""}
                onChange={(value) => setEditingCliente(editingCliente ? {...editingCliente, nome: value} : null)}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Idade</Form.ControlLabel>
              <Form.Control
                name="idade"
                type="number"
                value={editingCliente?.idade || ""}
                onChange={(value) => setEditingCliente(editingCliente ? {...editingCliente, idade: Number(value)} : null)}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Sexo</Form.ControlLabel>
              <Form.Control
                name="sexo"
                value={editingCliente?.sexo || ""}
                onChange={(value) => setEditingCliente(editingCliente ? {...editingCliente, sexo: value} : null)}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control
                name="email"
                type="email"
                value={editingCliente?.email || ""}
                onChange={(value) => setEditingCliente(editingCliente ? {...editingCliente, email: value} : null)}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Telefone</Form.ControlLabel>
              <Form.Control
                name="telefone"
                value={editingCliente?.telefone || ""}
                onChange={(value) => setEditingCliente(editingCliente ? {...editingCliente, telefone: value} : null)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpdate} appearance="primary">
            Salvar
          </Button>
          <Button onClick={() => setOpenModalEdit(false)} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </S.Container>
  );
}