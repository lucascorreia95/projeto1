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
    cliente: '',
    produto: ''
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
                    value={produto.name}>{produto.name}</option>
            )
        })
    }

    updateState(e){
        this.setState({...this.state, cliente: e.target.value})
    }

    updateStateP(e){
        this.setState({...this.state, produto: e.target.value})
    }

    addProduto(){
        let produtos = this.state.produtos
        produtos.push({name:this.state.produto})
        this.setState({...this.state, produtos})
        console.log(this.state)
    }

    save(){
        const venda = {
            cliente: this.state.cliente,
            produtos: this.state.produtos
        }
        axios.post(baseUrlVendas, venda)
            // .then(resp => {
            //     // const list = this.getUpdatedList(resp.data)
            //     // this.setState({ user: initialState.user, list})
            // })
        // const method = user.id ? 'put' : 'post'
        // const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        // axios[method](url, user)
        //     .then(resp => {
        //         const list = this.getUpdatedList(resp.data)
        //         this.setState({ user: initialState.user, list})
        //     })
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
                                <option key="0"
                                    value="Selecione">Selecione</option>
                                {this.renderClientes()}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Produto:</label>
                            <select className="form-control" id="9"
                                onChange={e => this.updateStateP(e)}>
                                <option key="0"
                                    value="Selecione">Selecione</option>
                                {this.renderProdutos()}
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={() => this.addProduto()}>
                            <i className="fa fa-plus" /> Produto
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    renderTable() {
        return(
            <div className="row">
                <table className="table mt-4">
                    <thead>
                        <tr>
                            <th>Produtos Adicionados</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </table>
                <div className="col-12 col-md-6 d-flex justify-content-end">
                    <button className="btn btn-primary"
                        onClick={() => this.save()}>
                            Salvar
                    </button>
                </div>
            </div>
        )
    }

    renderRows(){
        return this.state.produtos.map(produto => {
            return(
                <tr key={produto.name}>
                    <td>{produto.name}</td>
                </tr>
            )
        })
    }

    render() {
        return(
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}