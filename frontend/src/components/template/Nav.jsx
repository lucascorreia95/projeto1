import './Nav.css'
import React from 'react'
import { Link } from 'react-router-dom'

export default props => 
    <aside className="menu-area">
        <nav className="menu">
            <Link to="/">
                <i className="fa fa-home"> Inicio</i>
            </Link>
            <Link to="/users">
                <i className="fa fa-users"></i> Usuarios
            </Link>
            <Link to="/product">
                <i className="fa fa-cube"></i> Produtos
            </Link>
            <Link to="/relclientes">
                <i className="fa fa-file"></i> Relatorio de clientes
            </Link>
        </nav>
    </aside>