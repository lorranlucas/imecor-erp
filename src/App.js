import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TabsComponent from './pages/principal/cadastro/cadastro'; // Importe o componente de abas
import ComercialTela from './pages/principal/comercial/comercial'; // Importe o componente de abas
import OrcamentoTela from './pages/principal/orcamento/TabelaOrcamento'; // Importe o componente de abas

import './App.css';

// Páginas fictícias para simular os blocos
const Dashboard = () => <h2>Página Inicial</h2>;
const GerenciamentoUsuarios = () => <h2>Gerenciamento de Usuários</h2>;
const GerenciamentoGrupos = () => <h2>Gerenciamento de Grupos</h2>;
const Cadastro = () => <TabsComponent />; // A página de cadastro será o TabsComponent
const Orcamento = () => < OrcamentoTela />;
const Comercial = () => < ComercialTela />;
const ProducaoHome = () => <h2>Ordem de Serviço</h2>;
const ProjetoList = () => <h2>Apontamento</h2>;
const CadastrarNC = () => <h2>Não Conformidade</h2>;
const Logistica = () => <h2>Logística</h2>;
const Requisicao = () => <h2>Requisição</h2>;
const Perfil = () => <h2>Configuração</h2>;
const Logout = () => <h2>Saindo...</h2>;

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <section className="home-section">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/gerenciamento-usuarios" element={<GerenciamentoUsuarios />} />
            <Route path="/gerenciamento-grupos" element={<GerenciamentoGrupos />} />
            <Route path="/cadastro" element={<Cadastro />} /> {/* Integra as abas aqui */}
            <Route path="/orcamento" element={<Orcamento />} />
            <Route path="/comercial" element={<Comercial />} />
            <Route path="/producao-home" element={<ProducaoHome />} />
            <Route path="/projeto-list" element={<ProjetoList />} />
            <Route path="/cadastrar-nc" element={<CadastrarNC />} />
            <Route path="/logistica" element={<Logistica />} />
            <Route path="/requisicao" element={<Requisicao />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;