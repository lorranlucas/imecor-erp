import React, { useState } from 'react';
import Modal from 'react-modal';
import './ModalPostos.css'; // Crie este arquivo para estilos personalizados, se necessário

// Configuração necessária para acessibilidade
Modal.setAppElement('#root');

const ModalPostos = ({ isOpen, onRequestClose, item, onSave, maquinas = [], setores = [], funcionarios = [] }) => {
  // Estado inicial baseado no item (edição) ou vazio (cadastro)
  const [formData, setFormData] = useState({
    id: item?.id || 0,
    nomePosto: item?.nome_posto || '',
    Postomaquina: item?.maquina?.id || '',
    Postosetor: item?.setor?.id || '',
    Postofuncionario: item?.funcionario?.id || '',
    Postocusto_h: item?.custo_h || '',
    Postoturno: item?.turno || '1', // Default para "Primeiro Turno"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Para o campo de custo, permite apenas números, ponto e vírgula
    if (name === 'Postocusto_h') {
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
      nome_posto: formData.nomePosto,
      maquina: maquinas.find(m => m.id === parseInt(formData.Postomaquina)) || { id: formData.Postomaquina, codigo_maquina: formData.Postomaquina || 'Sem máquina' },
      setor: setores.find(s => s.id === parseInt(formData.Postosetor)) || { id: formData.Postosetor, nome: formData.Postosetor || 'Sem setor' },
      funcionario: funcionarios.find(f => f.id === parseInt(formData.Postofuncionario)) || { id: formData.Postofuncionario, nome: formData.Postofuncionario || 'Sem funcionário' },
      custo_h: parseFloat(formData.Postocusto_h.replace(',', '.')) || 0,
      turno: parseInt(formData.Postoturno),
    };
    onSave(dataToSave);
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      nomePosto: '',
      Postomaquina: '',
      Postosetor: '',
      Postofuncionario: '',
      Postocusto_h: '',
      Postoturno: '1',
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
      width: '500px',
      maxHeight: '80vh',
      overflowY: 'auto',
    },
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={() => { resetForm(); onRequestClose(); }} style={modalStyles}>
      <div className="modal-header">
        <h5 className="modal-title">{item ? 'Editar Posto de Trabalho' : 'Cadastro de Posto de Trabalho'}</h5>
        <button type="button" className="close" onClick={() => { resetForm(); onRequestClose(); }}>
          <span>×</span>
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="nomePosto">Nome do Posto:</label>
              <input
                type="text"
                className="form-control"
                id="nomePosto"
                name="nomePosto"
                value={formData.nomePosto}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="Postomaquina">Máquina:</label>
              <select
                className="form-control"
                id="Postomaquina"
                name="Postomaquina"
                value={formData.Postomaquina}
                onChange={handleChange}
              >
                <option value="">Selecione uma máquina</option>
                {maquinas.map(maquina => (
                  <option key={maquina.id} value={maquina.id}>{maquina.codigo_maquina}</option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="Postosetor">Setor:</label>
              <select
                className="form-control"
                id="Postosetor"
                name="Postosetor"
                value={formData.Postosetor}
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
              <label htmlFor="Postofuncionario">Funcionário:</label>
              <select
                className="form-control"
                id="Postofuncionario"
                name="Postofuncionario"
                value={formData.Postofuncionario}
                onChange={handleChange}
              >
                <option value="">Selecione um funcionário</option>
                {funcionarios.map(funcionario => (
                  <option key={funcionario.id} value={funcionario.id}>{funcionario.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="Postocusto_h">Custo por Hora (R$):</label>
              <input
                type="text"
                className="form-control"
                id="Postocusto_h"
                name="Postocusto_h"
                value={formData.Postocusto_h}
                onChange={handleChange}
                step="0.0001"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="Postoturno">Turno:</label>
              <select
                className="form-control"
                id="Postoturno"
                name="Postoturno"
                value={formData.Postoturno}
                onChange={handleChange}
              >
                <option value="1">Primeiro Turno</option>
                <option value="2">Segundo Turno</option>
                <option value="3">Terceiro Turno</option>
                <option value="4">Turno Comercial</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Salvar</button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalPostos;