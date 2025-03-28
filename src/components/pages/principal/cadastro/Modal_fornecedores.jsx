import React, { useState } from 'react';
import Modal from 'react-modal';

// Configuração necessária para acessibilidade
Modal.setAppElement('#root');

const ModalFornecedores = ({ isOpen, onRequestClose, item, onSave }) => {
  // Estado inicial baseado no item (edição) ou vazio (cadastro)
  const [formData, setFormData] = useState({
    id: item?.id || 0,
    nome_fornecedor: item?.nome || '',
    endereco_fornecedor: item?.endereco || '',
    telefone_fornecedor: item?.telefone || '',
    email_fornecedor: item?.email || '',
    cnpj_fornecedor: item?.cnpj || '',
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
      nome: formData.nome_fornecedor,
      endereco: formData.endereco_fornecedor,
      telefone: formData.telefone_fornecedor,
      email: formData.email_fornecedor,
      cnpj: formData.cnpj_fornecedor,
    };
    onSave(dataToSave);
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      nome_fornecedor: '',
      endereco_fornecedor: '',
      telefone_fornecedor: '',
      email_fornecedor: '',
      cnpj_fornecedor: '',
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
        <h5 className="modal-title">{item ? 'Editar Fornecedor' : 'Cadastrar Fornecedor'}</h5>
        <button type="button" className="close" onClick={() => { resetForm(); onRequestClose(); }}>
          <span>×</span>
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="nome_fornecedor">Nome</label>
              <input
                type="text"
                className="form-control"
                id="nome_fornecedor"
                name="nome_fornecedor"
                value={formData.nome_fornecedor}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="endereco_fornecedor">Endereço</label>
              <input
                type="text"
                className="form-control"
                id="endereco_fornecedor"
                name="endereco_fornecedor"
                value={formData.endereco_fornecedor}
                onChange={handleChange}
                aria-describedby="enderecoHelp"
              />
              <small id="enderecoHelp" className="form-text text-muted">Opcional: Endereço do fornecedor.</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="telefone_fornecedor">Telefone</label>
              <input
                type="text"
                className="form-control"
                id="telefone_fornecedor"
                name="telefone_fornecedor"
                value={formData.telefone_fornecedor}
                onChange={handleChange}
                aria-describedby="telefoneHelp"
              />
              <small id="telefoneHelp" className="form-text text-muted">Opcional: Telefone do fornecedor.</small>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="email_fornecedor">E-mail</label>
              <input
                type="email"
                className="form-control"
                id="email_fornecedor"
                name="email_fornecedor"
                value={formData.email_fornecedor}
                onChange={handleChange}
                aria-describedby="emailHelp"
              />
              <small id="emailHelp" className="form-text text-muted">Opcional: E-mail do fornecedor.</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="cnpj_fornecedor">CNPJ</label>
              <input
                type="text"
                className="form-control"
                id="cnpj_fornecedor"
                name="cnpj_fornecedor"
                value={formData.cnpj_fornecedor}
                onChange={handleChange}
                aria-describedby="cnpjHelp"
              />
              <small id="cnpjHelp" className="form-text text-muted">Opcional: CNPJ do fornecedor.</small>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Salvar</button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalFornecedores;