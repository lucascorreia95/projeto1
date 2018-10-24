import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const baseUrl = 'http://localhost:3001/users'

const headerProps ={
    icon: 'file',
    title: 'Relatorio',
    subtitle: 'Relatorio dos clientes cadastrados'
}

const initialState = {
    name:{name:''},
    list: []
}

export default class RelatorioClientes extends Component {
    
    state = { ...initialState}

    componentWillMount() {
        this.buscarTodos()
    }

    buscarTodos(){
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    buscar(){
        axios(`${baseUrl}?name_like=${this.state.name.name}`).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({
            name: initialState.name
        })
        this.buscarTodos()
    }

    updatenField(event){
        const name = { ...this.state.name }
        name[event.target.name] = event.target.value
        this.setState({ name })
    }

    renderForm() {
        return (
            <div className="from">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Busque pelo nome:</label>
                            <input type="text" className="form-control"
                                name="name" value={this.state.name.name}
                                onChange={e => this.updatenField(e)}
                                placeholder="Digite o nome ... " />
                        </div>
                    </div>
                    <div className="col-12 col-md-6 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.buscar(e)}>
                            Buscar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    renderTable() {
        return(
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Celular</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows(){
        return this.state.list.map(cliente => {
            return(
                <tr key={cliente.id}>
                    <td>{cliente.name}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.celular}</td>
                </tr>
            )
        })
    }

    render(){
        return(
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}