import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const FuncionarioTab = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: 0, nome: '', cargo: '', data_admissao: '' });

  useEffect(() => {
    axios.get('http://localhost:8000/api/funcionarios/')
      .then(response => setFuncionarios(response.data))
      .catch(error => console.error('Erro ao buscar funcionários:', error));
  }, []);

  const handleShowModal = (funcionario = { id: 0, nome: '', cargo: '', data_admissao: '' }) => {
    setFormData(funcionario);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setFormData({ id: 0, nome: '', cargo: '', data_admissao: '' });
    setShowModal(false);
  };

  const handleSave = () => {
    if (formData.id === 0) {
      axios.post('http://localhost:8000/api/funcionarios/', formData)
        .then(response => {
          setFuncionarios([...funcionarios, response.data]);
          handleCloseModal();
        });
    } else {
      axios.put(`http://localhost:8000/api/funcionarios/${formData.id}/`, formData)
        .then(response => {
          setFuncionarios(funcionarios.map(f => (f.id === formData.id ? response.data : f)));
          handleCloseModal();
        });
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/funcionarios/${id}/`)
      .then(() => setFuncionarios(funcionarios.filter(f => f.id !== id)));
  };

  return (
    <div>
      <h2>Cadastro de Funcionário</h2>
      <div className="horizontal">
        <Button variant="secondary" onClick={() => alert('Exportar Funcionários')}>Exportar Funcionários</Button>
        <Button variant="secondary" className="ml-2">
          <i className="bi bi-file-earmark-arrow-up"></i> Importar
        </Button>
        <Button variant="primary" className="ml-2" onClick={() => handleShowModal()}>
          Cadastrar Funcionário
        </Button>
      </div>

      <table className="table mt-4">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cargo</th>
            <th>Data de Admissão</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.length > 0 ? (
            funcionarios.map(funcionario => (
              <tr key={funcionario.id}>
                <td>{funcionario.nome}</td>
                <td>{funcionario.cargo}</td>
                <td>{funcionario.data_admissao}</td>
                <td>
                  <Button variant="warning" size="sm" className="mr-2" onClick={() => handleShowModal(funcionario)}>
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(funcionario.id)}>
                    Excluir
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nenhum funcionário cadastrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal de Cadastro */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de Funcionário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              className="form-control"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Cargo:</label>
            <input
              type="text"
              className="form-control"
              value={formData.cargo}
              onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Data de Admissão:</label>
            <input
              type="date"
              className="form-control"
              value={formData.data_admissao}
              onChange={(e) => setFormData({ ...formData, data_admissao: e.target.value })}
              required
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Fechar</Button>
          <Button variant="primary" onClick={handleSave}>Salvar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FuncionarioTab;