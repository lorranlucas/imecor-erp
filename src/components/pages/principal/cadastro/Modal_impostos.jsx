import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ModalImpostos.css'; // Crie este arquivo para estilos personalizados, se necessário

// Configuração necessária para acessibilidade
Modal.setAppElement('#root');

const ModalImpostos = ({ isOpen, onRequestClose, item, onSave }) => {
  // Estado inicial baseado no item (edição) ou vazio (cadastro)
  const [formData, setFormData] = useState({
    id: item?.id || 0,
    tags: item?.tags || '',
    irpjPorcentagem: item?.irpjPorcentagem || '',
    csllPorcentagem: item?.csllPorcentagem || '',
    cofinsPorcentagem: item?.cofinsPorcentagem || '',
    pisPorcentagem: item?.pisPorcentagem || '',
    icmsPorcentagem: item?.icmsPorcentagem || '',
    ipiPorcentagem: item?.ipiPorcentagem || '',
    totalPorcentagem: item?.totalPorcentagem || '',
  });

  // Calcula a porcentagem total sempre que os valores mudam
  useEffect(() => {
    calcularTotalPorcentagem();
  }, [
    formData.irpjPorcentagem,
    formData.csllPorcentagem,
    formData.cofinsPorcentagem,
    formData.pisPorcentagem,
    formData.icmsPorcentagem,
    formData.ipiPorcentagem,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Remove caracteres não numéricos, exceto vírgula e ponto, e limita a entrada
    const numericValue = value.replace(/[^0-9.,]/g, '');
    setFormData(prev => ({ ...prev, [name]: numericValue }));
  };

  const calcularTotalPorcentagem = () => {
    const { irpjPorcentagem, csllPorcentagem, cofinsPorcentagem, pisPorcentagem, icmsPorcentagem, ipiPorcentagem } = formData;
    const valores = [
      parseFloat(irpjPorcentagem.replace(',', '.')) || 0,
      parseFloat(csllPorcentagem.replace(',', '.')) || 0,
      parseFloat(cofinsPorcentagem.replace(',', '.')) || 0,
      parseFloat(pisPorcentagem.replace(',', '.')) || 0,
      parseFloat(icmsPorcentagem.replace(',', '.')) || 0,
      parseFloat(ipiPorcentagem.replace(',', '.')) || 0,
    ];
    const total = valores.reduce((acc, val) => acc + val, 0);
    setFormData(prev => ({ ...prev, totalPorcentagem: total.toFixed(2).replace('.', ',') }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      tags: '',
      irpjPorcentagem: '',
      csllPorcentagem: '',
      cofinsPorcentagem: '',
      pisPorcentagem: '',
      icmsPorcentagem: '',
      ipiPorcentagem: '',
      totalPorcentagem: '',
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
        <h5 className="modal-title">{item ? 'Editar Imposto' : 'Cadastro de Impostos'}</h5>
        <button type="button" className="close" onClick={() => { resetForm(); onRequestClose(); }}>
          <span>×</span>
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="tags" className="form-label">Tags para Impostos</label>
            <input
              type="text"
              className="form-control"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Insira tags para identificar este imposto"
            />
          </div>

          <div className="form-check mb-3">
            <label className="form-check-label" htmlFor="irpjPorcentagem">IRPJ</label>
            <input
              type="text"
              className="form-control money-input"
              id="irpjPorcentagem"
              name="irpjPorcentagem"
              value={formData.irpjPorcentagem}
              onChange={handleChange}
              placeholder="1,30%"
            />
          </div>

          <div className="form-check mb-3">
            <label className="form-check-label" htmlFor="csllPorcentagem">CSLL</label>
            <input
              type="text"
              className="form-control money-input"
              id="csllPorcentagem"
              name="csllPorcentagem"
              value={formData.csllPorcentagem}
              onChange={handleChange}
              placeholder="1,08%"
            />
          </div>

          <div className="form-check mb-3">
            <label className="form-check-label" htmlFor="cofinsPorcentagem">COFINS</label>
            <input
              type="text"
              className="form-control money-input"
              id="cofinsPorcentagem"
              name="cofinsPorcentagem"
              value={formData.cofinsPorcentagem}
              onChange={handleChange}
              placeholder="3,00%"
            />
          </div>

          <div className="form-check mb-3">
            <label className="form-check-label" htmlFor="pisPorcentagem">PIS/PASEP</label>
            <input
              type="text"
              className="form-control money-input"
              id="pisPorcentagem"
              name="pisPorcentagem"
              value={formData.pisPorcentagem}
              onChange={handleChange}
              placeholder="0,65%"
            />
          </div>

          <div className="form-check mb-3">
            <label className="form-check-label" htmlFor="icmsPorcentagem">ICMS</label>
            <input
              type="text"
              className="form-control money-input"
              id="icmsPorcentagem"
              name="icmsPorcentagem"
              value={formData.icmsPorcentagem}
              onChange={handleChange}
              placeholder="12,00%"
            />
          </div>

          <div className="form-check mb-3">
            <label className="form-check-label" htmlFor="ipiPorcentagem">IPI</label>
            <input
              type="text"
              className="form-control money-input"
              id="ipiPorcentagem"
              name="ipiPorcentagem"
              value={formData.ipiPorcentagem}
              onChange={handleChange}
              placeholder="0,00%"
            />
          </div>

          <div className="form-check mb-3">
            <label className="form-check-label" htmlFor="totalPorcentagem">Porcentagem Total de Impostos</label>
            <input
              type="text"
              className="form-control money-input"
              id="totalPorcentagem"
              name="totalPorcentagem"
              value={formData.totalPorcentagem}
              readOnly
              placeholder=""
            />
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-primary">Enviar</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalImpostos;