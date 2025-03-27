import React, { useState } from 'react';
import Modal from 'react-modal';
import './ModalFuncionarios.css'; // Crie este arquivo para estilos personalizados, se necessário

// Configuração necessária para acessibilidade
Modal.setAppElement('#root');

const ModalFuncionarios = ({ isOpen, onRequestClose, item, onSave, setores = [], centrosCusto = [] }) => {
  // Estado inicial baseado no item (edição) ou vazio (cadastro)
  const [formData, setFormData] = useState({
    id: item?.id || 0,
    funcionarioMatricula: item?.matricula || '',
    funcionarioNome: item?.nome || '',
    funcionarioCargo: item?.cargo || '',
    FuncionarioSetor: item?.setor?.id || '',
    FuncionarioCentro: item?.centro?.id || '',
    FuncionariocargaHoraria: item?.carga_horaria || '',
    Funcionariosalario: item?.salario || '',
    FuncionarioCustoH: item?.custo_hora || '',
    FuncionariodataAdmissao: item?.data_admissao || '',
    Funcionariostatus: item?.status || 'Presente',
    Funcionarioemail: item?.email || '',
    FuncionarionivelPermissao: item?.nivel_permissao || 'Operador',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Para campos numéricos/monetários, permite apenas números, ponto e vírgula
    if (['Funcionariosalario', 'FuncionarioCustoH', 'FuncionariocargaHoraria'].includes(name)) {
      const numericValue = value.replace(/[^0-9.,]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mapeia os dados para o formato esperado pelo Tabs
    const dataToSave = {
      id: formData.id,
      matricula: formData.funcionarioMatricula,
      nome: formData.funcionarioNome,
      cargo: formData.funcionarioCargo,
      setor: setores.find(s => s.id === parseInt(formData.FuncionarioSetor)) || { id: formData.FuncionarioSetor, nome: formData.FuncionarioSetor || 'Sem setor' },
      centro: centrosCusto.find(c => c.id === parseInt(formData.FuncionarioCentro)) || { id: formData.FuncionarioCentro, nome: formData.FuncionarioCentro || 'Sem centro' },
      carga_horaria: parseFloat(formData.FuncionariocargaHoraria.replace(',', '.')) || 0,
      salario: parseFloat(formData.Funcionariosalario.replace(',', '.')) || 0,
      custo_hora: parseFloat(formData.FuncionarioCustoH.replace(',', '.')) || 0,
      data_admissao: formData.FuncionariodataAdmissao,
      status: formData.Funcionariostatus,
      email: formData.Funcionarioemail,
      nivel_permissao: formData.FuncionarionivelPermissao,
    };
    onSave(dataToSave);
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      funcionarioMatricula: '',
      funcionarioNome: '',
      funcionarioCargo: '',
      FuncionarioSetor: '',
      FuncionarioCentro: '',
      FuncionariocargaHoraria: '',
      Funcionariosalario: '',
      FuncionarioCustoH: '',
      FuncionariodataAdmissao: '',
      Funcionariostatus: 'Presente',
      Funcionarioemail: '',
      FuncionarionivelPermissao: 'Operador',
    });
  };

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '600px',
      maxHeight: '80vh',
      overflowY: 'auto',
    },
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={() => { resetForm(); onRequestClose(); }} style={modalStyles}>
      <div className="modal-header">
        <h5 className="modal-title">{item ? 'Editar Funcionário' : 'Cadastro de Funcionário'}</h5>
        <button type="button" className="close" onClick={() => { resetForm(); onRequestClose(); }}>
          <span>×</span>
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="funcionarioMatricula">Matrícula:</label>
              <input
                type="text"
                className="form-control"
                id="funcionarioMatricula"
                name="funcionarioMatricula"
                value={formData.funcionarioMatricula}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group col-md-8">
              <label htmlFor="funcionarioNome">Nome do Funcionário:</label>
              <input
                type="text"
                className="form-control"
                id="funcionarioNome"
                name="funcionarioNome"
                value={formData.funcionarioNome}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="funcionarioCargo">Cargo:</label>
              <input
                type="text"
                className="form-control"
                id="funcionarioCargo"
                name="funcionarioCargo"
                value={formData.funcionarioCargo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="FuncionarioSetor">Setor:</label>
              <select
                className="form-control"
                id="FuncionarioSetor"
                name="FuncionarioSetor"
                value={formData.FuncionarioSetor}
                onChange={handleChange}
              >
                <option value="">Selecione um setor</option>
                {setores.map(setor => (
                  <option key={setor.id} value={setor.id}>{setor.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="FuncionarioCentro">Centro C:</label>
              <select
                className="form-control"
                id="FuncionarioCentro"
                name="FuncionarioCentro"
                value={formData.FuncionarioCentro}
                onChange={handleChange}
              >
                <option value="">Selecione um centro</option>
                {centrosCusto.map(centro => (
                  <option key={centro.id} value={centro.id}>{centro.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="FuncionariocargaHoraria">Carga Horária (h/semana):</label>
              <input
                type="text"
                className="form-control"
                id="FuncionariocargaHoraria"
                name="FuncionariocargaHoraria"
                value={formData.FuncionariocargaHoraria}
                onChange={handleChange}
                step="0.0001"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="Funcionariosalario">Salário (R$):</label>
              <input
                type="text"
                className="form-control money-input"
                id="Funcionariosalario"
                name="Funcionariosalario"
                value={formData.Funcionariosalario}
                onChange={handleChange}
                step="0.0001"
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="FuncionarioCustoH">Custo h (R$):</label>
              <input
                type="text"
                className="form-control money-input"
                id="FuncionarioCustoH"
                name="FuncionarioCustoH"
                value={formData.FuncionarioCustoH}
                onChange={handleChange}
                step="0.0001"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="FuncionariodataAdmissao">Data de Admissão:</label>
              <input
                type="date"
                className="form-control"
                id="FuncionariodataAdmissao"
                name="FuncionariodataAdmissao"
                value={formData.FuncionariodataAdmissao}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="Funcionariostatus">Status:</label>
              <select
                className="form-control"
                id="Funcionariostatus"
                name="Funcionariostatus"
                value={formData.Funcionariostatus}
                onChange={handleChange}
              >
                <option value="Presente">Presente</option>
                <option value="Ferias">Férias</option>
                <option value="Afastado">Afastado</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="Funcionarioemail">E-mail:</label>
              <input
                type="email"
                className="form-control"
                id="Funcionarioemail"
                name="Funcionarioemail"
                value={formData.Funcionarioemail}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="FuncionarionivelPermissao">Nível de Permissão:</label>
              <select
                className="form-control"
                id="FuncionarionivelPermissao"
                name="FuncionarionivelPermissao"
                value={formData.FuncionarionivelPermissao}
                onChange={handleChange}
              >
                <option value="Operador">Operador</option>
                <option value="Produção">Produção</option>
                <option value="Comercial">Comercial</option>
                <option value="Gerencia">Gerência</option>
                <option value="Desenvolvedor">Desenvolvedor</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Salvar</button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalFuncionarios;