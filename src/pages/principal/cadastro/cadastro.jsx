import React, { useState } from 'react';
import ModalServico from '../../../components/pages/principal/cadastro/Modal_servicos';
import ModalCentro from '../../../components/pages/principal/cadastro/Modal_centroCusto';
import ModalCliente from '../../../components/pages/principal/cadastro/Modal_clientes';
import ModalCnpjs from '../../../components/pages/principal/cadastro/Modal_cnpjs';
import ModalFornecedres from '../../../components/pages/principal/cadastro/Modal_fornecedores';
import ModalFuncionarios from '../../../components/pages/principal/cadastro/Modal_funcionarios';
import ModalImpostos from '../../../components/pages/principal/cadastro/Modal_impostos';
import ModalMaquina from '../../../components/pages/principal/cadastro/Modal_maquinas';
import ModalMateriais from '../../../components/pages/principal/cadastro/Modal_materiais';
import ModalPostos from '../../../components/pages/principal/cadastro/Modal_postos';
import ModalSetores from '../../../components/pages/principal/cadastro/Modal_setores';
import '../../../style/pages/cadastro/cadastro.css';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('Setor');
  const [modalIsOpen, setModalIsOpen] = useState(null);
  const [editItem, setEditItem] = useState(null);

  // Dados fictícios para exemplo (agora com estado para permitir edição)
  const [setores, setSetores] = useState([{ id: 1, nome: 'Setor A' }]);
  const [centrosCusto, setCentrosCusto] = useState([{ id: 1, nome: 'Centro 1' }]);
  const [funcionarios, setFuncionarios] = useState([{ id: 1, nome: 'João', cargo: 'Analista', data_admissao: '2023-01-01' }]);
  const [cnpjs, setCnpjs] = useState([{ id: 1, nome: 'Empresa A', cnpj: '12.345.678/0001-99', data_cadastro: '2023-01-01' }]);
  const [fornecedores, setFornecedores] = useState([{ id: 1, nome: 'Fornecedor A', endereco: 'Rua X', telefone: '1234-5678', cnpj: '12.345.678/0001-99' }]);
  const [clientes, setClientes] = useState([{ id: 1, nome: 'Cliente A', email: 'cliente@email.com', cnpj: '12.345.678/0001-99' }]);
  const [maquinas, setMaquinas] = useState([{ id: 1, codigo_maquina: 'M001', modelo: 'Modelo X', ano_fabricacao: 2020, custo_hora: 100, kwh: 50 }]);
  const [materiais, setMateriais] = useState([{ id: 1, nome_material: 'Material A', codigo_material: 'MAT001', geometria: 'Cilíndrica' }]);
  const [servicos, setServicos] = useState([{ id: 1, nome: 'Serviço A', descricao: 'Descrição X', preco: 200 }]);
  const [postos, setPostos] = useState([{ id: 1, nome_posto: 'Posto 1', maquina: { codigo_maquina: 'M001' }, setor: { nome: 'Setor A' }, funcionario: { nome: 'João' }, custo_h: 50, turno: 1 }]);
  const [impostos, setImpostos] = useState([{ id: 1, tags: 'ICMS' }]);
  const [fornecedoresLista, setFornecedoresLista] = useState(fornecedores); // ou obtenha via API

  const handleTabClick = (tabName) => setActiveTab(tabName);

  const handleExport = (type) => console.log(`Exportando ${type}`);
  const handleImport = (type) => console.log(`Importando ${type}`);

  const openModal = (tab, item = null) => {
    setEditItem(item);
    setModalIsOpen(tab);
  };

  const closeModal = () => {
    setModalIsOpen(null);
    setEditItem(null);
  };

  const handleSave = (tab, data) => {
    switch (tab) {
      case 'Setor':
        data.id ? setSetores(setores.map(s => s.id === data.id ? data : s)) : setSetores([...setores, { ...data, id: Date.now() }]);
        break;
      case 'CCusto':
        data.id ? setCentrosCusto(centrosCusto.map(c => c.id === data.id ? data : c)) : setCentrosCusto([...centrosCusto, { ...data, id: Date.now() }]);
        break;
      case 'Funcionario':
        data.id ? setFuncionarios(funcionarios.map(f => f.id === data.id ? data : f)) : setFuncionarios([...funcionarios, { ...data, id: Date.now() }]);
        break;
      case 'CNPJ':
        data.id ? setCnpjs(cnpjs.map(c => c.id === data.id ? data : c)) : setCnpjs([...cnpjs, { ...data, id: Date.now() }]);
        break;
      case 'Fornecedor':
        data.id ? setFornecedores(fornecedores.map(f => f.id === data.id ? data : f)) : setFornecedores([...fornecedores, { ...data, id: Date.now() }]);
        break;
      case 'Clientes':
        data.id ? setClientes(clientes.map(c => c.id === data.id ? data : c)) : setClientes([...clientes, { ...data, id: Date.now() }]);
        break;
      case 'Maquinas':
        data.id ? setMaquinas(maquinas.map(m => m.id === data.id ? data : m)) : setMaquinas([...maquinas, { ...data, id: Date.now() }]);
        break;
      case 'Materiais':
        data.id ? setMateriais(materiais.map(m => m.id === data.id ? data : m)) : setMateriais([...materiais, { ...data, id: Date.now() }]);
        break;
      case 'Servico':
        data.id ? setServicos(servicos.map(s => s.id === data.id ? data : s)) : setServicos([...servicos, { ...data, id: Date.now() }]);
        break;
      case 'Posto':
        data.id ? setPostos(postos.map(p => p.id === data.id ? data : p)) : setPostos([...postos, { ...data, id: Date.now() }]);
        break;
      case 'Imposto':
        data.id ? setImpostos(impostos.map(i => i.id === data.id ? data : i)) : setImpostos([...impostos, { ...data, id: Date.now() }]);
        break;
      default:
        break;
    }
    closeModal();
  };

  const handleDelete = (id, type) => {
    switch (type) {
      case 'setor': setSetores(setores.filter(s => s.id !== id)); break;
      case 'custo': setCentrosCusto(centrosCusto.filter(c => c.id !== id)); break;
      case 'funcionario': setFuncionarios(funcionarios.filter(f => f.id !== id)); break;
      case 'cnpj': setCnpjs(cnpjs.filter(c => c.id !== id)); break;
      case 'fornecedor': setFornecedores(fornecedores.filter(f => f.id !== id)); break;
      case 'cliente': setClientes(clientes.filter(c => c.id !== id)); break;
      case 'maquina': setMaquinas(maquinas.filter(m => m.id !== id)); break;
      case 'material': setMateriais(materiais.filter(m => m.id !== id)); break;
      case 'servico': setServicos(servicos.filter(s => s.id !== id)); break;
      case 'posto': setPostos(postos.filter(p => p.id !== id)); break;
      case 'imposto': setImpostos(impostos.filter(i => i.id !== id)); break;
      default: break;
    }
  };

  return (
    <div>
      {/* Abas */}
      <div className="tabs">
        {['Setor', 'CCusto', 'Funcionario', 'CNPJ', 'Fornecedor', 'Clientes', 'Maquinas', 'Materiais', 'Servico', 'Posto', 'Imposto'].map(tab => (
          <button key={tab} className={`tablink ${activeTab === tab ? 'active' : ''}`} onClick={() => handleTabClick(tab)}>
            {tab === 'CCusto' ? 'Centro de Custo' : tab}
          </button>
        ))}
      </div>

      {/* Setor */}
      <div className="tab-content" style={{ display: activeTab === 'Setor' ? 'block' : 'none' }}>
        <h2>Cadastro de Setor</h2>
        <div className="horizontal">
          <button className="btn btn-secondary" onClick={() => handleExport('Setores')}>Exportar Setores</button>
          <button className="btn btn-secondary" onClick={() => handleImport('Setores')}><i className="bi bi-file-earmark-arrow-up"></i> Importar</button>
          <button className="btn btn-primary" onClick={() => openModal('Setor')}>Cadastrar Setor</button>
        </div>
        <ModalSetores isOpen={modalIsOpen === 'Setor'} onRequestClose={closeModal} item={editItem} onSave={(data) => handleSave('Setor', data)} />
        <table className="table mt-4">
          <thead><tr><th>Nome do Setor</th><th></th></tr></thead>
          <tbody>
            {setores.length ? setores.map(s => (
              <tr key={s.id}><td>{s.nome}</td><td>
                <button className="btn btn-warning btn-sm" onClick={() => openModal('Setor', s)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id, 'setor')}>Excluir</button>
              </td></tr>
            )) : <tr><td colSpan="2">Nenhum setor cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Centro de Custo */}
      <div className="tab-content" style={{ display: activeTab === 'CCusto' ? 'block' : 'none' }}>
        <h2>Cadastro de Centro de Custo</h2>
        <div className="horizontal">
          <button className="btn btn-secondary" onClick={() => handleExport('Centros de Custo')}>Exportar Centros de Custo</button>
          <button className="btn btn-secondary" onClick={() => handleImport('Centros de Custo')}><i className="bi bi-file-earmark-arrow-up"></i> Importar</button>
          <button className="btn btn-primary" onClick={() => openModal('CCusto')}>Cadastrar Centro</button>
        </div>
        <ModalCentro isOpen={modalIsOpen === 'CCusto'} onRequestClose={closeModal} item={editItem} onSave={(data) => handleSave('CCusto', data)} />
        <table className="table mt-4">
          <thead><tr><th>Nome do Centro</th><th></th></tr></thead>
          <tbody>
            {centrosCusto.length ? centrosCusto.map(c => (
              <tr key={c.id}><td>{c.nome}</td><td>
                <button className="btn btn-warning btn-sm" onClick={() => openModal('CCusto', c)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id, 'custo')}>Excluir</button>
              </td></tr>
            )) : <tr><td colSpan="2">Nenhum C. Custo cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Funcionário */}
      <div className="tab-content" style={{ display: activeTab === 'Funcionario' ? 'block' : 'none' }}>
        <h2>Cadastro de Funcionário</h2>
        <div className="horizontal">
          <button className="btn btn-secondary" onClick={() => handleExport('Funcionários')}>Exportar Funcionários</button>
          <button className="btn btn-secondary" onClick={() => handleImport('Funcionários')}><i className="bi bi-file-earmark-arrow-up"></i> Importar</button>
          <button className="btn btn-primary" onClick={() => openModal('Funcionario')}>Cadastrar Funcionário</button>
        </div>
        <ModalFuncionarios isOpen={modalIsOpen === 'Funcionario'} onRequestClose={closeModal} item={editItem} onSave={(data) => handleSave('Funcionario', data)} />
        <table className="table mt-4">
          <thead><tr><th>Nome</th><th>Cargo</th><th>Data de Admissão</th><th></th></tr></thead>
          <tbody>
            {funcionarios.length ? funcionarios.map(f => (
              <tr key={f.id}><td>{f.nome}</td><td>{f.cargo}</td><td>{f.data_admissao}</td><td>
                <button className="btn btn-warning btn-sm" onClick={() => openModal('Funcionario', f)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.id, 'funcionario')}>Excluir</button>
              </td></tr>
            )) : <tr><td colSpan="4">Nenhum funcionário cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* CNPJ */}
      <div className="tab-content" style={{ display: activeTab === 'CNPJ' ? 'block' : 'none' }}>
        <h2>Cadastro de CNPJ</h2>
        <div className="horizontal">
          <button className="btn btn-secondary" onClick={() => handleExport('CNPJs')}>Exportar CNPJs</button>
          <button className="btn btn-secondary" onClick={() => handleImport('CNPJs')}><i className="bi bi-file-earmark-arrow-up"></i> Importar</button>
          <button className="btn btn-primary" onClick={() => openModal('CNPJ')}>Cadastrar CNPJ</button>
        </div>
        <ModalCnpjs isOpen={modalIsOpen === 'CNPJ'} onRequestClose={closeModal} item={editItem} onSave={(data) => handleSave('CNPJ', data)} />
        <table className="table mt-4">
          <thead><tr><th></th><th>Nome da Empresa</th><th>CNPJ</th><th>Data de Cadastro</th><th></th></tr></thead>
          <tbody>
            {cnpjs.length ? cnpjs.map(c => (
              <tr key={c.id}><td>{/* Imagem aqui */}</td><td>{c.nome}</td><td>{c.cnpj}</td><td>{c.data_cadastro}</td><td>
                <button className="btn btn-warning btn-sm" onClick={() => openModal('CNPJ', c)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id, 'cnpj')}>Excluir</button>
              </td></tr>
            )) : <tr><td colSpan="5">Nenhuma cnpj cadastrada.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Fornecedor */}
      <div className="tab-content" style={{ display: activeTab === 'Fornecedor' ? 'block' : 'none' }}>
        <h2>Cadastro de Fornecedor</h2>
        <div className="horizontal">
          <button className="btn btn-secondary" onClick={() => handleExport('Fornecedores')}>Exportar Fornecedores</button>
          <button className="btn btn-secondary" onClick={() => handleImport('Fornecedores')}><i className="bi bi-file-earmark-arrow-up"></i> Importar</button>
          <button className="btn btn-primary" onClick={() => openModal('Fornecedor')}>Cadastrar Fornecedor</button>
        </div>
        <ModalFornecedres isOpen={modalIsOpen === 'Fornecedor'} onRequestClose={closeModal} item={editItem} onSave={(data) => handleSave('Fornecedor', data)} />
        <table className="table mt-4">
          <thead><tr><th>Nome do Fornecedor</th><th>Endereço</th><th>Telefone</th><th>CNPJ</th><th></th></tr></thead>
          <tbody>
            {fornecedores.length ? fornecedores.map(f => (
              <tr key={f.id}><td>{f.nome}</td><td>{f.endereco}</td><td>{f.telefone}</td><td>{f.cnpj}</td><td>
                <button className="btn btn-warning btn-sm" onClick={() => openModal('Fornecedor', f)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.id, 'fornecedor')}>Excluir</button>
              </td></tr>
            )) : <tr><td colSpan="5">Nenhum fornecedor cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Clientes */}
      <div className="tab-content" style={{ display: activeTab === 'Clientes' ? 'block' : 'none' }}>
        <h2>Cadastro de Clientes</h2>
        <div className="horizontal">
          <button className="btn btn-secondary" onClick={() => handleExport('Clientes')}>Exportar Clientes</button>
          <button className="btn btn-secondary" onClick={() => handleImport('Clientes')}><i className="bi bi-file-earmark-arrow-up"></i> Importar</button>
          <button className="btn btn-primary" onClick={() => openModal('Clientes')}>Cadastrar Cliente</button>
        </div>
        <ModalCliente isOpen={modalIsOpen === 'Clientes'} onRequestClose={closeModal} item={editItem} onSave={(data) => handleSave('Clientes', data)} />
        <table className="table mt-4">
          <thead><tr><th>Nome</th><th>Email</th><th>CNPJ</th><th></th></tr></thead>
          <tbody>
            {clientes.length ? clientes.map(c => (
              <tr key={c.id}><td>{c.nome}</td><td>{c.email}</td><td>{c.cnpj}</td><td>
                <button className="btn btn-warning btn-sm" onClick={() => openModal('Clientes', c)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id, 'cliente')}>Excluir</button>
              </td></tr>
            )) : <tr><td colSpan="4">Nenhum cliente cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Máquinas */}
      <div className="tab-content" style={{ display: activeTab === 'Maquinas' ? 'block' : 'none' }}>
        <h2>Cadastro de Máquinas</h2>
        <div className="horizontal">
          <button className="btn btn-secondary" onClick={() => handleExport('Máquinas')}>Exportar Máquinas</button>
          <button className="btn btn-secondary" onClick={() => handleImport('Máquinas')}><i className="bi bi-file-earmark-arrow-up"></i> Importar</button>
          <button className="btn btn-primary" onClick={() => openModal('Maquinas')}>Cadastrar Máquina</button>
        </div>
        <ModalMaquina isOpen={modalIsOpen === 'Maquinas'} onRequestClose={closeModal} item={editItem} onSave={(data) => handleSave('Maquinas', data)} />
        <table className="table mt-4">
          <thead><tr><th>Nome da Máquina</th><th>Modelo</th><th>Ano</th><th>Custo/h</th><th>kWh</th><th></th></tr></thead>
          <tbody>
            {maquinas.length ? maquinas.map(m => (
              <tr key={m.id}><td>{m.codigo_maquina}</td><td>{m.modelo}</td><td>{m.ano_fabricacao}</td><td>{m.custo_hora}</td><td>{m.kwh}</td><td>
                <button className="btn btn-warning btn-sm" onClick={() => openModal('Maquinas', m)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id, 'maquina')}>Excluir</button>
              </td></tr>
            )) : <tr><td colSpan="6">Nenhuma máquina cadastrada.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Materiais */}
      <div className="tab-content" style={{ display: activeTab === 'Materiais' ? 'block' : 'none' }}>
        <h2>Cadastro de Materiais</h2>
        <div className="horizontal">
          <button className="btn btn-secondary" onClick={() => handleExport('Materiais')}>Exportar Materiais</button>
          <button className="btn btn-secondary" onClick={() => handleImport('Materiais')}><i className="bi bi-file-earmark-arrow-up"></i> Importar</button>
          <button className="btn btn-primary" onClick={() => openModal('Materiais')}>Cadastrar Material</button>
        </div>
        <ModalMateriais
  isOpen={modalIsOpen === 'Materiais'}
  onRequestClose={closeModal}
  item={editItem}
  onSave={(data) => handleSave('Materiais', data)}
  fornecedores={fornecedoresLista}
