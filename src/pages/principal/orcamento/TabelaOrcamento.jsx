import React, { useState, useEffect } from 'react';
import { Accordion, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [totalAcompanhamentos, setTotalAcompanhamentos] = useState(0);
  const [totalAbertos, setTotalAbertos] = useState(0);
  const [totalFechados, setTotalFechados] = useState(0);
  const [orcamentos, setOrcamentos] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [subprojetos, setSubprojetos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [cnpjs, setCnpjs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    idCliente: '',
    idFuncionario: '',
    idCNPJ: '',
    descricao: '',
    prazo_resposta: '',
    prazo_entrega: '',
  });

  const API_BASE_URL = 'http://localhost:8000'; // Ajuste para sua API

  // Carregar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [acompanhamentosRes, orcamentosRes, projetosRes, subprojetosRes, clientesRes, funcionariosRes, cnpjsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/acompanhamentos/`),
          axios.get(`${API_BASE_URL}/orcamentos/`),
          axios.get(`${API_BASE_URL}/projetos/`),
          axios.get(`${API_BASE_URL}/subprojetos/`),
          axios.get(`${API_BASE_URL}/clientes/`),
          axios.get(`${API_BASE_URL}/funcionarios/`),
          axios.get(`${API_BASE_URL}/cnpjs/`),
        ]);

        setTotalAcompanhamentos(acompanhamentosRes.data.length);
        setTotalAbertos(acompanhamentosRes.data.filter(a => a.status === 'Aberto').length);
        setTotalFechados(acompanhamentosRes.data.filter(a => a.status === 'Fechado').length);
        setOrcamentos(orcamentosRes.data);
        setProjetos(projetosRes.data);
        setSubprojetos(subprojetosRes.data);
        setClientes(clientesRes.data);
        setFuncionarios(funcionariosRes.data);
        setCnpjs(cnpjsRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, []);

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => {
    setShowModal(false);
    setFormData({ id: 0, idCliente: '', idFuncionario: '', idCNPJ: '', descricao: '', prazo_resposta: '', prazo_entrega: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/orcamentos/`, formData);
      setOrcamentos([...orcamentos, response.data]);
      handleModalClose();
      alert('Orçamento cadastrado com sucesso!');
    } catch (error) {
      alert('Erro ao cadastrar orçamento: ' + (error.response?.data?.detail || 'Erro desconhecido'));
    }
  };

  const handleDeleteOrcamento = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      try {
        await axios.delete(`${API_BASE_URL}/orcamentos/${id}/`);
        setOrcamentos(orcamentos.filter(o => o.id !== id));
        alert('Orçamento excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir orçamento: ' + (error.response?.data?.detail || 'Erro desconhecido'));
      }
    }
  };

  const handleDeleteProjeto = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await axios.delete(`${API_BASE_URL}/projetos/${id}/`);
        setProjetos(projetos.filter(p => p.id !== id));
        alert('Projeto excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir projeto: ' + (error.response?.data?.detail || 'Erro desconhecido'));
      }
    }
  };

  const handleDeleteSubprojeto = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este subprojeto?')) {
      try {
        await axios.delete(`${API_BASE_URL}/subprojetos/${id}/`);
        setSubprojetos(subprojetos.filter(s => s.id !== id));
        alert('Subprojeto excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir subprojeto: ' + (error.response?.data?.detail || 'Erro desconhecido'));
      }
    }
  };

  return (
    <div>
      <div className="summ">
        <div>
          <h5>Total</h5>
          <span className="large-span">{totalAcompanhamentos}</span>
        </div>
        <div>
          <h5>Em andamento</h5>
          <span className="large-span" style={{ color: 'orange' }}>{totalAbertos}</span>
        </div>
        <div>
          <h5>Finalizadas</h5>
          <span className="large-span" style={{ color: 'green' }}>{totalFechados}</span>
        </div>
      </div>

      <div className="horizontal margin-top">
        <h5>Orçamento</h5>
        <Button variant="primary" onClick={handleModalOpen}>
          Cadastrar Orçamento
        </Button>
      </div>

      <div className="container">
        <Accordion id="accordion">
          {orcamentos.map(orcamento => (
            <Accordion.Item eventKey={orcamento.id.toString()} key={orcamento.id}>
              <Accordion.Header>
                {orcamento.cod_orcamento}
                <div className="btn-group ms-2">
                  <a href={`/detalhe-orcamento/${orcamento.id}`} className="me-2">Editar</a>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteOrcamento(orcamento.id)}
                  >
                    Deletar
                  </Button>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <Accordion id={`projetos${orcamento.id}`}>
                  {projetos
                    .filter(projeto => projeto.orcamento.id === orcamento.id)
                    .map(projeto => (
                      <Accordion.Item eventKey={projeto.id.toString()} key={projeto.id}>
                        <Accordion.Header>
                          Projeto #{projeto.id} - {projeto.Nome}
                          <div className="btn-group ms-2">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteProjeto(projeto.id)}
                            >
                              Deletar
                            </Button>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <ul className="list-unstyled">
                            {subprojetos
                              .filter(sub => sub.projeto_principal.id === projeto.id)
                              .map(subprojeto => (
                                <li key={subprojeto.id} className="d-flex justify-content-between align-items-center">
                                  <a href="#">Subprojeto #{subprojeto.id} - {subprojeto.nome_peca}</a>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteSubprojeto(subprojeto.id)}
                                  >
                                    Deletar
                                  </Button>
                                </li>
                              ))}
                          </ul>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>

      {/* Modal de Cadastro de Orçamento */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Criar Orçamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="cadastroOrcamentoForm" onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Select name="idCliente" value={formData.idCliente} onChange={handleChange} required>
                <option value="">Selecione</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Funcionário</Form.Label>
              <Form.Select name="idFuncionario" value={formData.idFuncionario} onChange={handleChange} required>
                <option value="">Selecione</option>
                {funcionarios.map(funcionario => (
                  <option key={funcionario.id} value={funcionario.id}>{funcionario.nome}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>CNPJ</Form.Label>
              <Form.Select name="idCNPJ" value={formData.idCNPJ} onChange={handleChange} required>
                <option value="">Selecione</option>
                {cnpjs.map(cnpj => (
                  <option key={cnpj.id} value={cnpj.id}>{cnpj.nome}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descrição do orçamento"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prazo de Resposta</Form.Label>
              <Form.Control
                type="date"
                name="prazo_resposta"
                value={formData.prazo_resposta}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prazo de Entrega</Form.Label>
              <Form.Control
                type="number"
                name="prazo_entrega"
                value={formData.prazo_entrega}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">Salvar</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;