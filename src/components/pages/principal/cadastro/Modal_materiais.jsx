import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

// Configuração necessária para acessibilidade
Modal.setAppElement('#root');

const ModalMateriais = ({ isOpen, onRequestClose, item, onSave, fornecedores = [] }) => {
  // Estado inicial baseado no item (edição) ou vazio (cadastro)
  const [formData, setFormData] = useState({
    id: item?.id || 0,
    imagem_material: item?.imagem_material || null,
    nome_material: item?.nome_material || '',
    geometria: item?.geometria || '',
    fornecedor: item?.fornecedor?.id || '',
    norma_select: item?.norma_select || '',
    tratamento_select: item?.tratamento_select || '',
    densidade: item?.densidade || '',
    comprimento: item?.comprimento || '',
    codigo_material: item?.codigo_material || '',
    peso_unitario: item?.peso_unitario || '',
    custo_unitario: item?.custo_unitario || '',
    custo_proporcional: item?.custo_proporcional || '',
    // Campos específicos por geometria
    diametro: item?.diametro || '',
    espessura: item?.espessura || '',
    largura: item?.largura || '',
    volume: item?.volume || '',
    diametro_externo: item?.diametro_externo || '',
    parede: item?.parede || '',
    espessura_tubo_retangular: item?.espessura_tubo_retangular || '',
    altura_externa: item?.altura_externa || '',
    largura_externa: item?.largura_externa || '',
    largura_interna: item?.largura_interna || '',
    altura_interna: item?.altura_interna || '',
    volume_externo: item?.volume_externo || '',
    volume_interno: item?.volume_interno || '',
    volume_material: item?.volume_material || '',
    espessura_quadrada: item?.espessura_quadrada || '',
    largura_quadrada: item?.largura_quadrada || '',
    volume_chapa_quadrada: item?.volume_chapa_quadrada || '',
    lado_externo: item?.lado_externo || '',
    espessura_tubo_quadrado: item?.espessura_tubo_quadrado || '',
    tubo_quadrado_lado_interno: item?.tubo_quadrado_lado_interno || '',
    tubo_quadrado_volume_externo: item?.tubo_quadrado_volume_externo || '',
    tubo_quadrado_volume_interno: item?.tubo_quadrado_volume_interno || '',
    tubo_quadrado_volume: item?.tubo_quadrado_volume || '',
    chave: item?.chave || '',
    chave_Quantidade: item?.chave_Quantidade || '',
    largura_aba: item?.largura_aba || '',
    cantoneira_espessura: item?.cantoneira_espessura || '',
    largura_aba1: item?.largura_aba1 || '',
    largura_aba2: item?.largura_aba2 || '',
    cantoneira_d_espessura: item?.cantoneira_d_espessura || '',
    largura_perfil: item?.largura_perfil || '',
    Espessura_perfil: item?.Espessura_perfil || '',
  });

  const [imagePreview, setImagePreview] = useState(item?.imagem_material || '/icons/add-image.png');

  // Atualiza o código do material dinamicamente
  useEffect(() => {
    gerarCodigoMaterial();
  }, [formData.nome_material, formData.geometria, formData.norma_select, formData.tratamento_select]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, imagem_material: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const gerarCodigoMaterial = () => {
    const { nome_material, geometria, norma_select, tratamento_select } = formData;
    const codigo = `${nome_material || 'MAT'}-${geometria || 'GEN'}-${norma_select || 'GEN'}-${tratamento_select || 'GEN'}`.toUpperCase();
    setFormData(prev => ({ ...prev, codigo_material: codigo }));
  };

  const calcularMassa = () => {
    const { densidade, comprimento, diametro } = formData;
    if (densidade && comprimento && diametro) {
      const volume = Math.PI * Math.pow(diametro / 2, 2) * comprimento;
      const peso = (volume * densidade) / 1000000; // Convertendo para kg
      setFormData(prev => ({ ...prev, peso_unitario: peso.toFixed(4) }));
    }
    calcularCustoProporcional();
  };

  const calcularCustoProporcional = () => {
    const { peso_unitario, custo_unitario } = formData;
    if (peso_unitario && custo_unitario) {
      const custo = peso_unitario * custo_unitario;
      setFormData(prev => ({ ...prev, custo_proporcional: custo.toFixed(2) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const resetForm = () => {
    setFormData({
      id: 0, imagem_material: null, nome_material: '', geometria: '', fornecedor: '',
      norma_select: '', tratamento_select: '', densidade: '', comprimento: '', codigo_material: '',
      peso_unitario: '', custo_unitario: '', custo_proporcional: '',
      diametro: '', espessura: '', largura: '', volume: '', diametro_externo: '', parede: '',
      espessura_tubo_retangular: '', altura_externa: '', largura_externa: '', largura_interna: '',
      altura_interna: '', volume_externo: '', volume_interno: '', volume_material: '',
      espessura_quadrada: '', largura_quadrada: '', volume_chapa_quadrada: '',
      lado_externo: '', espessura_tubo_quadrado: '', tubo_quadrado_lado_interno: '',
      tubo_quadrado_volume_externo: '', tubo_quadrado_volume_interno: '', tubo_quadrado_volume: '',
      chave: '', chave_Quantidade: '', largura_aba: '', cantoneira_espessura: '',
      largura_aba1: '', largura_aba2: '', cantoneira_d_espessura: '', largura_perfil: '', Espessura_perfil: '',
    });
    setImagePreview('/icons/add-image.png');
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
        <h5 className="modal-title">{item ? 'Editar Material' : 'Cadastrar Material'}</h5>
        <button type="button" className="close" onClick={() => { resetForm(); onRequestClose(); }}>
          <span>×</span>
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group col-md-3 text-center">
              <label htmlFor="imagem_material">Imagem</label>
              <input
                type="file"
                className="d-none"
                id="imagem_material"
                name="imagem_material"
                accept="image/*"
                onChange={handleFileChange}
              />
              <button type="button" className="btn btn-light" onClick={() => document.getElementById('imagem_material').click()}>
                <img src={imagePreview} alt="Preview" style={{ width: '150px', height: '150px' }} />
              </button>
            </div>
            <div className="form-group col-md-9">
              <div className="form-row">
                <div className="form-group col-md-12">
                  <label htmlFor="nome_material">Nome do Material</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nome_material"
                    name="nome_material"
                    value={formData.nome_material}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="geometria">Geometria do Material</label>
                  <select
                    className="form-control"
                    id="geometria"
                    name="geometria"
                    value={formData.geometria}
                    onChange={handleChange}
                  >
                    <option value="">Genérico</option>
                    <option value="barra_redonda">Barra Redonda</option>
                    <option value="chapa_retangular">Chapa Retangular</option>
                    <option value="tubo_redondo">Tubo Redondo</option>
                    <option value="tubo_retangular">Tubo Retangular</option>
                    <option value="chapa_quadrada">Chapa Quadrada</option>
                    <option value="tubo_quadrado">Tubo Quadrado</option>
                    <option value="barra_sextavada">Barra Sextavada</option>
                    <option value="cantoneira">Cantoneira</option>
                    <option value="cantoneira_diferente">Cantoneira Diferente</option>
                    <option value="perfil_u">Perfil U</option>
                  </select>
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="fornecedor">Fornecedor</label>
                  <select
                    className="form-control"
                    id="fornecedor"
                    name="fornecedor"
                    value={formData.fornecedor}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione</option>
                    {fornecedores.map(f => (
                      <option key={f.id} value={f.id}>{f.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="norma_select">Norma</label>
                  <select
                    className="form-control"
                    id="norma_select"
                    name="norma_select"
                    value={formData.norma_select}
                    onChange={handleChange}
                  >
                    <option value="">Genérico</option>
                    <option value="ISO -">ISO</option>
                    <option value="ASTM -">ASTM</option>
                    <option value="SAE -">SAE</option>
                    <option value="AA -">AA</option>
                    <option value="EN_ISO -">EN ISO</option>
                    <option value="NBR -">NBR</option>
                    <option value="ABNT -">ABNT</option>
                    <option value="AISI -">AISI</option>
                  </select>
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="tratamento_select">Tratamento</label>
                  <select
                    className="form-control"
                    id="tratamento_select"
                    name="tratamento_select"
                    value={formData.tratamento_select}
                    onChange={handleChange}
                  >
                    <option value="">Genérico</option>
                    <option value="Cementado">Cementado</option>
                    <option value="Nitretado">Nitretado</option>
                    <option value="Temperado">Temperado</option>
                    <option value="Galvanizado">Galvanizado</option>
                    <option value="T651">T651</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Campos comuns a várias geometrias */}
          {formData.geometria && (
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="densidade">Densidade (kg/m³)</label>
                <input
                  type="text"
                  className="form-control"
                  id="densidade"
                  name="densidade"
                  value={formData.densidade}
                  onChange={e => { handleChange(e); calcularMassa(); }}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="comprimento">Comprimento (mm)</label>
                <input
                  type="text"
                  className="form-control"
                  id="comprimento"
                  name="comprimento"
                  value={formData.comprimento}
                  onChange={e => { handleChange(e); calcularMassa(); }}
                  required
                />
              </div>
            </div>
          )}

          {/* Campos específicos por geometria */}
          {formData.geometria === 'barra_redonda' && (
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="diametro">Diâmetro (mm)</label>
                <input
                  type="text"
                  className="form-control"
                  id="diametro"
                  name="diametro"
                  value={formData.diametro}
                  onChange={e => { handleChange(e); calcularMassa(); }}
                />
              </div>
            </div>
          )}

          {formData.geometria === 'chapa_retangular' && (
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="espessura">Espessura (mm)</label>
                <input
                  type="text"
                  className="form-control"
                  id="espessura"
                  name="espessura"
                  value={formData.espessura}
                  onChange={e => { handleChange(e); calcularMassa(); }}
                />
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="largura">Largura (mm)</label>
                <input
                  type="text"
                  className="form-control"
                  id="largura"
                  name="largura"
                  value={formData.largura}
                  onChange={e => { handleChange(e); calcularMassa(); }}
                />
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="volume">Volume</label>
                <input
                  type="text"
                  className="form-control"
                  id="volume"
                  name="volume"
                  value={formData.volume}
                  onChange={e => { handleChange(e); calcularMassa(); }}
                />
              </div>
            </div>
          )}

          {formData.geometria === 'tubo_redondo' && (
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="diametro_externo">Diâmetro Externo (mm)</label>
                <input
                  type="text"
                  className="form-control"
                  id="diametro_externo"
                  name="diametro_externo"
                  value={formData.diametro_externo}
                  onChange={e => { handleChange(e); calcularMassa(); }}
                />
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="parede">Espessura da Parede (mm)</label>
                <input
                  type="text"
                  className="form-control"
                  id="parede"
                  name="parede"
                  value={formData.parede}
                  onChange={e => { handleChange(e); calcularMassa(); }}
                />
              </div>
            </div>
          )}

          {/* Código do Material */}
          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="codigo_material">Código do Material</label>
              <input
                type="text"
                className="form-control"
                id="codigo_material"
                name="codigo_material"
                value={formData.codigo_material}
                readOnly
              />
            </div>
          </div>

          {/* Custo Proporcional */}
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="peso_unitario">Peso Unitário (kg)</label>
              <input
                type="text"
                className="form-control"
                id="peso_unitario"
                name="peso_unitario"
                value={formData.peso_unitario}
                onChange={e => { handleChange(e); calcularCustoProporcional(); }}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="custo_unitario">Custo Unitário (R$)</label>
              <input
                type="text"
                className="form-control"
                id="custo_unitario"
                name="custo_unitario"
                value={formData.custo_unitario}
                onChange={e => { handleChange(e); calcularCustoProporcional(); }}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="custo_proporcional">Custo Proporcional (R$)</label>
              <input
                type="text"
                className="form-control"
                id="custo_proporcional"
                name="custo_proporcional"
                value={formData.custo_proporcional}
                readOnly
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Salvar</button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalMateriais;