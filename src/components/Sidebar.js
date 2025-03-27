import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Certifique-se de que os estilos estão acessíveis

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo-details">
        <div className="logo_name">IMECOR</div>
        <i className="bx bx-menu" id="btn"></i>
      </div>

      <ul className="nav-list sidebar-links">
        <p>
          <span>Home</span>
          <div className="menu-separator"></div>
        </p>
        <li>
          <Link to="/">
            <i className="bx bx-grid-alt"></i>
            <span className="links_name">Pagina inicial</span>
          </Link>
        </li>
        <li>
          <Link to="/gerenciamento-usuarios">
            <i className="bx bx-user"></i>
            <span className="links_name">Usuario</span>
          </Link>
        </li>
        <li>
          <Link to="/gerenciamento-grupos">
            <i className="bx bx-group"></i>
            <span className="links_name">Grupos</span>
          </Link>
        </li>
        <li>
          <Link to="/cadastro">
            <i className="bx bxs-barcode"></i>
            <span className="links_name">Cadastro</span>
          </Link>
        </li>

        <p>
          <span>Comercial</span>
          <div className="menu-separator"></div>
        </p>
        <li>
          <Link to="/orcamento">
            <i className="bx bxs-report"></i>
            <span className="links_name">Orçamento</span>
          </Link>
        </li>
        <li>
          <Link to="/comercial">
            <i className="bx bx-chat"></i>
            <span className="links_name">Comercial</span>
          </Link>
        </li>

        <p>
          <span>Produção</span>
          <div className="menu-separator"></div>
        </p>
        <li>
          <Link to="/producao-home">
            <i className="bx bxs-notepad"></i>
            <span className="links_name">Ordem de S.</span>
          </Link>
        </li>
        <li>
          <Link to="/projeto-list">
            <i className="bx bxs-time-five"></i>
            <span className="links_name">Apontamento</span>
          </Link>
        </li>

        <p>
          <span>Qualidade</span>
          <div className="menu-separator"></div>
        </p>
        <li>
          <Link to="/cadastrar-nc">
            <i className="bx bx-line-chart-down"></i>
            <span className="links_name">N Conformidade</span>
          </Link>
        </li>

        <p>
          <span>Logística</span>
          <div className="menu-separator"></div>
        </p>
        <li>
          <Link to="/logistica">
            <i className="bx bxs-package"></i>
            <span className="links_name">Logística</span>
          </Link>
        </li>
        <li>
          <Link to="/requisicao">
            <i className="bx bxs-purchase-tag-alt"></i>
            <span className="links_name">Requisição</span>
          </Link>
        </li>

        <p>
          <span>Configuração</span>
          <div className="menu-separator"></div>
        </p>
        <li>
          <Link to="/perfil">
            <i className="bx bx-cog"></i>
            <span className="links_name">Configuração</span>
          </Link>
        </li>

        <div className="spacer"></div>
        <li>
          <Link to="/logout">
            <i className="bx bx-log-out"></i>
            <span className="links_name">Sair</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;