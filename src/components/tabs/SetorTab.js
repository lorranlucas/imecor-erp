import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const SetorTab = () => {
  const [setores, setSetores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: 0, nome: '' });

  // Carregar setores do backend
  useEffect(() => {
    axios.get('http://localhost:8000/api/setores/') // Ajuste a URL da API
      .then(response => setSetores(response.data))
      .catch(error => console.error('Erro ao buscar setores:', error));
  }, []);

  // Abrir modal para cadastrar/editar
  const handleShowModal = (setor = { id: 0, nome: '' }) => {
    setFormData(setor);
    setShowModal(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setFormData({ id: 0, nome: '' });
    setShowModal(false);
  };

  // Salvar setor
  const handleSave = () => {
    if (formData.id === 0) {
      axios.post('http://localhost:8000/api/setores/', { nome: formData.nome })
        .then(response => {
          setSetores([...setores, response.data]);
          handleCloseModal();
        });
    } else {
      axios.put(`http://localhost:8000/api/setores/${formData.id}/`, formData)
        .then(response => {
          setSetores(setores.map(s => (s.id === formData.id ? response.data : s)));
          handleCloseModal();
        });
    }
  };

  // Excluir setor
  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/setores/${id}/`)
      .then(() => setSetores(setores.filter(s => s.id !== id)));
  };

  return (
    <div>
      <h2>Cadastro de Setor</h2>
      <div className="horizontal">
        <Button variant="secondary" onClick={() => alert('Exportar Setores')}>Exportar Setores</Button>
        <Button variant="secondary" className="ml-2">
          <i className="bi bi-file-earmark-arrow-up"></i> Importar
        </Button>
        <Button variant="primary" className="ml-2" onClick={() => handleShowModal()}>
          Cadastrar Setor
        </Button>
      </div>

      <table className="table mt-4">
        <thead>
          <tr>
            <th>Nome do Setor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {setores.length > 0 ? (
            setores.map(setor => (
              <tr key={setor.id}>
                <td>{setor.nome}</td>
                <td>
                  <Button variant="warning" size="sm" className="mr-2" onClick={() => handleShowModal(setor)}>
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(setor.id)}>
                    Excluir
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">Nenhum setor cadastrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal de Cadastro */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de Setor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Nome do Setor:</label>
            <input
              type="text"
              className="form-control"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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

export default SetorTab;