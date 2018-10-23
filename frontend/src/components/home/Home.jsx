import React from 'react'
import Main from '../template/Main'

export default props =>
    <Main icon="home" title="Inicio"
        subtitle="Segundo Projeto React.">
        <div className="display-4">
            Bem-Vindo!
        </div>
        <hr />
        <p className="mb-0">
            Sistema para exemplificar a construcao de um cadastro
            desenvolvido em React
        </p>
    </Main>