import React, { useState, useEffect } from 'react';
import { Table, Button, Modal as BootstrapModal, Form } from 'react-bootstrap';
import axios from 'axios';
import './Comercial.css'; // Arquivo de estilos personalizado

const Comercial = () => {
  // Estados
  const [orcamentos, setOrcamentos] = useState([]);
  const [clientesOrcamento, setClientesOrcamento] = useState([]);
  const [filters, setFilters] = useState({
    statusCliente: '',
    statusProducao: '',
    cliente: '',
    orderDate: 'recent',
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOrcamento, setSelectedOrcamento] = useState(null);
  const [statusCliente, setStatusCliente] = useState('');
  const [dashboardData, setDashboardData] = useState({
    total_orcamentos: 0,
    qtd_aprovado: 0,
    qtd_aberto: 0,
    qtd_rejeitado: 0,
  });

  // Base URL da API FastAPI (ajuste conforme sua configuração)
  const API_BASE_URL = 'http://localhost:8000'; // Substitua pelo endereço real da sua API FastAPI

  // Carregar dados iniciais da API FastAPI
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carregar orçamentos
        const orcamentosResponse = await axios.get(`${API_BASE_URL}/orcamentos/`);
        const orcamentosData = orcamentosResponse.data;
        setOrcamentos(orcamentosData);

        // Carregar clientes únicos para o filtro
        const clientesResponse = await axios.get(`${API_BASE_URL}/clientes_orcamento/`);
        setClientesOrcamento(clientesResponse.data);

        // Atualizar dashboard
        setDashboardData({
          total_orcamentos: orcamentosData.length,
          qtd_aprovado: orcamentosData.filter(o => o.status_cliente === 'aprovado').length,
          qtd_aberto: orcamentosData.filter(o => o.status_cliente === 'aguardando').length,
          qtd_rejeitado: orcamentosData.filter(o => o.status_cliente === 'rejeitado').length,
        });
      } catch (error) {
        console.error('Erro ao carregar dados da API:', error);
      }
    };
    fetchData();
  }, []);

  // Função de filtro
  const filterTable = () => {
    return orcamentos.filter(orcamento => {
      const statusClienteMatch = !filters.statusCliente || orcamento.status_cliente.toLowerCase().includes(filters.statusCliente.toLowerCase());
      const statusProducaoMatch = !filters.statusProducao || orcamento.status_orcamento.toLowerCase().includes(filters.statusProducao.toLowerCase());
      const clienteMatch = !filters.cliente || orcamento.cliente.nome.toLowerCase().includes(filters.cliente.toLowerCase());
      return statusClienteMatch && statusProducaoMatch && clienteMatch;
    });
  };

  // Função de ordenação
  const sortTable = (data) => {
    return data.sort((a, b) => {
      const dateA = new Date(a.data_orcamento);
      const dateB = new Date(b.data_orcamento);
      return filters.orderDate === 'recent' ? dateB - dateA : dateA - dateB;
    });
  };

  // Manipulação de filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Abrir modal
  const openModal = (orcamento) => {
    setSelectedOrcamento(orcamento);
    setStatusCliente(orcamento.status_cliente);
    setModalIsOpen(true);
  };

  // Fechar modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedOrcamento(null);
  };

  // Salvar status do cliente via FastAPI
  const handleSaveStatus = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_BASE_URL}/orcamentos/${selectedOrcamento.id}/status/`, {
        status_cliente: statusCliente,
      });
      alert(response.data.message || 'Status do cliente atualizado com sucesso!');
      setOrcamentos(prev =>
        prev.map(o => (o.id === selectedOrcamento.id ? { ...o, status_cliente: statusCliente } : o))
      );
      closeModal();
    } catch (error) {
      alert('Erro ao salvar status: ' + (error.response?.data?.detail || 'Erro desconhecido'));
    }
  };

  // Função para visualizar PDF (assumindo que FastAPI gera o PDF)
  const handleViewPDF = (id) => {
    window.open(`${API_BASE_URL}/gerar_pdf_orcamento/${id}`, '_blank');
  };

  // Dados filtrados e ordenados
  const filteredAndSortedOrcamentos = sortTable(filterTable());

  return (
    <div className="box_main">
      {/* Dashboard Cards */}
      <div className="dashboard">
        <div className="cards horizontal">
          <img src="/static/icons/lista-de-desejos.png" alt="Total" style={{ width: '35px', height: '35px', padding: '5px', backgroundColor: '#E6F3FF', borderRadius: '2px' }} />
          <div className="alinharL">
            <p>Total</p>
            <h4>{dashboardData.total_orcamentos}</h4>
          </div>
        </div>
        <div className="cards horizontal">
          <img src="/static/icons/conformidade.png" alt="Finalizado" style={{ width: '35px', height: '35px', padding: '5px', backgroundColor: '#E6FEFE', borderRadius: '2px' }} />
          <div className="alinharL">
            <p>Finalizado</p>
            <h4>{dashboardData.qtd_aprovado}</h4>
          </div>
        </div>
        <div className="cards horizontal">
          <img src="/static/icons/lista-de-espera.png" alt="Abertos" style={{ width: '35px', height: '35px', padding: '5px', backgroundColor: '#FEF6BD', borderRadius: '2px' }} />
          <div className="alinharL">
            <p>Abertos</p>
            <h4>{dashboardData.qtd_aberto}</h4>
          </div>
        </div>
        <div className="cards horizontal">
          <img src="/static/icons/negado.png" alt="Rejeitados" style={{ width: '35px', height: '35px', padding: '5px', backgroundColor: '#FFFFFF', borderRadius: '2px' }} />
          <div className="alinharL">
            <p>Rejeitados</p>
            <h4>{dashboardData.qtd_rejeitado}</h4>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters mb-4">
        <div className="row">
          <div className="col-md-3">
            <Form.Group controlId="statusCliente">
              <Form.Label>S. Cliente</Form.Label>
              <Form.Control as="select" name="statusCliente" value={filters.statusCliente} onChange={handleFilterChange}>
                <option value="">Todos</option>
                <option value="aguardando">Aguardando</option>
                <option value="aprovado">Aprovado</option>
                <option value="pendente">Pendente</option>
                <option value="finalizado">Finalizado</option>
              </Form.Control>
            </Form.Group>
          </div>
          <div className="col-md-3">
            <Form.Group controlId="statusProducao">
              <Form.Label>S. Produção</Form.Label>
              <Form.Control as="select" name="statusProducao" value={filters.statusProducao} onChange={handleFilterChange}>
                <option value="">Todos</option>
                <option value="aguardando">Aguardando</option>
                <option value="aprovado">Aprovado</option>
                <option value="produzindo">Produzindo</option>
                <option value="concluido">Concluído</option>
              </Form.Control>
            </Form.Group>
          </div>
          <div className="col-md-3">
            <Form.Group controlId="cliente">
              <Form.Label>Cliente</Form.Label>
              <Form.Control as="select" name="cliente" value={filters.cliente} onChange={handleFilterChange}>
                <option value="">Todos</option>
                {clientesOrcamento.map((cliente, index) => (
                  <option key={index} value={cliente.nome}>{cliente.nome}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
          <div className="col-md-3">
            <Form.Group controlId="orderDate">
              <Form.Label>Ordenar por Data</Form.Label>
              <Form.Control as="select" name="orderDate" value={filters.orderDate} onChange={handleFilterChange}>
                <option value="recent">Mais recente</option>
                <option value="oldest">Mais antiga</option>
              </Form.Control>
            </Form.Group>
          </div>
        </div>
      </div>

      {/* Tabela de Orçamentos */}
      <Table striped bordered hover id="orcamentosTable">
        <thead className="thead-dark">
          <tr>
            <th>Ordem de Serviço</th>
            <th>Cliente</th>
            <th>Funcionário</th>
            <th>Data do Orçamento</th>
            <th>Valor Total</th>
            <th>Status Comercial</th>
            <th>Status Produção</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedOrcamentos.length > 0 ? (
            filteredAndSortedOrcamentos.map(orcamento => (
              <tr key={orcamento.id}>
                <td>{orcamento.cod_orcamento}</td>
                <td className="cliente">{orcamento.cliente.nome}</td>
                <td>{orcamento.funcionario.nome}</td>
                <td className="data_orcamento">{orcamento.data_orcamento}</td>
                <td>R$ {orcamento.valor_total_com_desconto}</td>
                <td className={`status_cliente status-${orcamento.status_cliente}`}>{orcamento.status_cliente}</td>
                <td className={`status_producao status-${orcamento.status_orcamento}`}>{orcamento.status_orcamento}</td>
                <td>
                  <Button variant="info" size="sm" onClick={() => handleViewPDF(orcamento.id)}>Visualizar</Button>
                  <Button variant="info" size="sm" onClick={() => openModal(orcamento)} className="ml-2">Status</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">Nenhum orçamento encontrado.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal */}
      <BootstrapModal show={modalIsOpen} onHide={closeModal}>
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>Resumo do Orçamento</BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          <div id="resumoOrcamento">
            {selectedOrcamento && (
              <p>Orçamento ID: {selectedOrcamento.id}</p>
            )}
          </div>
          <Form id="StatusClienteForm" onSubmit={handleSaveStatus}>
            <Form.Group controlId="statusClienteModal">
              <Form.Label>Status do Cliente</Form.Label>
              <Form.Control
                as="select"
                value={statusCliente}
                onChange={(e) => setStatusCliente(e.target.value)}
                name="status_cliente"
              >
                <option value="aguardando">Aguardando</option>
                <option value="aprovado">Aprovado</option>
                <option value="rejeitado">Rejeitado</option>
                <option value="finalizado">Finalizado</option>
              </Form.Control>
            </Form.Group>
            <input type="hidden" name="orcamento_id" value={selectedOrcamento?.id || ''} />
          </Form>
        </BootstrapModal.Body>
        <BootstrapModal.Footer>
          <Button variant="secondary" onClick={closeModal}>Fechar</Button>
          <Button variant="primary" type="submit" form="StatusClienteForm">Salvar Status</Button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </div>
  );
};

export default Comercial;