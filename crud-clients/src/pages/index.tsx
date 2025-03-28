import { useState } from 'react';

export default function Home() {
  const [cliente, setCliente] = useState({
    nome: '',
    idade: '',
    email: '',
    telefone: '',
    cep: '',
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente),
    });
    if (response.ok) {
      alert('Cliente criado com sucesso!');
    } else {
      alert('Erro ao criar cliente.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome"
        value={cliente.nome}
        onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
      />
      <input
        type="number"
        placeholder="Idade"
        value={cliente.idade}
        onChange={(e) => setCliente({ ...cliente, idade: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={cliente.email}
        onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
      />
      <input
        type="text"
        placeholder="Telefone"
        value={cliente.telefone}
        onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })}
      />
      <input
        type="text"
        placeholder="CEP"
        value={cliente.cep}
        onChange={(e) => setCliente({ ...cliente, cep: e.target.value })}
      />
      <button type="submit">Criar Cliente</button>
    </form>
  );
}