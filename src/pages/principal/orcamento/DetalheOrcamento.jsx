import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Orcamento.css';

const CadastroOrcamento = () => {
  const [orcamento, setOrcamento] = useState({
    id: 0,
    idCliente: '',
    idFuncionario: '',
    idCNPJ: '',
    descricao: '',
    prazo_resposta: '',
    prazo_entrega: '',
    imposto_id: 0,
    imposto_percentual: '',
    valor_total_com_imposto: '',
    lucro_percentual: '',
    despesas_percentual: '',
    desconto_percentual: '',
    valor_total_lucro: '',
    valor_total_sem_desconto: '',
    valor_total_com_desconto: '',
    valor_total_projetos: '',
    valor_total_subprojetos: '',
    valor_total_geral: '',
  });
  const [clientes, setClientes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [cnpjs, setCnpjs] = useState([]);
  const [impostos, setImpostos] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const API_BASE_URL = 'http://localhost:8000'; // Ajuste para sua API

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, funcionariosRes, cnpjsRes, impostosRes, projetosRes, orcamentoRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/clientes/`),
          axios.get(`${API_BASE_URL}/funcionarios/`),
          axios.get(`${API_BASE_URL}/cnpjs/`),
          axios.get(`${API_BASE_URL}/impostos/`),
          axios.get(`${API_BASE_URL}/projetos/`),
          axios.get(`${API_BASE_URL}/orcamentos/current/`),
        ]);
        setClientes(clientesRes.data);
        setFuncionarios(funcionariosRes.data);
        setCnpjs(cnpjsRes.data);
        setImpostos(impostosRes.data);
        setProjetos(projetosRes.data.filter(p => p.orcamento_id === orcamentoRes.data.id));
        setOrcamento(orcamentoRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrcamento(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrcamento = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/editar_orcamento/`, orcamento);
      if (response.data.success) {
        alert('Orçamento atualizado com sucesso!');
        window.location.reload();
      } else {
        alert('Erro ao atualizar o orçamento: ' + response.data.error);
      }
    } catch (error) {
      alert('Erro ao enviar a requisição: ' + error.message);
    }
  };

  const handleDeleteProjeto = async (projetoId) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await axios.post(`${API_BASE_URL}/excluir_projeto/${projetoId}/`);
        setProjetos(projetos.filter(p => p.id !== projetoId));
        alert('Projeto excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir projeto: ' + error.message);
      }
    }
  };

  const handleDeleteSubprojeto = async (subprojetoId) => {
    if (window.confirm('Tem certeza que deseja excluir este subprojeto?')) {
      try {
        await axios.post(`${API_BASE_URL}/excluir_subprojeto/${subprojetoId}/`);
        setProjetos(projetos.map(p => ({
          ...p,
          subprojetos: p.subprojetos.filter(s => s.id !== subprojetoId),
        })));
        alert('Subprojeto excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir subprojeto: ' + error.message);
      }
    }
  };

  const calcularValor = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calcular_valor_orcamento/`, {
        orcamento_id: orcamento.id,
        lucro_percentual: orcamento.lucro_percentual,
        desconto_percentual: orcamento.desconto_percentual,
        despesas_percentual: orcamento.despesas_percentual,
        imposto_percentual: orcamento.imposto_percentual,
      });
      setOrcamento(prev => ({
        ...prev,
        valor_total_com_desconto: response.data.valor_total_com_desconto,
        valor_total_sem_desconto: response.data.subtotal,
        valor_total_lucro: response.data.lucro,
        valor_total_com_imposto: response.data.total_imposto,
        valor_total_projetos: response.data.valor_total_projetos,
        valor_total_subprojetos: response.data.valor_total_subprojetos,
        valor_total_geral: response.data.valor_total_geral,
      }));
    } catch (error) {
      console.error('Erro ao calcular o valor do orçamento:', error);
    }
  };

  const handleImpostoChange = (e) => {
    const selectedTotal = e.target.value;
    setOrcamento(prev => ({ ...prev, imposto_percentual: selectedTotal }));
    calcularValor();
  };

  const toggleChildren = (projetoId) => {
    const rows = document.querySelectorAll(`#subprojeto-${projetoId} ~ .child`);
    rows.forEach(row => {
      row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
    });
    const button = document.querySelector(`#projeto-${projetoId} .toggle-btn`);
    button.textContent = button.textContent === '▶' ? '▼' : '▶';
  };

  return (
    <div>
      <header className="header-projeto">
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <i className="bx bx-home"></i>
          <span>Orçamento / Cadastro</span>
        </div>
        <h3 className="text-xl font-bold mt-2">Cadastro de orçamento</h3>
        <p className="text-gray-500">Crie e gerencie orçamentos com praticidade.</p>
      </header>

      <div className="bau">
        {/* Cabeçalho Orçamento */}
        <div className="section">
          <form id="cadastroOrcamentoForm" onSubmit={handleSubmitOrcamento}>
            <div className="col-sm">
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="idCliente">Cliente</label>
                  <select
                    name="idCliente"
                    id="idCliente"
                    value={orcamento.idCliente}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Selecione</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="idFuncionario">Funcionário</label>
                  <select
                    name="idFuncionario"
                    id="idFuncionario"
                    value={orcamento.idFuncionario}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Selecione</option>
                    {funcionarios.map(funcionario => (
                      <option key={funcionario.id} value={funcionario.id}>{funcionario.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="idCNPJ">CNPJ</label>
                  <select
                    name="idCNPJ"
                    id="idCNPJ"
                    value={orcamento.idCNPJ}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Selecione</option>
                    {cnpjs.map(cnpj => (
                      <option key={cnpj.id} value={cnpj.id}>{cnpj.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="descricao">Descrição</label>
                  <textarea
                    name="descricao"
                    id="idDescricao"
                    rows="3"
                    value={orcamento.descricao}
                    onChange={handleChange}
                    placeholder="Descrição do orçamento"
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="prazo_resposta">Prazo de Resposta</label>
                  <input
                    type="date"
                    name="prazo_resposta"
                    id="prazo_resposta"
                    value={orcamento.prazo_resposta}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="prazo_entrega">Prazo de Entrega</label>
                  <input
                    type="number"
                    name="prazo_entrega"
                    id="prazo_entrega"
                    value={orcamento.prazo_entrega}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <div className="text-right mt-3">
              <button type="submit" className="btn btn-primary">Salvar</button>
            </div>
          </form>
        </div>

        {/* Cadastro de Peças */}
        <div className="section-separator">
          <span>Cadastro de Peças</span>
          <a href={`/cadastro-projeto/${orcamento.id}`} className="btn btn-primary">Cadastrar projeto</a>
          <hr />
        </div>
        <div className="section">
          <table className="tree-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Custo Peça</th>
                <th>Custo Serviço</th>
                <th>Custo Sub-Peças</th>
                <th>Custo Serviço T.</th>
                <th>Custo Geral</th>
                <th>Data de Início</th>
                <th>Data de Entrega</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {projetos.length > 0 ? (
                projetos.map(projeto => (
                  <React.Fragment key={projeto.id}>
                    <tr className="tree-node parent" id={`projeto-${projeto.id}`}>
                      <td>
                        <button className="toggle-btn" onClick={() => toggleChildren(projeto.id)}>▶</button>
                        <strong>{projeto.nome_peca}</strong>
                      </td>
                      <td>R$ {(projeto.valor_total || 0).toFixed(2)}</td>
                      <td>R$ {(projeto.valor_total_servico || 0).toFixed(2)}</td>
                      <td>R$ {(projeto.valor_subprojeto || 0).toFixed(2)}</td>
                      <td><span className="status">{(projeto.valor_total_servico_geral || 0).toFixed(2)}</span></td>
                      <td>R$ {(projeto.valor_completo || 0).toFixed(2)}</td>
                      <td>{new Date(projeto.data_inicio).toLocaleDateString('pt-BR')}</td>
                      <td>{new Date(projeto.data_entrega).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteProjeto(projeto.id)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                    {projeto.subprojetos && projeto.subprojetos.length > 0 ? (
                      projeto.subprojetos.map(subprojeto => (
                        <tr className="tree-node child" id={`subprojeto-${subprojeto.id}`} key={subprojeto.id} style={{ display: 'none' }}>
                          <td className="child-item">↳ {subprojeto.nome_peca}</td>
                          <td>R$ {(subprojeto.valor_total || 0).toFixed(2)}</td>
                          <td>R$ {(subprojeto.valor_total_servico || 0).toFixed(2)}</td>
                          <td>-</td>
                          <td>-</td>
                          <td>—</td>
                          <td>{new Date(subprojeto.data_inicio).toLocaleDateString('pt-BR')}</td>
                          <td>{new Date(subprojeto.data_entrega).toLocaleDateString('pt-BR')}</td>
                          <td>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteSubprojeto(subprojeto.id)}
                            >
                              🗑
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="tree-node child" style={{ display: 'none' }}>
                        <td className="child-item">Nenhum subprojeto</td>
                        <td colSpan="8">—</td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="9">Nenhum projeto encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Fechamento do Orçamento */}
        <div className="section-separator">
          <span>Fechamento do Orçamento</span>
          <hr />
        </div>
        <div className="section">
          <div className="section-content">
            <form id="fechamentoOrcamentoForm">
              <div className="horizontal">
                <div className="form-group col-md-4">
                  <label htmlFor="valor_total_projetos">Custo Peças</label>
                  <input
                    type="number"
                    step="0.01"
                    name="valor_total_projetos"
                    id="valor_total_projetos"
                    value={orcamento.valor_total_projetos}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="valor_total_subprojetos">Custo Sub Peças</label>
                  <input
                    type="number"
                    step="0.01"
                    name="valor_total_subprojetos"
                    id="valor_total_subprojetos"
                    value={orcamento.valor_total_subprojetos}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="valor_total_geral">Custo Peças Total</label>
                  <input
                    type="number"
                    step="0.01"
                    name="valor_total_geral"
                    id="valor_total_geral"
                    value={orcamento.valor_total_geral}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="horizontal">
                <div className="form-group col-md-4">
                  <label htmlFor="imposto_id">Imposto</label>
                  <select
                    name="imposto_id"
                    id="imposto_id"
                    value={orcamento.imposto_id}
                    onChange={handleImpostoChange}
                    className="form-control"
                  >
                    <option value="0">Selecionar Imposto</option>
                    {impostos.map(imposto => (
                      <option key={imposto.id} value={imposto.total}>{imposto.tags}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="imposto_percentual">Porcentagem</label>
                  <input
                    type="number"
                    step="0.01"
                    name="imposto_percentual"
                    id="imposto_percentual"
                    value={orcamento.imposto_percentual}
                    onChange={e => { handleChange(e); calcularValor(); }}
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="valor_total_com_imposto">Valor imposto</label>
                  <input
                    type="number"
                    step="0.01"
                    name="valor_total_com_imposto"
                    id="valor_total_com_imposto"
                    value={orcamento.valor_total_com_imposto}
                    readOnly
                    className="form-control"
                  />
                </div>
              </div>
              <div className="horizontal">
                <div className="form-group col-md-4">
                  <label htmlFor="lucro_percentual">Lucro %</label>
                  <input
                    type="number"
                    step="0.01"
                    name="lucro_percentual"
                    id="lucro_percentual"
                    value={orcamento.lucro_percentual}
                    onChange={e => { handleChange(e); calcularValor(); }}
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="despesas_percentual">Despesas %</label>
                  <input
                    type="number"
                    step="0.01"
                    name="despesas_percentual"
                    id="despesas_percentual"
                    value={orcamento.despesas_percentual}
                    onChange={e => { handleChange(e); calcularValor(); }}
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="desconto_percentual">Desconto %</label>
                  <input
                    type="number"
                    step="0.01"
                    name="desconto_percentual"
                    id="desconto_percentual"
                    value={orcamento.desconto_percentual}
                    onChange={e => { handleChange(e); calcularValor(); }}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="horizontal">
                <div className="form-group col-md-4">
                  <label htmlFor="valor_total_lucro">Lucro total</label>
                  <input
                    type="number"
                    step="0.01"
                    name="valor_total_lucro"
                    id="valor_total_lucro"
                    value={orcamento.valor_total_lucro}
                    readOnly
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="valor_total_sem_desconto">Sub total</label>
                  <input
                    type="number"
                    step="0.01"
                    name="valor_total_sem_desconto"
                    id="valor_total_sem_desconto"
                    value={orcamento.valor_total_sem_desconto}
                    readOnly
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="valor_total_com_desconto">Total</label>
                  <input
                    type="number"
                    step="0.01"
                    name="valor_total_com_desconto"
                    id="valor_total_com_desconto"
                    value={orcamento.valor_total_com_desconto}
                    readOnly
                    className="form-control"
                  />
                </div>
              </div>
              <button type="button" className="btn btn-primary" onClick={calcularValor}>Salvar Orçamento</button>
              <a href={`/gerar-pdf-orcamento/${orcamento.id}`} className="btn btn-primary ms-2">PDF simples</a>
              <a href={`/gerar-pdf-orcamento-detalhado/${orcamento.id}`} className="btn btn-primary ms-2">PDF detalhada</a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroOrcamento;