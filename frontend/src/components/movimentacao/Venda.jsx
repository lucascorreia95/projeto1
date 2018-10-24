import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps ={
    icon: 'tags',
    title: 'Vendas',
    subtitle: 'Cadastro de vendas: Incluir, Listar, Alterar e Excluir'
}

const initialState = {
    listaClientes: [],
    listaProdutos: [],
    produtos: [],
    cliente: ''
}

const baseUrlClientes = 'http://localhost:3001/users'
const baseUrlProdutos = 'http://localhost:3001/product'
const baseUrlVendas = 'http://localhost:3001/vendas'

export default class Venda extends Component {

    state = { ...initialState}

    componentWillMount(){
        this.carregaEstado()
    }

    carregaEstado(){
        axios(baseUrlClientes).then(resp => {
            this.setState({ listaClientes: resp.data })
        })
        axios(baseUrlProdutos).then(resp => {
            this.setState({ listaProdutos: resp.data })
        })
    }

    renderClientes(){
        return this.state.listaClientes.map(cliente => {
            return(
                <option key={cliente.id}
                    value={cliente.name}>{cliente.name}</option>
            )
        })
    }

    renderProdutos(){
        return this.state.listaProdutos.map(produto => {
            return(
                <option key={produto.id}
                    value={produto.id}>{produto.name}</option>
            )
        })
    }

    updateState(e){
        this.setState({...this.state, cliente: e.target.value})
    }

    addProduto(){
        console.log(this.state)
    }

    renderForm() {
        return (
            <div className="from">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Cliente:</label>
                            <select className="form-control"
                                onChange={e => this.updateState(e)}>
                                {this.renderClientes()}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Produto:</label>
                            <select className="form-control">
                                {this.renderProdutos()}
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={() => this.addProduto()}>
                            <i className="fa fa-plus" /> Adicionar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return(
            <Main {...headerProps}>
                {this.renderForm()}
            </Main>
        ) 
    }
}