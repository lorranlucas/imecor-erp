import React, { useState } from 'react';
import Modal from 'react-modal';

// Configuração necessária para acessibilidade
Modal.setAppElement('#root');

const ModalMaquinas = ({ isOpen, onRequestClose, item, onSave, setores = [] }) => {
  // Estado inicial baseado no item (edição) ou vazio (cadastro)
  const [formData, setFormData] = useState({
    id: item?.id || 0,
    codigoMaquina: item?.codigo_maquina || '',
    numeroSerie: item?.numero_serie || '',
    maquinaModelo: item?.modelo || '',
    fabricante: item?.fabricante || '',
    anoFabricacao: item?.ano_fabricacao || '',
    custoAquisicao: item?.custo_aquisicao || '',
    kWh: item?.kwh || '',
    status: item?.status || 'Ativa',
    setor: item?.setor?.id || '',
    custo_hora: item?.custo_hora || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Para campos monetários/numéricos, permite apenas números, ponto e vírgula
    if (['custoAquisicao', 'kWh', 'custo_hora'].includes(name)) {
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
      codigo_maquina: formData.codigoMaquina,
      numero_serie: formData.numeroSerie,
      modelo: formData.maquinaModelo,
      fabricante: formData.fabricante,
      ano_fabricacao: formData.anoFabricacao,
      custo_aquisicao: parseFloat(formData.custoAquisicao.replace(',', '.')) || 0,
      kwh: parseFloat(formData.kWh.replace(',', '.')) || 0,
      status: formData.status,
      setor: setores.find(s => s.id === parseInt(formData.setor)) || { id: formData.setor, nome: formData.setor || 'Sem setor' },
      custo_hora: parseFloat(formData.custo_hora.replace(',', '.')) || 0,
    };
    onSave(dataToSave);
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      codigoMaquina: '',
      numeroSerie: '',
      maquinaModelo: '',
      fabricante: '',
      anoFabricacao: '',
      custoAquisicao: '',
      kWh: '',
      status: 'Ativa',
      setor: '',
      custo_hora: '',
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
        <h5 className="modal-title">{item ? 'Editar Máquina' : 'Cadastro de Máquina'}</h5>
        <button type="button" className="close" onClick={() => { resetForm(); onRequestClose(); }}>
          <span>×</span>
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="codigoMaquina">Nome da Máquina:</label>
              <input
                type="text"
                className="form-control"
                id="codigoMaquina"
                name="codigoMaquina"
                value={formData.codigoMaquina}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="numeroSerie">Número de Série:</label>
              <input
                type="text"
                className="form-control"
                id="numeroSerie"
                name="numeroSerie"
                value={formData.numeroSerie}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="maquinaModelo">Modelo:</label>
              <input
                type="text"
                className="form-control"
                id="maquinaModelo"
                name="maquinaModelo"
                value={formData.maquinaModelo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="fabricante">Fabricante:</label>
              <input
                type="text"
                className="form-control"
                id="fabricante"
                name="fabricante"
                value={formData.fabricante}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="anoFabricacao">Ano de Fabricação:</label>
              <input
                type="text"
                className="form-control"
                id="anoFabricacao"
                name="anoFabricacao"
                value={formData.anoFabricacao}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="custoAquisicao">Custo de Aquisição:</label>
              <input
                type="text"
                className="form-control money-input"
                id="custoAquisicao"
                name="custoAquisicao"
                value={formData.custoAquisicao}
                onChange={handleChange}
                step="0.0001"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="kWh">kWh:</label>
              <input
                type="text"
                className="form-control money-input"
                id="kWh"
                name="kWh"
                value={formData.kWh}
                onChange={handleChange}
                step="0.0001"
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="status">Status:</label>
              <select
                className="form-control"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Ativa">Ativa</option>
                <option value="Inativa">Inativa</option>
                <option value="Em Manutenção">Em Manutenção</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="setor">Setor:</label>
              <select
                className="form-control"
                id="setor"
                name="setor"
                value={formData.setor}
                onChange={handleChange}
              >
                <option value="">Selecione um setor</option>
                {setores.map(setor => (
                  <option key={setor.id} value={setor.id}>{setor.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="custo_hora">Custo/h:</label>
              <input
                type="text"
                className="form-control money-input"
                id="custo_hora"
                name="custo_hora"
                value={formData.custo_hora}
                onChange={handleChange}
                step="0.0001"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Salvar</button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalMaquinas;