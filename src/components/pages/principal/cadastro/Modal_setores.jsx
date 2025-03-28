import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ModalSetores = ({ isOpen, onRequestClose, item, onSave }) => {
  const [formData, setFormData] = useState({
    id: item?.id || 0,
    setorNome: item?.nome || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      id: formData.id,
      nome: formData.setorNome,
    };
    onSave(dataToSave);
  };

  const resetForm = () => {
    setFormData({ id: 0, setorNome: '' });
  };

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
    },
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={() => { resetForm(); onRequestClose(); }} style={modalStyles}>
      <div className="modal-header">
        <h5 className="modal-title">{item ? 'Editar Setor' : 'Cadastro de Setor'}</h5>
        <button type="button" className="close" onClick={() => { resetForm(); onRequestClose(); }}>
          <span>×</span>
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="setorNome">Nome do Setor:</label>
            <input
              type="text"
              className="form-control"
              id="setorNome"
              name="setorNome"
              value={formData.setorNome}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Salvar</button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalSetores;