import React, { useState, useEffect } from 'react';
import { Table, Button, Modal as BootstrapModal, Form } from 'react-bootstrap';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Apontamento.css';

// Registrar componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Apontamento = () => {
  const [acompanhamentos, setAcompanhamentos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [importModalIsOpen, setImportModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    cliente: '',
    data: '',
    codigo_produto: '',
    descricao_produto: '',
    os: '',
    quantidade: '',
    processo: '',
    origem_nc: '',
    descricao_nc: '',
    tipo_nc: '',
    responsavel_encontrou: '',
    acao_corretiva: '',
    disposicao_peca: '',
    prazo: '',
    responsavel_acao: '',
    status: '',
  });
  const [dashboardData, setDashboardData] = useState({
    total_acompanhamentos: 0,
    total_abertos: 0,
    total_fechados: 0,
  });

  // Dados fictícios para dropdowns e gráficos (substitua por API real)
  const [clientes] = useState([{ nome: 'Cliente A' }, { nome: 'Cliente B' }]);
  const [maquinas] = useState([{ id: 1, nome: 'Máquina 1' }, { id: 2, nome: 'Máquina 2' }]);
  const [funcionarios] = useState([{ id: 1, nome: 'João' }, { id: 2, nome: 'Maria' }]);
  const [statusChoices] = useState(['Aberto', 'Em Andamento', 'Fechado']);
  const [processos] = useState(['Processo 1', 'Processo 2']);
  const [acoesCorretivas] = useState(['Ação 1', 'Ação 2']);
  const [disposicaoPeca] = useState(['Disp 1', 'Disp 2']);
  const [tipoNc] = useState(['Tipo 1', 'Tipo 2']);

  const API_BASE_URL = 'http://localhost:8000'; // Ajuste para sua API FastAPI

  // Carregar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/acompanhamentos/`);
        const data = response.data;
        setAcompanhamentos(data);
        setDashboardData({
          total_acompanhamentos: data.length,
          total_abertos: data.filter(a => a.status === 'Aberto').length,
          total_fechados: data.filter(a => a.status === 'Fechado').length,
        });
      } catch (error) {
        console.error('Erro ao carregar acompanhamentos:', error);
      }
    };
    fetchData();
  }, []);

  // Dados fictícios para os gráficos (substitua por dados reais da API)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
  };
  const tipoNcChartData = {
    labels: ['Tipo 1', 'Tipo 2'],
    datasets: [{ label: 'Não Conformidades', data: [5, 3], backgroundColor: '#007bff' }],
  };
  const clienteChartData = {
    labels: ['Cliente A', 'Cliente B'],
    datasets: [{ label: 'Clientes', data: [10, 7], backgroundColor: '#28a745' }],
  };
  const disposicaoPecaChartData = {
    labels: ['Disp 1', 'Disp 2'],
    datasets: [{ label: 'Disposição', data: [4, 6], backgroundColor: '#ffc107' }],
  };
  const origemNcChartData = {
    labels: ['Máquina 1', 'Máquina 2'],
    datasets: [{ label: 'NCs por Máquina', data: [2, 8], backgroundColor: '#dc3545' }],
  };

  // Manipulação do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/acompanhamentos/`, formData);
      alert('Acompanhamento cadastrado com sucesso!');
      setModalIsOpen(false);
      setFormData({ cliente: '', data: '', codigo_produto: '', descricao_produto: '', os: '', quantidade: '', processo: '', origem_nc: '', descricao_nc: '', tipo_nc: '', responsavel_encontrou: '', acao_corretiva: '', disposicao_peca: '', prazo: '', responsavel_acao: '', status: '' });
      // Recarregar dados após cadastro
      const response = await axios.get(`${API_BASE_URL}/acompanhamentos/`);
      setAcompanhamentos(response.data);
    } catch (error) {
      alert('Erro ao cadastrar acompanhamento: ' + (error.response?.data?.detail || 'Erro desconhecido'));
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    const file = e.target.elements.file.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post(`${API_BASE_URL}/import_excel/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Arquivo importado com sucesso!');
      setImportModalIsOpen(false);
      const response = await axios.get(`${API_BASE_URL}/acompanhamentos/`);
      setAcompanhamentos(response.data);
    } catch (error) {
      alert('Erro ao importar arquivo: ' + (error.response?.data?.detail || 'Erro desconhecido'));
    }
  };

  const handleExport = () => {
    window.open(`${API_BASE_URL}/export_excel/`, '_blank');
  };

  const handleRefresh = async () => {
    const response = await axios.get(`${API_BASE_URL}/acompanhamentos/`);
    setAcompanhamentos(response.data);
  };

  const today = new Date();

  return (
    <div>
      {/* Header */}
      <header>
        <div className="horizontal">
          <Button variant="primary" onClick={() => setModalIsOpen(true)}>
            <i className="bi bi-plus-circle"></i> Add Ordem S.
          </Button>
          <Button variant="secondary" onClick={handleExport}>
            <i className="bi bi-file-earmark-arrow-down"></i> Exportar
          </Button>
          <Button variant="secondary" onClick={() => setImportModalIsOpen(true)}>
            <i className="bi bi-file-earmark-arrow-up"></i> Importar
          </Button>
          <Button variant="success" onClick={handleRefresh}>
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </Button>
        </div>
      </header>

      {/* Layout */}
      <div className="horizontal">
        <div className="vertical width50">
          <div className="summary">
            <h5>Tipo de Não Conformidade</h5>
            <Bar data={tipoNcChartData} options={chartOptions} />
          </div>
          <div className="summary">
            <h5>Clientes</h5>
            <Bar data={clienteChartData} options={chartOptions} />
          </div>
          <div className="summary">
            <h5>Disposição das Peças</h5>
            <Bar data={disposicaoPecaChartData} options={chartOptions} />
          </div>
          <div className="summary">
            <h5>N° de NC por Máquina</h5>
            <Bar data={origemNcChartData} options={chartOptions} />
          </div>
        </div>
        <div className="vertical">
          <div className="summ">
            <div>
              <h2>RNC: Total</h2>
              <span className="large-span">{dashboardData.total_acompanhamentos}</span>
            </div>
            <div>
              <h2>RNC: Em andamento</h2>
              <span className="large-span" style={{ color: 'orange' }}>{dashboardData.total_abertos}</span>
            </div>
            <div>
              <h2>RNC: Finalizadas</h2>
              <span className="large-span" style={{ color: 'green' }}>{dashboardData.total_fechados}</span>
            </div>
          </div>
          <div className="table-section">
            <Table>
              <thead>
                <tr>
                  <th>RNC</th>
                  <th>Ocorrência</th>
                  <th>Responsável</th>
                  <th>Etapa</th>
                  <th>Atividade</th>
                  <th>Prazo</th>
                  <th>Situação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {acompanhamentos.length > 0 ? (
                  acompanhamentos.map(nc => (
                    <tr key={nc.id}>
                      <td>{nc.numero_nc}</td>
                      <td>{nc.descricao_nc}</td>
                      <td>{nc.responsavel_acao}</td>
                      <td>{nc.status}</td>
                      <td>Acompanhar {nc.status}</td>
                      <td>{new Date(nc.prazo).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</td>
                      <td>
                        <span className={`status ${new Date(nc.prazo) >= today ? 'on-time' : 'overdue'}`}>
                          {new Date(nc.prazo) >= today ? 'Em dia' : 'Atrasado'}
                        </span>
                      </td>
                      <td>
                        <Button variant="primary" href={`/detalhes_rnc/${nc.id}`}>Ver detalhes</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">Nenhuma não conformidade cadastrada.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal de Cadastro */}
      <BootstrapModal show={modalIsOpen} onHide={() => setModalIsOpen(false)} dialogClassName="modal-lg">
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>Cadastro de Posto de Trabalho</BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          <Form id="cadastroAcompanhamentoForm" onSubmit={handleSubmit}>
            <div className="form-row">
              <Form.Group className="col-md-4">
                <Form.Label>Cliente</Form.Label>
                <Form.Control as="select" name="cliente" value={formData.cliente} onChange={handleChange}>
                  <option value="" disabled>Selecione o Cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.nome} value={cliente.nome}>{cliente.nome}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Data</Form.Label>
                <Form.Control type="date" name="data" value={formData.data} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Código do Produto</Form.Label>
                <Form.Control type="text" name="codigo_produto" value={formData.codigo_produto} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Descrição do Produto</Form.Label>
                <Form.Control type="text" name="descricao_produto" value={formData.descricao_produto} onChange={handleChange} placeholder="Digite ou selecione..." />
              </Form.Group>
              <Form.Group className="col-md-2">
                <Form.Label>O.S.</Form.Label>
                <Form.Control type="text" name="os" value={formData.os} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Quantidade</Form.Label>
                <Form.Control type="number" name="quantidade" value={formData.quantidade} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Processo</Form.Label>
                <Form.Control type="text" name="processo" value={formData.processo} onChange={handleChange} placeholder="Digite ou selecione..." />
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Origem da NC</Form.Label>
                <Form.Control as="select" name="origem_nc" value={formData.origem_nc} onChange={handleChange}>
                  <option value="" disabled>Selecione a máquina</option>
                  {maquinas.map(maquina => (
                    <option key={maquina.id} value={maquina.id}>{maquina.nome}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="col-md-6">
                <Form.Label>Descrição da NC</Form.Label>
                <Form.Control as="textarea" name="descricao_nc" value={formData.descricao_nc} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Tipo de NC</Form.Label>
                <Form.Control type="text" name="tipo_nc" value={formData.tipo_nc} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Responsável que encontrou</Form.Label>
                <Form.Control as="select" name="responsavel_encontrou" value={formData.responsavel_encontrou} onChange={handleChange}>
                  <option value="" disabled>Selecione o funcionário</option>
                  {funcionarios.map(funcionario => (
                    <option key={funcionario.id} value={funcionario.id}>{funcionario.nome}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Ação Corretiva</Form.Label>
                <Form.Control type="text" name="acao_corretiva" value={formData.acao_corretiva} onChange={handleChange} placeholder="Digite ou selecione..." />
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Disposição da Peça</Form.Label>
                <Form.Control type="text" name="disposicao_peca" value={formData.disposicao_peca} onChange={handleChange} placeholder="Digite ou selecione..." />
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Prazo</Form.Label>
                <Form.Control type="date" name="prazo" value={formData.prazo} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Responsável pela Ação</Form.Label>
                <Form.Control as="select" name="responsavel_acao" value={formData.responsavel_acao} onChange={handleChange}>
                  <option value="" disabled>Selecione o funcionário</option>
                  {funcionarios.map(funcionario => (
                    <option key={funcionario.id} value={funcionario.id}>{funcionario.nome}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Etapa do Acompanhamento</Form.Label>
                <Form.Control as="select" name="status" value={formData.status} onChange={handleChange} required>
                  <option value="">Selecione uma etapa</option>
                  {statusChoices.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </div>
            <Button type="submit" variant="primary">Cadastrar</Button>
          </Form>
        </BootstrapModal.Body>
      </BootstrapModal>

      {/* Modal de Importação */}
      <BootstrapModal show={importModalIsOpen} onHide={() => setImportModalIsOpen(false)}>
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>Importar Planilha</BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          <Form onSubmit={handleImport}>
            <Form.Group>
              <Form.Control type="file" name="file" accept=".xlsx, .xls" />
            </Form.Group>
            <Button type="submit" variant="primary">Importar</Button>
            <Button variant="secondary" onClick={() => setImportModalIsOpen(false)} className="ml-2">Fechar</Button>
          </Form>
        </BootstrapModal.Body>
      </BootstrapModal>
    </div>
  );
};

export default Apontamento;