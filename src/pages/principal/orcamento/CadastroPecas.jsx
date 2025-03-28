import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Projeto.css';

const CadastroProjeto = () => {
  const [formData, setFormData] = useState({
    id_projeto: 0,
    acao: 'cadastrar_projeto',
    id_orcamento: 1, // Valor fixo como no original, ajuste conforme necessário
    nome_peca: '',
    quantidade: 1,
    id_peca_pai: 'Novo_Projeto',
    custo_material: '0.00',
    custo_posto: '0.00',
    custo_servico: '0.00',
    custo_total: '0.00',
    foto_projeto_caminho: null,
  });
  const [materiais, setMateriais] = useState([]);
  const [postos, setPostos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [projetoMaterial, setProjetoMaterial] = useState([]);
  const [projetoPosto, setProjetoPosto] = useState([]);
  const [projetoServico, setProjetoServico] = useState([]);
  const [materialTab, setMaterialTab] = useState({ material_id: '', custo_material_tab: '', peso_usado: '', valor_usado: '' });
  const [postoTab, setPostoTab] = useState({ posto_id: '', funcionario_id: '', valor_posto_hora: '', hora_posto: '', valor_total_posto: '' });
  const [servicoTab, setServicoTab] = useState({ servico_id: '', hora_servico: '', valor_servico: '', valor_total_servico: '' });
  const [activeTab, setActiveTab] = useState('material_tab');
  const API_BASE_URL = 'http://localhost:8000'; // Ajuste para sua API

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materiaisRes, postosRes, servicosRes, funcionariosRes, projetosRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/materiais/`),
          axios.get(`${API_BASE_URL}/postos/`),
          axios.get(`${API_BASE_URL}/servicos/`),
          axios.get(`${API_BASE_URL}/funcionarios/`),
          axios.get(`${API_BASE_URL}/projetos/`),
        ]);
        setMateriais(materiaisRes.data);
        setPostos(postosRes.data);
        setServicos(servicosRes.data);
        setFuncionarios(funcionariosRes.data);
        setProjetos(projetosRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    if (['quantidade', 'custo_material', 'custo_posto', 'custo_servico'].includes(name)) {
      atualizarCustoTotal({ ...formData, [name]: value });
    }
  };

  const handleTabChange = (e, tab) => {
    e.preventDefault();
    setActiveTab(tab);
  };

  const atualizarCustoTotal = (data) => {
    const quantidade = parseFloat(data.quantidade) || 1;
    const custoMaterial = parseFloat(data.custo_material) || 0;
    const custoPosto = parseFloat(data.custo_posto) || 0;
    const custoServico = parseFloat(data.custo_servico) || 0;
    const custoTotal = (custoMaterial + custoPosto + custoServico) * quantidade;
    setFormData(prev => ({ ...prev, custo_total: custoTotal.toFixed(2) }));
  };

  const parseBRL = (value) => {
    if (!value) return 0;
    return parseFloat(value.toString().replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  };

  const formatBRL = (value) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleMaterialChange = (e) => {
    const { name, value } = e.target;
    setMaterialTab(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'material_id') {
        const selectedMaterial = materiais.find(m => m.id === parseInt(value));
        updated.custo_material_tab = selectedMaterial ? formatBRL(selectedMaterial.custo_proporcional) : '';
      }
      if (name === 'peso_usado' || name === 'custo_material_tab') {
        const custoUnitario = parseBRL(updated.custo_material_tab);
        const pesoUsado = parseBRL(updated.peso_usado);
        updated.valor_usado = formatBRL(custoUnitario * pesoUsado);
      }
      return updated;
    });
  };

  const handlePostoChange = (e) => {
    const { name, value } = e.target;
    setPostoTab(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'posto_id') {
        const selectedPosto = postos.find(p => p.id === parseInt(value));
        updated.valor_posto_hora = selectedPosto ? formatBRL(selectedPosto.custo_h) : '';
      }
      if (name === 'hora_posto' || name === 'valor_posto_hora') {
        const custoHora = parseBRL(updated.valor_posto_hora);
        const horas = parseBRL(updated.hora_posto);
        updated.valor_total_posto = formatBRL(custoHora * horas);
      }
      return updated;
    });
  };

  const handleServicoChange = (e) => {
    const { name, value } = e.target;
    setServicoTab(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'servico_id') {
        const selectedServico = servicos.find(s => s.id === parseInt(value));
        updated.valor_servico = selectedServico ? formatBRL(selectedServico.preco) : '';
      }
      if (name === 'hora_servico' || name === 'servico_id') {
        const custoServico = parseBRL(updated.valor_servico);
        const horas = parseBRL(updated.hora_servico);
        updated.valor_total_servico = formatBRL(custoServico * horas);
      }
      return updated;
    });
  };

  const adicionarMaterial = () => {
    if (!materialTab.material_id || parseBRL(materialTab.valor_usado) <= 0) {
      alert('Preencha todos os campos corretamente para adicionar o material.');
      return;
    }
    const materialNome = materiais.find(m => m.id === parseInt(materialTab.material_id))?.codigo_material;
    const novoMaterial = {
      material_id: materialTab.material_id,
      valor_peca: parseBRL(materialTab.valor_usado),
      kg_por_peca: parseBRL(materialTab.peso_usado),
      nome: materialNome,
    };
    setProjetoMaterial([...projetoMaterial, novoMaterial]);
    setFormData(prev => ({
      ...prev,
      custo_material: formatBRL(parseBRL(prev.custo_material) + parseBRL(materialTab.valor_usado)),
    }));
    setMaterialTab({ material_id: '', custo_material_tab: '', peso_usado: '', valor_usado: '' });
    atualizarCustoTotal({
      ...formData,
      custo_material: parseBRL(formData.custo_material) + parseBRL(materialTab.valor_usado),
    });
  };

  const adicionarPosto = () => {
    if (!postoTab.posto_id || parseBRL(postoTab.valor_total_posto) <= 0) {
      alert('Preencha todos os campos corretamente para adicionar o posto.');
      return;
    }
    const postoNome = postos.find(p => p.id === parseInt(postoTab.posto_id))?.nome_posto;
    const funcionarioNome = funcionarios.find(f => f.id === parseInt(postoTab.funcionario_id))?.nome;
    const novoPosto = {
      posto_id: postoTab.posto_id,
      funcionario_id: postoTab.funcionario_id,
      hora_trabalhada: parseBRL(postoTab.hora_posto),
      custo: parseBRL(postoTab.valor_total_posto),
      nome_posto: postoNome,
      nome_funcionario: funcionarioNome,
    };
    setProjetoPosto([...projetoPosto, novoPosto]);
    setFormData(prev => ({
      ...prev,
      custo_posto: formatBRL(parseBRL(prev.custo_posto) + parseBRL(postoTab.valor_total_posto)),
    }));
    setPostoTab({ posto_id: '', funcionario_id: '', valor_posto_hora: '', hora_posto: '', valor_total_posto: '' });
    atualizarCustoTotal({
      ...formData,
      custo_posto: parseBRL(formData.custo_posto) + parseBRL(postoTab.valor_total_posto),
    });
  };

  const adicionarServico = () => {
    if (!servicoTab.servico_id || parseBRL(servicoTab.valor_total_servico) <= 0) {
      alert('Preencha todos os campos corretamente para adicionar o serviço.');
      return;
    }
    const servicoNome = servicos.find(s => s.id === parseInt(servicoTab.servico_id))?.nome;
    const novoServico = {
      servico_id: servicoTab.servico_id,
      hora: parseBRL(servicoTab.hora_servico),
      custo: parseBRL(servicoTab.valor_total_servico),
      nome: servicoNome,
    };
    setProjetoServico([...projetoServico, novoServico]);
    setFormData(prev => ({
      ...prev,
      custo_servico: formatBRL(parseBRL(prev.custo_servico) + parseBRL(servicoTab.valor_total_servico)),
    }));
    setServicoTab({ servico_id: '', hora_servico: '', valor_servico: '', valor_total_servico: '' });
    atualizarCustoTotal({
      ...formData,
      custo_servico: parseBRL(formData.custo_servico) + parseBRL(servicoTab.valor_total_servico),
    });
  };

  const removerItem = (index, tipo) => {
    if (tipo === 'material') {
      const item = projetoMaterial[index];
      setProjetoMaterial(projetoMaterial.filter((_, i) => i !== index));
      setFormData(prev => ({
        ...prev,
        custo_material: formatBRL(parseBRL(prev.custo_material) - item.valor_peca),
      }));
      atualizarCustoTotal({
        ...formData,
        custo_material: parseBRL(formData.custo_material) - item.valor_peca,
      });
    } else if (tipo === 'posto') {
      const item = projetoPosto[index];
      setProjetoPosto(projetoPosto.filter((_, i) => i !== index));
      setFormData(prev => ({
        ...prev,
        custo_posto: formatBRL(parseBRL(prev.custo_posto) - item.custo),
      }));
      atualizarCustoTotal({
        ...formData,
        custo_posto: parseBRL(formData.custo_posto) - item.custo,
      });
    } else if (tipo === 'servico') {
      const item = projetoServico[index];
      setProjetoServico(projetoServico.filter((_, i) => i !== index));
      setFormData(prev => ({
        ...prev,
        custo_servico: formatBRL(parseBRL(prev.custo_servico) - item.custo),
      }));
      atualizarCustoTotal({
        ...formData,
        custo_servico: parseBRL(formData.custo_servico) - item.custo,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    data.append('materiais', JSON.stringify(projetoMaterial));
    data.append('postos', JSON.stringify(projetoPosto));
    data.append('servicos', JSON.stringify(projetoServico));

    try {
      const response = await axios.post(`${API_BASE_URL}/salvar_projeto/${formData.id_orcamento}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.id) {
        alert(`Projeto salvo com sucesso! ID: ${response.data.id}`);
        setFormData({
          id_projeto: 0,
          acao: 'cadastrar_projeto',
          id_orcamento: 1,
          nome_peca: '',
          quantidade: 1,
          id_peca_pai: 'Novo_Projeto',
          custo_material: '0.00',
          custo_posto: '0.00',
          custo_servico: '0.00',
          custo_total: '0.00',
          foto_projeto_caminho: null,
        });
        setProjetoMaterial([]);
        setProjetoPosto([]);
        setProjetoServico([]);
        window.location.reload();
      }
    } catch (error) {
      alert('Erro ao salvar o projeto: ' + error.message);
    }
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
        <button onClick={() => window.history.back()} className="btn-back">
          <i className="bx bx-arrow-back"></i> Voltar
        </button>
      </header>

      <div className="bau">
        <div className="section">
          <form id="cadastroProjetoForm" onSubmit={handleSubmit}>
            <input type="hidden" name="acao" value={formData.acao} />
            <input type="hidden" name="id_projeto" value={formData.id_projeto} />
            <input type="hidden" name="id_orcamento" value={formData.id_orcamento} />

            <div className="horizontal">
              <div className="alinhamento-v">
                <div className="form-group">
                  <label htmlFor="nome_peca">Nome da Peça</label>
                  <input
                    type="text"
                    name="nome_peca"
                    id="nome_peca"
                    value={formData.nome_peca}
                    onChange={handleChange}
                    placeholder="Inserir Nome da Peça"
                    className="form-control"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group col-md-2">
                    <label htmlFor="quantidade">Qtd.</label>
                    <input
                      type="number"
                      name="quantidade"
                      id="quantidade"
                      value={formData.quantidade}
                      onChange={handleChange}
                      placeholder="0"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group col-md-10">
                    <label htmlFor="id_peca_pai">Peça pai</label>
                    <select
                      name="id_peca_pai"
                      id="id_peca_pai"
                      value={formData.id_peca_pai}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="Novo_Projeto">Nova Peça</option>
                      {projetos.map(projeto => (
                        <option key={projeto.id} value={projeto.id}>{projeto.nome_peca}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="horizontal">
                  <div className="form-group">
                    <label htmlFor="custo_material">Custo Material</label>
                    <input
                      type="text"
                      name="custo_material"
                      id="custo_material"
                      value={formData.custo_material}
                      onChange={handleChange}
                      className="form-control money-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="custo_posto">Custo Posto</label>
                    <input
                      type="text"
                      name="custo_posto"
                      id="custo_posto"
                      value={formData.custo_posto}
                      onChange={handleChange}
                      className="form-control money-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="custo_servico">Custo Serviço</label>
                    <input
                      type="text"
                      name="custo_servico"
                      id="custo_servico"
                      value={formData.custo_servico}
                      onChange={handleChange}
                      className="form-control money-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="custo_total">Custo Total</label>
                  <input
                    type="text"
                    name="custo_total"
                    id="custo_total"
                    value={formData.custo_total}
                    readOnly
                    className="form-control money-input"
                  />
                </div>
                <div className="horizontal">
                  <label htmlFor="foto_projeto_caminho">Anexo</label>
                  <input
                    type="file"
                    name="foto_projeto_caminho"
                    id="foto_projeto_caminho"
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="vertical-line"></div>

              <div className="alinhamento-v">
                <div className="horizontal">
                  <ul className="nav-tabs">
                    <li className="nav-item">
                      <button
                        className={`nav-link tablink ${activeTab === 'material_tab' ? 'active' : ''}`}
                        onClick={(e) => handleTabChange(e, 'material_tab')}
                      >
                        Material
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link tablink ${activeTab === 'posto_tab' ? 'active' : ''}`}
                        onClick={(e) => handleTabChange(e, 'posto_tab')}
                      >
                        Posto
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link tablink ${activeTab === 'servico_tab' ? 'active' : ''}`}
                        onClick={(e) => handleTabChange(e, 'servico_tab')}
                      >
                        Serviço
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Material Tab */}
                <div className="tab-content" style={{ display: activeTab === 'material_tab' ? 'block' : 'none' }}>
                  <div className="horizontal">
                    <div className="alinhamento-v">
                      <div className="form-group">
                        <label htmlFor="material_id_tab">Material</label>
                        <div className="horizontal">
                          <select
                            name="material_id"
                            id="material_id_tab"
                            value={materialTab.material_id}
                            onChange={handleMaterialChange}
                            className="form-control"
                          >
                            <option value="">Selecione um Material</option>
                            {materiais.map(material => (
                              <option key={material.id} value={material.id} data-custo={material.custo_proporcional}>
                                {material.codigo_material}
                              </option>
                            ))}
                          </select>
                          <button type="button" className="btn btn-primary">Novo Material</button>
                        </div>
                      </div>
                      <div className="horizontal">
                        <div className="form-group">
                          <label htmlFor="custo_material_tab">Custo /kg</label>
                          <input
                            type="text"
                            name="custo_material_tab"
                            id="custo_material_tab"
                            value={materialTab.custo_material_tab}
                            onChange={handleMaterialChange}
                            className="form-control money-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="peso_usado">Kg Peça</label>
                          <input
                            type="text"
                            name="peso_usado"
                            id="peso_usado"
                            value={materialTab.peso_usado}
                            onChange={handleMaterialChange}
                            className="form-control money-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="valor_usado">Valor Total</label>
                          <input
                            type="text"
                            name="valor_usado"
                            id="valor_usado"
                            value={materialTab.valor_usado}
                            readOnly
                            className="form-control money-input"
                          />
                        </div>
                      </div>
                      <div className="horizontal">
                        <button type="button" className="btn btn-primary" onClick={adicionarMaterial}>Adc</button>
                      </div>
                    </div>
                    <div className="alinhamento-v">
                      <label>Materiais</label>
                      <div className="box">
                        <ul id="projeto_material">
                          {projetoMaterial.length > 0 ? (
                            projetoMaterial.map((material, index) => (
                              <li key={index} data-id={material.material_id} data-valor={material.valor_peca}>
                                Material: {material.nome} - Custo: {formatBRL(material.valor_peca)}
                                <button className="btn btn-danger" onClick={() => removerItem(index, 'material')}>Remover</button>
                              </li>
                            ))
                          ) : (
                            <p id="no_projeto">Nenhum material cadastrado ainda.</p>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Posto Tab */}
                <div className="tab-content" style={{ display: activeTab === 'posto_tab' ? 'block' : 'none' }}>
                  <div className="horizontal">
                    <div className="alinhamento-v">
                      <div className="form-group">
                        <label htmlFor="posto_projeto">Posto</label>
                        <div className="horizontal">
                          <select
                            name="posto_id"
                            id="posto_projeto"
                            value={postoTab.posto_id}
                            onChange={handlePostoChange}
                            className="form-control"
                          >
                            <option value="">Selecionar posto</option>
                            {postos.map(posto => (
                              <option key={posto.id} value={posto.id} data-custo={posto.custo_h}>
                                {posto.nome_posto}
                              </option>
                            ))}
                          </select>
                          <button type="button" className="btn btn-primary">Cadastrar Posto</button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="funcionario_projeto">Funcionário</label>
                        <select
                          name="funcionario_id"
                          id="funcionario_projeto"
                          value={postoTab.funcionario_id}
                          onChange={handlePostoChange}
                          className="form-control"
                        >
                          <option value="">Selecione</option>
                          {funcionarios.map(funcionario => (
                            <option key={funcionario.id} value={funcionario.id}>{funcionario.nome}</option>
                          ))}
                        </select>
                      </div>
                      <div className="horizontal">
                        <div className="form-group">
                          <label htmlFor="valor_posto_hora">Custo/h</label>
                          <input
                            type="text"
                            name="valor_posto_hora"
                            id="valor_posto_hora"
                            value={postoTab.valor_posto_hora}
                            onChange={handlePostoChange}
                            className="form-control money-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="hora_posto">Horas</label>
                          <input
                            type="text"
                            name="hora_posto"
                            id="hora_posto"
                            value={postoTab.hora_posto}
                            onChange={handlePostoChange}
                            className="form-control money-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="valor_total_posto">Valor Total</label>
                          <input
                            type="text"
                            name="valor_total_posto"
                            id="valor_total_posto"
                            value={postoTab.valor_total_posto}
                            readOnly
                            className="form-control money-input"
                          />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={adicionarPosto}>Adicionar</button>
                      </div>
                    </div>
                    <div className="alinhamento-v">
                      <label>Posto</label>
                      <div className="box">
                        <ul id="projeto_posto">
                          {projetoPosto.length > 0 ? (
                            projetoPosto.map((posto, index) => (
                              <li key={index} data-id={posto.posto_id} data-custo={posto.custo}>
                                Posto: {posto.nome_posto}, Funcionário: {posto.nome_funcionario} - Custo: {formatBRL(posto.custo)}
                                <button className="btn btn-danger" onClick={() => removerItem(index, 'posto')}>Remover</button>
                              </li>
                            ))
                          ) : (
                            <p id="no_projeto">Nenhum posto cadastrado ainda.</p>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Serviço Tab */}
                <div className="tab-content" style={{ display: activeTab === 'servico_tab' ? 'block' : 'none' }}>
                  <div className="horizontal">
                    <div className="alinhamento-v">
                      <div className="form-group">
                        <label htmlFor="servico_id">Serviço</label>
                        <div className="horizontal">
                          <select
                            name="servico_id"
                            id="servico_id"
                            value={servicoTab.servico_id}
                            onChange={handleServicoChange}
                            className="form-control"
                          >
                            <option value="">Selecionar serviço</option>
                            {servicos.map(servico => (
                              <option key={servico.id} value={servico.id} data-custo={servico.preco}>
                                {servico.nome}
                              </option>
                            ))}
                          </select>
                          <button type="button" className="btn btn-primary">Cadastrar Serviço</button>
                        </div>
                      </div>
                      <div className="horizontal">
                        <div className="form-group">
                          <label htmlFor="hora_servico">Hora</label>
                          <input
                            type="text"
                            name="hora_servico"
                            id="hora_servico"
                            value={servicoTab.hora_servico}
                            onChange={handleServicoChange}
                            className="form-control money-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="valor_servico">Valor</label>
                          <input
                            type="text"
                            name="valor_servico"
                            id="valor_servico"
                            value={servicoTab.valor_servico}
                            readOnly
                            className="form-control money-input"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="valor_total_servico">Valor Total</label>
                          <input
                            type="text"
                            name="valor_total_servico"
                            id="valor_total_servico"
                            value={servicoTab.valor_total_servico}
                            readOnly
                            className="form-control money-input"
                          />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={adicionarServico}>Adc</button>
                      </div>
                    </div>
                    <div className="alinhamento-v">
                      <label>Serviços</label>
                      <div className="box">
                        <ul id="projeto_servico">
                          {projetoServico.length > 0 ? (
                            projetoServico.map((servico, index) => (
                              <li key={index} data-id={servico.servico_id} data-custo={servico.custo}>
                                Serviço: {servico.nome} - Custo: {formatBRL(servico.custo)}
                                <button className="btn btn-danger" onClick={() => removerItem(index, 'servico')}>Remover</button>
                              </li>
                            ))
                          ) : (
                            <p id="no_projeto">Nenhum serviço cadastrado ainda.</p>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="horizontal">
              <button type="submit" className="btn btn-primary">Salvar</button>
            </div>
          </form>
        </div>

        <div className="section-separator">
          <span>Lista de peças</span>
          <hr />
        </div>

        <table className="tree-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Custo Peça</th>
              <th>Custo Serviço</th>
              <th>Custo Sub-Peças</th>
              <th>Custo Geral</th>
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
                    <td>R$ {(projeto.valor_completo || 0).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => editarPeca(projeto)}
                      >
                        Editar
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
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => editarPeca(subprojeto, true)}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="tree-node child" style={{ display: 'none' }}>
                      <td className="child-item">Nenhum subprojeto</td>
                      <td colSpan="5">—</td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6">Nenhum projeto encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  function editarPeca(item, isSubprojeto = false) {
    setFormData({
      id_projeto: item.id,
      acao: isSubprojeto ? 'editar_subprojeto' : 'editar_projeto',
      id_orcamento: 1,
      nome_peca: item.nome_peca,
      quantidade: item.quantidade || 1,
      id_peca_pai: item.id_peca_pai || 'Novo_Projeto',
      custo_material: formatBRL(item.custo_material || 0),
      custo_posto: formatBRL(item.custo_posto || 0),
      custo_servico: formatBRL(item.custo_servico || 0),
      custo_total: formatBRL(item.custo_total || 0),
      foto_projeto_caminho: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

export default CadastroProjeto;