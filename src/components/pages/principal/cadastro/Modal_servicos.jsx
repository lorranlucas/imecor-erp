import React, { useState } from 'react';
import Modal from 'react-modal';

// Configuração necessária para acessibilidade
Modal.setAppElement('#root');

const ModalServico = ({ isOpen, onRequestClose, item, onSave }) => {
  // Estado inicial baseado no item (edição) ou vazio (cadastro)
  const [formData, setFormData] = useState({
    id: item?.id || 0,
    servicoNome: item?.nome || '',
    servicoDescricao: item?.descricao || '',
    servicoUnidade: item?.unidade || 'HR', // Default para "Hora"
    servicoPreco: item?.preco || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Para o campo de preço, permite apenas números, ponto e vírgula
    if (name === 'servicoPreco') {
      const numericValue = value.replace(/[^0-9.,]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Converte o preço para número antes de salvar
    const dataToSave = {
      ...formData,
      preco: parseFloat(formData.servicoPreco.replace(',', '.')) || 0,
      nome: formData.servicoNome,
      descricao: formData.servicoDescricao,
      unidade: formData.servicoUnidade,
    };
    onSave(dataToSave);
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      servicoNome: '',
      servicoDescricao: '',
      servicoUnidade: 'HR',
      servicoPreco: '',
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
        <h5 className="modal-title">{item ? 'Editar Serviço' : 'Cadastro de Serviço'}</h5>
        <button type="button" className="close" onClick={() => { resetForm(); onRequestClose(); }}>
          <span>×</span>
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="servicoNome">Nome do Serviço:</label>
            <input
              type="text"
              className="form-control"
              id="servicoNome"
              name="servicoNome"
              value={formData.servicoNome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="servicoDescricao">Descrição:</label>
            <textarea
              className="form-control"
              id="servicoDescricao"
              name="servicoDescricao"
              rows="3"
              value={formData.servicoDescricao}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="servicoUnidade">Unidade de Medida:</label>
            <select
              className="form-control"
              id="servicoUnidade"
              name="servicoUnidade"
              value={formData.servicoUnidade}
              onChange={handleChange}
              required
            >
              <option value="HR">Hora</option>
              <option value="KG">Quilograma</option>
              <option value="UN">Unidade</option>
              <option value="M2">Metro Quadrado</option>
              <option value="M3">Metro Cúbico</option>
              <option value="LT">Litro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="servicoPreco">Preço:</label>
            <input
              type="text"
              className="form-control money-input"
              id="servicoPreco"
              name="servicoPreco"
              value={formData.servicoPreco}
              onChange={handleChange}
              step="0.0001"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Salvar</button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalServico;