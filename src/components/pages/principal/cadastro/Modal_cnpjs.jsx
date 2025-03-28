import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ModalCnpjs = ({ isOpen, onRequestClose, item, onSave }) => {
  const [formData, setFormData] = useState({
    id: item?.id || 0,
    cnpj: item?.cnpj || '',
    nome: item?.nome || '',
    endereco: item?.endereco || '',
    telefone: item?.telefone || '',
    email: item?.email || '',
    logomarca: null, // Para o arquivo de logomarca
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logomarca-cnpj') {
      setFormData(prev => ({ ...prev, logomarca: files[0] || null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      id: formData.id,
      cnpj: formData.cnpj,
      nome: formData.nome,
      endereco: formData.endereco,
      telefone: formData.telefone,
      email: formData.email,
      logomarca: formData.logomarca, // Inclui o arquivo, se houver
    };
    onSave(dataToSave);
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      cnpj: '',
      nome: '',
      endereco: '',
      telefone: '',
      email: '',
      logomarca: null,
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
        <h5 className="modal-title">{item ? 'Editar CNPJ' : 'Cadastro de CNPJ'}</h5>
        <button type="button" className="close" onClick={() => { resetForm(); onRequestClose(); }}>
          <span>×</span>
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="cnpj-id-empresa">CNPJ:</label>
              <input
                type="text"
                className="form-control"
                id="cnpj-id-empresa"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                placeholder="XX.XXX.XXX/XXXX-XX"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="nome-empresa">Nome (opcional):</label>
              <input
                type="text"
                className="form-control"
                id="nome-empresa"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome associado ao CNPJ"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="endereco-cnpj">Endereço:</label>
              <input
                type="text"
                className="form-control"
                id="endereco-cnpj"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                placeholder="Endereço da empresa"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="telefone-cnpj">Telefone:</label>
              <input
                type="text"
                className="form-control"
                id="telefone-cnpj"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(XX) XXXXX-XXXX"
                maxLength="15"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="email-cnpj">Email:</label>
              <input
                type="email"
                className="form-control"
                id="email-cnpj"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email de contato"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="logomarca-cnpj">Logomarca:</label>
              <input
                type="file"
                className="form-control"
                id="logomarca-cnpj"
                name="logomarca-cnpj"
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Salvar</button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalCnpjs;