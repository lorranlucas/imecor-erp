import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TabsComponent.css';
import SetorTab from './tabs/SetorTab';
import FuncionarioTab from './tabs/FuncionarioTab';
// Importe outros componentes de abas conforme necessário

const TabsComponent = () => {
  const [activeTab, setActiveTab] = useState('Setor');

  // Função para mudar a aba ativa
  const openTab = (tabName) => {
    setActiveTab(tabName);
    window.location.hash = tabName; // Atualiza o hash da URL
  };

  // Verifica o hash da URL ao carregar
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['Setor', 'CCusto', 'Funcionario', 'CNPJ', 'Fornecedor', 'Clientes', 'Maquinas', 'Materiais', 'Servico', 'Posto', 'Imposto'].includes(hash)) {
      setActiveTab(hash);
    } else {
      setActiveTab('Setor'); // Aba padrão
    }
  }, []);

  return (
    <div>
      {/* Abas */}
      <div className="tabs">
        <button
          className={`tablink ${activeTab === 'Setor' ? 'active' : ''}`}
          onClick={() => openTab('Setor')}
        >
          Setor
        </button>
        <button
          className={`tablink ${activeTab === 'CCusto' ? 'active' : ''}`}
          onClick={() => openTab('CCusto')}
        >
          Centro de Custo
        </button>
        <button
          className={`tablink ${activeTab === 'Funcionario' ? 'active' : ''}`}
          onClick={() => openTab('Funcionario')}
        >
          Funcionário
        </button>
        <button
          className={`tablink ${activeTab === 'CNPJ' ? 'active' : ''}`}
          onClick={() => openTab('CNPJ')}
        >
          CNPJ
        </button>
        <button
          className={`tablink ${activeTab === 'Fornecedor' ? 'active' : ''}`}
          onClick={() => openTab('Fornecedor')}
        >
          Fornecedor
        </button>
        <button
          className={`tablink ${activeTab === 'Clientes' ? 'active' : ''}`}
          onClick={() => openTab('Clientes')}
        >
          Clientes
        </button>
        <button
          className={`tablink ${activeTab === 'Maquinas' ? 'active' : ''}`}
          onClick={() => openTab('Maquinas')}
        >
          Máquinas
        </button>
        <button
          className={`tablink ${activeTab === 'Materiais' ? 'active' : ''}`}
          onClick={() => openTab('Materiais')}
        >
          Materiais
        </button>
        <button
          className={`tablink ${activeTab === 'Servico' ? 'active' : ''}`}
          onClick={() => openTab('Servico')}
        >
          Serviço
        </button>
        <button
          className={`tablink ${activeTab === 'Posto' ? 'active' : ''}`}
          onClick={() => openTab('Posto')}
        >
          Posto
        </button>
        <button
          className={`tablink ${activeTab === 'Imposto' ? 'active' : ''}`}
          onClick={() => openTab('Imposto')}
        >
          Imposto
        </button>
      </div>

      {/* Conteúdo das abas */}
      <div className="tab-content" style={{ display: activeTab === 'Setor' ? 'block' : 'none' }}>
        <SetorTab />
      </div>
      <div className="tab-content" style={{ display: activeTab === 'Funcionario' ? 'block' : 'none' }}>
        <FuncionarioTab />
      </div>
      {/* Adicione mais abas aqui conforme necessário */}
    </div>
  );
};

export default TabsComponent;