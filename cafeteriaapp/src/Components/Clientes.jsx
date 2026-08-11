import { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import * as yup from "yup";

const API_URL = "http://localhost:3001/clientes";

const clienteSchema = yup.object({
  nome: yup.string().trim().required("Nome é obrigatório").min(2, "Nome precisa ter pelo menos 2 caracteres"),
  email: yup.string().trim().required("Email é obrigatório").email("Email inválido"),
  nascimento: yup.string().required("Data de nascimento é obrigatória"),
  cep: yup.string().trim().required("CEP é obrigatório").matches(/^\d{5}-?\d{3}$/, "CEP inválido"),
});

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    email: "",
    nascimento: "",
    cep: "",
  });
  const [errosEdicao, setErrosEdicao] = useState({});
  const [errosCadastro, setErrosCadastro] = useState({});

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const resposta = await fetch(API_URL);

      if (!resposta.ok) {
        throw new Error("Não foi possível carregar os clientes.");
      }

      const dados = await resposta.json();
      setClientes(dados);
      setError("");
    } catch (erro) {
      setError(erro.message);
    } finally {
      setLoading(false);
    }
  };

  // executa a função de carregar clientes ao renderizar o componente Clientes.jsx
  useEffect(() => {
    carregarClientes();
  }, []);

  const formatarData = (valor) => {
    if (!valor) return "";

    const [ano, mes, dia] = valor.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const abrirModalEdicao = (cliente) => {
    setClienteSelecionado({ ...cliente });
    setErrosEdicao({});
    setShowModal(true);
  };

  const fecharModalEdicao = () => {
    setShowModal(false);
    setClienteSelecionado(null);
    setErrosEdicao({});
  };

  const abrirModalAdicionar = () => {
    setNovoCliente({ nome: "", email: "", nascimento: "", cep: "" });
    setErrosCadastro({});
    setShowAddModal(true);
  };

  const fecharModalAdicionar = () => {
    setShowAddModal(false);
    setNovoCliente({ nome: "", email: "", nascimento: "", cep: "" });
    setErrosCadastro({});
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setClienteSelecionado((prev) => ({ ...prev, [name]: value }));

    setErrosEdicao((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleAddChange = (event) => {
    const { name, value } = event.target;
    setNovoCliente((prev) => ({ ...prev, [name]: value }));

    setErrosCadastro((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validarCliente = async (dados, setErros) => {
    try {
      await clienteSchema.validate(dados, { abortEarly: false });
      setErros({});
      return true;
    } catch (erro) {
      const mensagens = {};

      if (erro.inner) {
        erro.inner.forEach(({ path, message }) => {
          if (path) {
            mensagens[path] = message;
          }
        });
      }

      setErros(mensagens);
      return false;
    }
  };

  const salvarEdicao = async (event) => {
    event.preventDefault();

    if (!clienteSelecionado) return;

    const valido = await validarCliente(clienteSelecionado, setErrosEdicao);

    if (!valido) return;

    try {
      const resposta = await fetch(`${API_URL}/${clienteSelecionado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteSelecionado),
      });

      if (!resposta.ok) {
        throw new Error("Não foi possível atualizar o cliente.");
      }

      const clienteAtualizado = await resposta.json();
      setClientes((prevClientes) =>
        prevClientes.map((cliente) =>
          cliente.id === clienteAtualizado.id ? clienteAtualizado : cliente
        )
      );
      fecharModalEdicao();
      setError("");
    } catch (erro) {
      setError(erro.message);
    }
  };

  const salvarNovoCliente = async (event) => {
    event.preventDefault();

    const valido = await validarCliente(novoCliente, setErrosCadastro);

    if (!valido) return;

    try {
      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoCliente),
      });

      if (!resposta.ok) {
        throw new Error("Não foi possível cadastrar o cliente.");
      }

      const clienteCriado = await resposta.json();
      setClientes((prevClientes) => [...prevClientes, clienteCriado]);
      fecharModalAdicionar();
      setError("");
    } catch (erro) {
      setError(erro.message);
    }
  };

  const excluirCliente = async (clienteId) => {
    try {
      const resposta = await fetch(`${API_URL}/${clienteId}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        throw new Error("Não foi possível remover o cliente.");
      }

      setClientes((prevClientes) => prevClientes.filter((cliente) => cliente.id !== clienteId));
      setError("");
    } catch (erro) {
      setError(erro.message);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Clientes</h2>

      <div className="d-flex justify-content-end mb-4">
        <Button variant="primary" onClick={abrirModalAdicionar}>
          Adicionar cliente
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Nascimento</th>
            <th>Cep</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>{formatarData(cliente.nascimento)}</td>
              <td>{cliente.cep}</td>
              <td>
                <Button variant="primary" size="sm" onClick={() => abrirModalEdicao(cliente)}>
                  Editar
                </Button>{" "}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => excluirCliente(cliente.id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={fecharModalEdicao} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar cliente</Modal.Title>
        </Modal.Header>

        <Form onSubmit={salvarEdicao}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={clienteSelecionado?.nome || ""}
                onChange={handleEditChange}
                isInvalid={Boolean(errosEdicao.nome)}
              />
              <Form.Control.Feedback type="invalid">{errosEdicao.nome}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={clienteSelecionado?.email || ""}
                onChange={handleEditChange}
                isInvalid={Boolean(errosEdicao.email)}
              />
              <Form.Control.Feedback type="invalid">{errosEdicao.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Data de nascimento</Form.Label>
              <Form.Control
                type="date"
                name="nascimento"
                value={clienteSelecionado?.nascimento || ""}
                onChange={handleEditChange}
                isInvalid={Boolean(errosEdicao.nascimento)}
              />
              <Form.Control.Feedback type="invalid">{errosEdicao.nascimento}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>CEP</Form.Label>
              <Form.Control
                type="text"
                name="cep"
                value={clienteSelecionado?.cep || ""}
                onChange={handleEditChange}
                isInvalid={Boolean(errosEdicao.cep)}
              />
              <Form.Control.Feedback type="invalid">{errosEdicao.cep}</Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={fecharModalEdicao}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              Salvar
            </Button>
          </Modal.Footer>
        </Form>

      </Modal>

      <Modal show={showAddModal} onHide={fecharModalAdicionar} centered>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar cliente</Modal.Title>
        </Modal.Header>

        <Form onSubmit={salvarNovoCliente}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={novoCliente.nome}
                onChange={handleAddChange}
                isInvalid={Boolean(errosCadastro.nome)}
              />
              <Form.Control.Feedback type="invalid">{errosCadastro.nome}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={novoCliente.email}
                onChange={handleAddChange}
                isInvalid={Boolean(errosCadastro.email)}
              />
              <Form.Control.Feedback type="invalid">{errosCadastro.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Data de nascimento</Form.Label>
              <Form.Control
                type="date"
                name="nascimento"
                value={novoCliente.nascimento}
                onChange={handleAddChange}
                isInvalid={Boolean(errosCadastro.nascimento)}
              />
              <Form.Control.Feedback type="invalid">{errosCadastro.nascimento}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>CEP</Form.Label>
              <Form.Control
                type="text"
                name="cep"
                value={novoCliente.cep}
                onChange={handleAddChange}
                isInvalid={Boolean(errosCadastro.cep)}
              />
              <Form.Control.Feedback type="invalid">{errosCadastro.cep}</Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={fecharModalAdicionar}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              Salvar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Clientes;