/>
        <table className="table mt-4">
          <thead><tr><th>Foto</th><th>Nome do Material</th><th>Código Material</th><th>Geometria</th><th></th></tr></thead>
          <tbody>
            {materiais.length ? materiais.map(m => (
              <tr key={m.id}><td>{/* Imagem aqui */}</td><td>{m.nome_material}</td><td>{m.codigo_material}</td><td>{m.geometria}</td><td>
                <button className="btn btn-warning btn-sm" onClick={() => openModal('Materiais', m)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id, 'material')}>Excluir</button>
              </td></tr>
            )) : <tr><td colSpan="5">Nenhum material cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Serviço */}
      <div className="tab-content" style={{ display: activeTab === 'Servico' ? 'block' : 'none' }}>
        <h2>Cadastro de Serviço</h2>
        <div className="horizontal">
          <button className="btn btn-secondary" onClick={() => handleExport('Serviços')}>Exportar Serviços</button>
          <button className="btn btn-secondary" onClick={() => handleImport('Serviços')}><i className="bi bi-file-earmark-arrow-up"></i> Importar</button>
          <button className="btn btn-primary" onClick={() => openModal('Servico')}>Cadastrar Serviço</button>
        </div>
        <ModalServico isOpen={modalIsOpen === 'Servico'} onRequestClose={closeModal} item={editItem} onSave={(data) => handleSave('Servico', data)} />
        <table className="table mt-4">
          <thead><tr><th>Nome do Serviço</th><th>Descrição</th><th>Preço</th><th></th></tr></thead>
          <tbody>
            {servicos.length ? servicos.map(s => (
              <tr key={s.id}><td>{s.nome}</td><td>{s.descricao}</td><td>{s.preco}</td><td>
                <button className="btn btn-warning btn-sm" onClick={() => openModal('Servico', s)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id, 'servico')}>Excluir</button>
              </td></tr>
            )) : <tr><td colSpan="4">Nenhum serviço cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Posto */}
      <div className="tab-content" style={{ display: activeTab === 'Posto' ? 'block' : 'none' }}>
        <h2>Cadastro de Posto</h2>
        <div className="horizontal">
          <button className="btn btn-secondary" onClick={() => handleExport('Postos de Trabalho')}>Exportar Postos de Trabalho</button>
          <button className="btn btn-secondary" onClick={() => handleImport('Postos')}><i className="bi bi-file-earmark-arrow-up"></i> Importar</button>
          <button className="btn btn-primary" onClick={() => openModal('Posto')}>Cadastrar Posto</button>
        </div>
        <ModalPostos isOpen={modalIsOpen === 'Posto'} onRequestClose={closeModal} item={editItem} onSave={(data) => handleSave('Posto', data)} />
        <table className="table mt-4">
          <thead><tr><th>Nome do Posto</th><th>Máquina</th><th>Setor</th><th>Funcionário</th><th>Custo por Hora</th><th>Turno</th><th></th></tr></thead>
          <tbody>
            {postos.length ? postos.map(p => (
              <tr key={p.id}><td>{p.nome_posto}</td><td>{p.maquina.codigo_maquina}</td><td>{p.setor.nome}</td><td>{p.funcionario.nome}</td><td>{p.custo_h}</td><td>Turno {p.turno}</td><td>
                <button className="btn btn-warning btn-sm" onClick={() => openModal('Posto', p)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, 'posto')}>Excluir</button>
              </td></tr>
            )) : <tr><td colSpan="7">Nenhum Posto cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Imposto */}
      <div className="tab-content" style={{ display: activeTab === 'Imposto' ? 'block' : 'none' }}>
        <h2>Cadastro de Impostos</h2>
        <div className="horizontal">
          <button className="btn btn-secondary" onClick={() => handleExport('Impostos')}>Exportar Impostos</button>
          <button className="btn btn-secondary" onClick={() => handleImport('Impostos')}><i className="bi bi-file-earmark-arrow-up"></i> Importar</button>
          <button className="btn btn-primary" onClick={() => openModal('Imposto')}>Cadastrar Imposto</button>
        </div>
        <ModalImpostos isOpen={modalIsOpen === 'Imposto'} onRequestClose={closeModal} item={editItem} onSave={(data) => handleSave('Imposto', data)} />
        <table className="table mt-4">
          <thead><tr><th>Nome do Imposto</th><th></th></tr></thead>
          <tbody>
            {impostos.length ? impostos.map(i => (
              <tr key={i.id}><td>{i.tags}</td><td>
                <button className="btn btn-warning btn-sm" onClick={() => openModal('Imposto', i)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(i.id, 'imposto')}>Excluir</button>
              </td></tr>
            )) : <tr><td colSpan="2">Nenhum Imposto cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tabs;