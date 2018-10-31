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
    idCliente:'',
    produto: '',
    idProduto:'',
    idVenda:'',
    vendas:[]
}

const baseUrlClientes = 'http://localhost:3001/users'
const baseUrlProdutos = 'http://localhost:3001/product'
const baseUrlVendas = 'http://localhost:3001/vendas'

export default class Venda extends Component {

    state = {...initialState}

    componentWillMount(){
        this.carregaVendas()
    }

    carregaVendas(){
        axios(baseUrlVendas).then(resp => {
            this.setState({ vendas: resp.data })
        })
    }

    limpaTela(){
        this.setState({
            listaClientes: [],
            listaProdutos: [],
            produtos: [],
            cliente: '',
            idCliente:'',
            produto: '',
            idProduto:'',
            idVenda:'',
            vendas:[]
        })
        this.carregaVendas()
    }

    updatenField(event){
        const cliente = event.target.value
        this.setState({ ...this.state, cliente })
    }

    updatenFieldP(event){
        const produto = event.target.value
        this.setState({ ...this.state, produto })
    }

    buscar(){
        axios(`${baseUrlClientes}?name_like=${this.state.cliente}`).then(resp => {
            this.setState({ ...this.state, listaClientes: resp.data, idCliente:'' })
        })
    }

    buscarP(){
        axios(`${baseUrlProdutos}?name_like=${this.state.produto}`).then(resp => {
            this.setState({ ...this.state, listaProdutos: resp.data })
        })
    }

    load(cliente) {
        const clienteName = cliente.name
        const clienteId = cliente.id
        this.setState({ 
            cliente: clienteName, 
            idCliente: clienteId, 
            listaClientes:[] 
        })
    }

    loadP(produto) {
        const produtoName = produto.name
        const produtoId = produto.id
        this.setState({ 
            produto: produtoName, 
            idProduto: produtoId, 
            listaProdutos:[] 
        })
    }

    loadVenda(venda) {
        this.carregaVendas()
        this.setState({ 
            cliente: venda.cliente,
            idCliente: venda.idcliente, 
            produtos: venda.produtos,
            idVenda: venda.id
        })
    }

    add() {
        if (!this.state.idProduto){
            alert( "Selecione o produto!" );
        }else{
            let produtos = this.state.produtos
            produtos.push({name:this.state.produto, id: this.state.idProduto})
            this.setState({...this.state, produtos, produto:'', idProduto:''})
        }
    }

    save(){

        if (!this.state.idCliente){
            alert( "Selecione o cliente!" );
        }else if (!this.state.produtos.length){
            alert( "Adicione algum produto!" );
        }else{
            const method = this.state.idVenda ? 'put' : 'post'
            const url = this.state.idVenda ? `${baseUrlVendas}/${this.state.idVenda}` : baseUrlVendas
            const venda = {
                cliente: this.state.cliente,
                idcliente: this.state.idCliente,
                produtos: this.state.produtos
            }
            axios[method](url, venda)
                .then( () => {
                    this.limpaTela()
                })
        }
    }

    delete(venda) {
        axios.delete(`${baseUrlVendas}/${venda.id}`)
        .then( () => {
            this.limpaTela()
        })
    }

    remove(produto){
        const produtos = this.state.produtos
        produtos.splice(this.state.produtos.indexOf(produto),1)
        this.setState({ ...this.state, produtos})
    }

    renderTableClientes() {
        if(this.state.listaClientes.length){
            return(
                <div className="row">
                    <table className="table mt-4 margin-bottom">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>E-mail</th>
                                <th>Escolher</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderRowsClientes()}
                        </tbody>
                    </table>
                </div>
            )
        }
    }

    renderRowsClientes(){
        return this.state.listaClientes.map(cliente => {
            return(
                <tr key={cliente.id}>
                    <td>{cliente.name}</td>
                    <td>{cliente.email}</td>
                    <td>
                        <button className="btn btn-primary"
                            onClick={() => this.load(cliente)}>
                            <i className="fa fa-check"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    renderTableProdutos() {
        if(this.state.listaProdutos.length){
            return(
                <div className="row">
                    <table className="table mt-4 margin-bottom">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Marca</th>
                                <th>Escolher</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderRowsProdutos()}
                        </tbody>
                    </table>
                </div>
            )
        }
    }

    renderRowsProdutos(){
        return this.state.listaProdutos.map(produto => {
            return(
                <tr key={produto.id}>
                    <td>{produto.name}</td>
                    <td>{produto.brand}</td>
                    <td>
                        <button className="btn btn-primary"
                            onClick={() => this.loadP(produto)}>
                            <i className="fa fa-check"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    renderForm() {
        return (
            <div className="from">
                <div className="row margin-bottom">
                    <div className="col-8">
                        <label>Cliente:</label>
                        <input type="text" className="form-control"
                            value={this.state.cliente}
                            onChange={e => this.updatenField(e)}
                            placeholder="Digite o nome ... " />
                    </div>
                    <div className="col-4 align-self-end">
                        <button className="btn btn-primary"
                            onClick={() => this.buscar()}>
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </div>
                {this.renderTableClientes()}
                <div className="row margin-bottom">
                    <div className="col-8">
                        <label>Produto:</label>
                        <input type="text" className="form-control"
                            value={this.state.produto}
                            onChange={e => this.updatenFieldP(e)}
                            placeholder="Digite o produto ... " />
                    </div>
                    <div className="col-4 align-self-end">
                        <button className="btn btn-primary"
                            onClick={e => this.buscarP(e)}>
                            <i className="fa fa-search"></i>
                        </button>
                        <button className="btn btn-success"
                            onClick={e => this.add(e)}>
                            <i className="fa fa-plus"></i>
                        </button>
                    </div>
                </div>
                {this.renderTableProdutos()}
            </div>
        )
    }

    renderTable() {
        if (this.state.produtos.length){
            return(
                <div className="from">
                    <div className="row">
                        <table className="table mt-4 margin-bottom">
                            <thead>
                                <tr>
                                    <th>Produtos Adicionados</th>
                                    <th>Remover</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderRows()}
                            </tbody>
                        </table>
                        <div className="col-12 d-flex justify-content-end">
                            <button className="btn btn-primary"
                                onClick={() => this.save()}>
                                    Salvar
                            </button>
                            <button className="btn btn-secundary"
                                onClick={() => this.limpaTela()}>
                                    Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    renderRows(){
        return this.state.produtos.map(produto => {
            return(
                <tr key={produto.id}>
                    <td>{produto.name}</td>
                    <td>
                        <button className="btn btn-danger"
                            onClick={() => this.remove(produto)}>
                            <i className="fa fa-close"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    renderTableVendas() {
        return(
            <div className="from">
                <div className="row">
                    <div className="col-12">
                        <h4 className="mb-3">Vendas Realizadas</h4>
                        <table className="table mt-4">
                            <thead>
                                <tr>
                                    <th>Venda</th>
                                    <th>Cliente</th>
                                    <th>Acoes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderRowsVendas()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }

    renderRowsVendas(){
        return this.state.vendas.map(venda => {
            return(
                <tr key={venda.id}>
                    <td>{venda.id}</td>
                    <td>{venda.cliente}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.loadVenda(venda)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.delete(venda)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return(
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
                {this.renderTableVendas()}
            </Main>
        )
    }
}