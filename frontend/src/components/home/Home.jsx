import React from 'react'
import Main from '../template/Main'

export default props =>
    <Main icon="home" title="Inicio"
        subtitle="Primeiro Projeto React.">
        <div className="display-4">
            Bem-Vindo!
        </div>
        <hr />
        <p className="mb-0">
            Projeto criado para treinar o desenvolvimento em React!
        </p>
    </Main>