import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import './nc.css';

const NaoConformidade = () => {
  const [acompanhamentoNc, setAcompanhamentoNc] = useState({});
  const [activeTab, setActiveTab] = useState('detalhes');
  const [acaoForm, setAcaoForm] = useState({
    descricao_acao: '',
    responsavel_acao_2: '',
    prazo_acao: '',
    status_acao: 'Pendente',
  });
  const [causaForm, setCausaForm] = useState({ analise_causa: '' });
  const [cincoPorques, setCincoPorques] = useState({
    primeiro_porque: '',
    segundo_porque: '',
    terceiro_porque: '',
    quarto_porque: '',
    quinto_porque: '',
  });
  const [acaoCorretivaForm, setAcaoCorretivaForm] = useState({
    o_que_fazer: '',
    por_que_fazer: '',
    como_fazer: '',
    onde_fazer: '',
    quem_vai_fazer: '',
    prazo_planejamento: '',
    quanto: '',
  });
  const [acoesImediatas, setAcoesImediatas] = useState([]);
  const [acoesCorretivas, setAcoesCorretivas] = useState([]);

  const API_BASE_URL = 'http://localhost:8000'; // Ajuste para sua API FastAPI

  // Carregar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/acompanhamentos/1/`); // Substitua "1" pelo ID real
        setAcompanhamentoNc(response.data);
        setAcoesImediatas(response.data.acoes_imediatas || []);
        setAcoesCorretivas(response.data.acoes_corretivas || []);
      } catch (error) {
        console.error('Erro ao carregar acompanhamento:', error);
      }
    };
    fetchData();
  }, []);

  // Manipulação de formulários
  const handleAcaoChange = (e) => {
    const { name, value } = e.target;
    setAcaoForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCausaChange = (e) => {
    setCausaForm({ analise_causa: e.target.value });
  };

  const handleCincoPorquesChange = (e) => {
    const { name, value } = e.target;
    setCincoPorques(prev => ({ ...prev, [name]: value }));
  };

  const handleAcaoCorretivaChange = (e) => {
    const { name, value } = e.target;
    setAcaoCorretivaForm(prev => ({ ...prev, [name]: value }));
  };

  // Submissão dos formulários
  const handleAcaoSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/acompanhamentos/1/acoes_imediatas/`, acaoForm);
      setAcoesImediatas([...acoesImediatas, response.data]);
      setAcaoForm({ descricao_acao: '', responsavel_acao_2: '', prazo_acao: '', status_acao: 'Pendente' });
      alert('Ação cadastrada com sucesso!');
    } catch (error) {
      alert('Erro ao cadastrar ação: ' + (error.response?.data?.detail || 'Erro desconhecido'));
    }
  };

  const handleCausaSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/acompanhamentos/1/causa/`, causaForm);
      alert('Causa cadastrada com sucesso!');
    } catch (error) {
      alert('Erro ao cadastrar causa: ' + (error.response?.data?.detail || 'Erro desconhecido'));
    }
  };

  const handleCincoPorquesSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/acompanhamentos/1/cinco_porques/`, cincoPorques);
      alert('5 Porquês cadastrados com sucesso!');
    } catch (error) {
      alert('Erro ao cadastrar 5 porquês: ' + (error.response?.data?.detail || 'Erro desconhecido'));
    }
  };

  const handleAcaoCorretivaSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/acompanhamentos/1/acoes_corretivas/`, acaoCorretivaForm);
      setAcoesCorretivas([...acoesCorretivas, response.data]);
      setAcaoCorretivaForm({
        o_que_fazer: '',
        por_que_fazer: '',
        como_fazer: '',
        onde_fazer: '',
        quem_vai_fazer: '',
        prazo_planejamento: '',
        quanto: '',
      });
      alert('Ação corretiva salva com sucesso!');
    } catch (error) {
      alert('Erro ao salvar ação corretiva: ' + (error.response?.data?.detail || 'Erro desconhecido'));
    }
  };

  const handleEncerrar = async () => {
    try {
      await axios.post(`${API_BASE_URL}/acompanhamentos/1/encerrar/`);
      alert('Não conformidade encerrada com sucesso!');
    } catch (error) {
      alert('Erro ao encerrar: ' + (error.response?.data?.detail || 'Erro desconhecido'));
    }
  };

  return (
    <div className="container mt-4">
      <h2>Acompanhamento de Não Conformidade</h2>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} id="myTab">
        <Tab eventKey="detalhes" title="Detalhes">
          <h3>Detalhes</h3>
          <div className="form-group row">
            <Form.Group className="col-md-3">
              <Form.Label>Número da NC</Form.Label>
              <Form.Control type="text" value={acompanhamentoNc.numero_nc || ''} readOnly />
            </Form.Group>
            <Form.Group className="col-md-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Control type="text" value={acompanhamentoNc.cliente || ''} readOnly />
            </Form.Group>
            <Form.Group className="col-md-3">
              <Form.Label>Data</Form.Label>
              <Form.Control type="date" value={acompanhamentoNc.data || ''} readOnly />
            </Form.Group>
            <Form.Group className="col-md-3">
              <Form.Label>Código do Produto</Form.Label>
              <Form.Control type="text" value={acompanhamentoNc.codigo_produto || ''} readOnly />
            </Form.Group>
          </div>
          <div className="form-group row">
            <Form.Group className="col-md-3">
              <Form.Label>Descrição do Produto</Form.Label>
              <Form.Control type="text" value={acompanhamentoNc.descricao_produto || ''} readOnly />
            </Form.Group>
            <Form.Group className="col-md-3">
              <Form.Label>OS</Form.Label>
              <Form.Control type="text" value={acompanhamentoNc.os || ''} readOnly />
            </Form.Group>
            <Form.Group className="col-md-3">
              <Form.Label>Quantidade</Form.Label>
              <Form.Control type="number" value={acompanhamentoNc.quantidade || ''} readOnly />
            </Form.Group>
            <Form.Group className="col-md-3">
              <Form.Label>Processo</Form.Label>
              <Form.Control type="text" value={acompanhamentoNc.processo || ''} readOnly />
            </Form.Group>
          </div>
          <div className="form-group row">
            <Form.Group className="col-md-3">
              <Form.Label>Origem NC</Form.Label>
              <Form.Control type="text" value={acompanhamentoNc.origem_nc || ''} readOnly />
            </Form.Group>
            <Form.Group className="col-md-3">
              <Form.Label>Descrição da Não Conformidade</Form.Label>
              <Form.Control as="textarea" rows={3} value={acompanhamentoNc.descricao_nc || ''} readOnly />
            </Form.Group>
            <Form.Group className="col-md-3">
              <Form.Label>Tipo de NC</Form.Label>
              <Form.Control type="text" value={acompanhamentoNc.tipo_nc || ''} readOnly />
            </Form.Group>
            <Form.Group className="col-md-3">
              <Form.Label>Responsável por Encontrar</Form.Label>
              <Form.Control type="text" value={acompanhamentoNc.responsavel_encontrou || ''} readOnly />
            </Form.Group>
          </div>
          <div className="form-group row">
            <Form.Group className="col-md-3">
              <Form.Label>Ação Corretiva</Form.Label>
              <Form.Control as="textarea" rows={3} value={acompanhamentoNc.acao_corretiva || ''} readOnly />
            </Form.Group>
            <Form.Group className="col-md-3">
              <Form.Label>Disposição da Peça</Form.Label>
              <Form.Control type="text" value={acompanhamentoNc.disposicao_peca || ''} readOnly />
            </Form.Group>
            <Form.Group className="col-md-3">
              <Form.Label>Prazo</Form.Label>
              <Form.Control type="date" value={acompanhamentoNc.prazo || ''} readOnly />
            </Form.Group>
            <Form.Group className="col-md-3">
              <Form.Label>Responsável pela Ação</Form.Label>
              <Form.Control type="text" value={acompanhamentoNc.responsavel_acao || ''} readOnly />
            </Form.Group>
          </div>
          <div className="form-group row">
            <Form.Group className="col-md-3">
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" value={acompanhamentoNc.status || ''} readOnly />
            </Form.Group>
          </div>
        </Tab>

        <Tab eventKey="acao" title="Ação Imediata">
          <h3>Ação Imediata</h3>
          <Form id="form-acao-imediata" onSubmit={handleAcaoSubmit}>
            <div className="form-group row">
              <Form.Group className="col-md-3">
                <Form.Label>Descrição da Ação</Form.Label>
                <Form.Control as="textarea" rows={3} name="descricao_acao" value={acaoForm.descricao_acao} onChange={handleAcaoChange} required />
              </Form.Group>
              <Form.Group className="col-md-3">
                <Form.Label>Responsável pela Ação</Form.Label>
                <Form.Control type="text" name="responsavel_acao_2" value={acaoForm.responsavel_acao_2} onChange={handleAcaoChange} required />
              </Form.Group>
              <Form.Group className="col-md-3">
                <Form.Label>Prazo da Ação</Form.Label>
                <Form.Control type="date" name="prazo_acao" value={acaoForm.prazo_acao} onChange={handleAcaoChange} required />
              </Form.Group>
              <Form.Group className="col-md-3">
                <Form.Label>Status da Ação</Form.Label>
                <Form.Control as="select" name="status_acao" value={acaoForm.status_acao} onChange={handleAcaoChange} required>
                  <option value="Pendente">Pendente</option>
                  <option value="Concluída">Concluída</option>
                </Form.Control>
              </Form.Group>
            </div>
            <Button type="submit" variant="primary">Cadastrar Ação</Button>
          </Form>
          <hr />
          <h4>Ações Cadastradas</h4>
          {acoesImediatas.length > 0 ? (
            <Table bordered>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Responsável</th>
                  <th>Prazo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {acoesImediatas.map((acao, index) => (
                  <tr key={index}>
                    <td>{acao.descricao_acao}</td>
                    <td>{acao.responsavel_acao}</td>
                    <td>{acao.prazo_acao}</td>
                    <td>{acao.status_acao}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>Não há ações cadastradas.</p>
          )}
        </Tab>

        <Tab eventKey="causa" title="Causa">
          <h3>Causa</h3>
          <Form id="form-causa-raiz" onSubmit={handleCausaSubmit}>
            <Form.Group>
              <Form.Label>Análise da Causa Raiz</Form.Label>
              <Form.Control as="textarea" rows={3} value={causaForm.analise_causa} onChange={handleCausaChange} placeholder="Descreva a causa raiz identificada" />
            </Form.Group>
            <Button type="submit" variant="primary">Cadastrar Ação</Button>
          </Form>
          <Form id="form-5-porque" onSubmit={handleCincoPorquesSubmit} className="mt-4">
            <Form.Group>
              <Form.Label>1 Porquê</Form.Label>
              <Form.Control as="textarea" rows={3} name="primeiro_porque" value={cincoPorques.primeiro_porque} onChange={handleCincoPorquesChange} placeholder="Resposta do primeiro porquê" />
            </Form.Group>
            <Form.Group>
              <Form.Label>2 Porquê</Form.Label>
              <Form.Control as="textarea" rows={3} name="segundo_porque" value={cincoPorques.segundo_porque} onChange={handleCincoPorquesChange} placeholder="Resposta do segundo porquê" />
            </Form.Group>
            <Form.Group>
              <Form.Label>3 Porquê</Form.Label>
              <Form.Control as="textarea" rows={3} name="terceiro_porque" value={cincoPorques.terceiro_porque} onChange={handleCincoPorquesChange} placeholder="Resposta do terceiro porquê" />
            </Form.Group>
            <Form.Group>
              <Form.Label>4 Porquê</Form.Label>
              <Form.Control as="textarea" rows={3} name="quarto_porque" value={cincoPorques.quarto_porque} onChange={handleCincoPorquesChange} placeholder="Resposta do quarto porquê" />
            </Form.Group>
            <Form.Group>
              <Form.Label>5 Porquê</Form.Label>
              <Form.Control as="textarea" rows={3} name="quinto_porque" value={cincoPorques.quinto_porque} onChange={handleCincoPorquesChange} placeholder="Resposta do quinto porquê" />
            </Form.Group>
            <Button type="submit" variant="primary">Cadastrar Ação</Button>
          </Form>
        </Tab>

        <Tab eventKey="planejamento" title="Planejamento">
          <h3>Planejamento</h3>
          <Form id="form-acao-corretiva" onSubmit={handleAcaoCorretivaSubmit}>
            <Form.Group>
              <Form.Label>O que fazer</Form.Label>
              <Form.Control as="textarea" rows={3} name="o_que_fazer" value={acaoCorretivaForm.o_que_fazer} onChange={handleAcaoCorretivaChange} placeholder="O que deve ser feito?" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Por que fazer</Form.Label>
              <Form.Control as="textarea" rows={3} name="por_que_fazer" value={acaoCorretivaForm.por_que_fazer} onChange={handleAcaoCorretivaChange} placeholder="Por que é necessário fazer isso?" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Como fazer</Form.Label>
              <Form.Control as="textarea" rows={3} name="como_fazer" value={acaoCorretivaForm.como_fazer} onChange={handleAcaoCorretivaChange} placeholder="Como será feito?" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Onde fazer</Form.Label>
              <Form.Control as="textarea" rows={3} name="onde_fazer" value={acaoCorretivaForm.onde_fazer} onChange={handleAcaoCorretivaChange} placeholder="Onde será realizado?" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Quem vai fazer</Form.Label>
              <Form.Control type="text" name="quem_vai_fazer" value={acaoCorretivaForm.quem_vai_fazer} onChange={handleAcaoCorretivaChange} placeholder="Quem será responsável?" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Prazo</Form.Label>
              <Form.Control type="date" name="prazo_planejamento" value={acaoCorretivaForm.prazo_planejamento} onChange={handleAcaoCorretivaChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Quanto</Form.Label>
              <Form.Control type="number" step="0.01" name="quanto" value={acaoCorretivaForm.quanto} onChange={handleAcaoCorretivaChange} placeholder="Quanto custa?" />
            </Form.Group>
            <Button type="submit" variant="primary">Salvar Ação Corretiva</Button>
          </Form>
          <h4>Lista de Ações Corretivas</h4>
          <ul id="lista-acoes-corretivas">
            {acoesCorretivas.map((acao, index) => (
              <li key={index}>
                <strong>{acao.o_que_fazer}</strong><br />
                Por que: {acao.por_que_fazer}<br />
                Como: {acao.como_fazer}<br />
                Onde: {acao.onde_fazer}<br />
                Quem: {acao.quem_vai_fazer}<br />
                Prazo: {acao.prazo_planejamento}<br />
                Custo: R$ {acao.quanto}<br /><br />
              </li>
            ))}
          </ul>
        </Tab>

        <Tab eventKey="implementacao" title="Implementação">
          <h3>Implementação</h3>
          <Form.Group>
            <Form.Label>Encerrar a Ação?</Form.Label>
            <Form.Control as="select" id="encerrar_acao">
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Anexar Documento</Form.Label>
            <Form.Control type="file" id="anexar_doc" />
          </Form.Group>
        </Tab>

        <Tab eventKey="eficiencia" title="Eficiência">
          <h3>Eficiência</h3>
          <Form.Group>
            <Form.Label>As ações implementadas eliminaram as causas de não conformidade?</Form.Label>
            <Form.Control as="select" id="eficiencia_resposta">
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="postergar">Postergar</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Evidência</Form.Label>
            <Form.Control as="textarea" rows={3} id="evidencia" placeholder="Descreva as evidências das ações implementadas" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Anexo</Form.Label>
            <Form.Control type="file" id="anexo_eficiencia" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Há necessidade de atualizar riscos e oportunidades?</Form.Label>
            <Form.Control as="select" id="atualizar_riscos">
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </Form.Control>
            <Form.Control type="text" className="mt-2" id="detalhe_riscos" placeholder="Detalhamento (opcional)" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Há necessidade de realizar mudanças no sistema de gestão da qualidade?</Form.Label>
            <Form.Control as="select" id="alterar_sistema_qualidade">
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </Form.Control>
            <Form.Control type="text" className="mt-2" id="detalhe_qualidade" placeholder="Detalhamento (opcional)" />
          </Form.Group>
        </Tab>

        <Tab eventKey="encerrar" title="Encerrar">
          <h3>Encerrar</h3>
          <p>Após todas as etapas, se tudo estiver resolvido e documentado, podemos encerrar o processo de acompanhamento da não conformidade.</p>
          <Button variant="success" onClick={handleEncerrar}>Encerrar</Button>
        </Tab>
      </Tabs>
    </div>
  );
};

export default NaoConformidade;