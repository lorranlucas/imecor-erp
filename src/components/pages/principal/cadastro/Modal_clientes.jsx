import React, { useState } from 'react';
import Modal from 'react-modal';
import './ModalCliente.css'; // Crie este arquivo para estilos personalizados, se necessário

// Configuração necessária para acessibilidade
Modal.setAppElement('#root');

const ModalCliente = ({ isOpen, onRequestClose, item, onSave }) => {
  // Estado inicial baseado no item (edição) ou vazio (cadastro)
  const [formData, setFormData] = useState({
    id: item?.id || 0,
    clienteNome: item?.nome || '',
    clienteCodigo: item?.codigo || '',
    clienteNumero: item?.numero || '',
    clienteEmail: item?.email || '',
    clienteCnpj: item?.cnpj || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mapeia os dados para o formato esperado pelo Tabs
    const dataToSave = {
      id: formData.id,
      nome: formData.clienteNome,
      codigo: formData.clienteCodigo,
      numero: formData.clienteNumero,
      email: formData.clienteEmail,
      cnpj: formData.clienteCnpj,
    };
    onSave(dataToSave);
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      clienteNome: '',
      clienteCodigo: '',
      clienteNumero: '',
      clienteEmail: '',
      clienteCnpj: '',
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
        <h5 className="modal-title">{item ? 'Editar Cliente' : 'Cadastro de Cliente'}</h5>
        <button type="button" className="close" onClick={() => { resetForm(); onRequestClose(); }}>
          <span>×</span>
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="clienteNome">Nome:</label>
              <input
                type="text"
                className="form-control"
                id="clienteNome"
                name="clienteNome"
                value={formData.clienteNome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="clienteCodigo">Código do Cliente:</label>
              <input
                type="text"
                className="form-control"
                id="clienteCodigo"
                name="clienteCodigo"
                value={formData.clienteCodigo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="clienteNumero">Número:</label>
              <input
                type="text"
                className="form-control"
                id="clienteNumero"
                name="clienteNumero"
                value={formData.clienteNumero}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="clienteEmail">E-mail:</label>
              <input
                type="email"
                className="form-control"
                id="clienteEmail"
                name="clienteEmail"
                value={formData.clienteEmail}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="clienteCnpj">CNPJ:</label>
              <input
                type="text"
                className="form-control"
                id="clienteCnpj"
                name="clienteCnpj"
                value={formData.clienteCnpj}
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

export default ModalCliente;