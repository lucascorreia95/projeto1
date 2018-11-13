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
    valorProduto:'',
    quantidadeProduto:'',
    idVenda:'',
    valorVenda:'0',
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
            valorProduto:'',
            quantidadeProduto:'',
            idVenda:'',
            valorVenda:'0',
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

    updatenFieldV(event){
        const valorProduto = event.target.value
        this.setState({ ...this.state, valorProduto })
    }

    updatenFieldQ(event){
        const quantidadeProduto = event.target.value
        this.setState({ ...this.state, quantidadeProduto })
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
        const produtoValor = produto.valor
        this.setState({ 
            produto: produtoName, 
            idProduto: produtoId,
            valorProduto: produtoValor,
            listaProdutos:[] 
        })
    }

    loadVenda(venda) {
        this.carregaVendas()
        this.setState({ 
            cliente: venda.cliente,
            idCliente: venda.idcliente, 
            produtos: venda.produtos,
            idVenda: venda.id,
            valorVenda: venda.valorVenda
        })
    }

    add() {
        if (!this.state.idProduto){
            alert( "Selecione o produto!" );
        }else if (!this.state.quantidadeProduto){
            alert( "Informe a quantidade do produto!" );
        }else if (this.state.quantidadeProduto < 1){
            alert( "A quantidade deve ser maior ou igual a 1 (um)!" );
        }else if (!this.state.valorProduto){
            alert( "Informe o valor do produto!" );
        }else if (this.state.valorProduto < 0){
            alert( "O valor deve ser maior ou igual a 0 (zero)!" );
        }else{
            let produtos = this.state.produtos
            const valor = parseFloat(this.state.valorVenda) + (parseFloat(this.state.valorProduto)* parseFloat(this.state.quantidadeProduto))
            produtos.push({
                name:this.state.produto,
                id: this.state.idProduto,
                valor: this.state.valorProduto,
                quantidade: this.state.quantidadeProduto
            })
            this.setState({
                ...this.state,
                produtos,
                produto:'',
                idProduto:'',
                valorProduto:'',
                quantidadeProduto:'',
                valorVenda: valor.toString()
            })
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
                valorVenda: this.state.valorVenda,
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
        const valorVenda = parseFloat(this.state.valorVenda) - (parseFloat(produto.valor) * parseFloat(produto.quantidade))
        produtos.splice(this.state.produtos.indexOf(produto),1)
        this.setState({ ...this.state, produtos, valorVenda})
    }

    formatMoney(valor){
        let money = parseFloat(valor)
        return(
            money.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})
        )
    }

    renderTableClientes() {
        if(this.state.listaClientes.length){
            return(
                <div className="row">
                    <h4 className="h4 col-8">Escolha um dos Clientes a baixo ...</h4>
                    <table className="table mb-5">
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
                <div className="row mt-4">
                    <h4 className="h4 col-8">Escolha um dos Produtos a baixo ...</h4>
                    <table className="table mt-4">
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
                <div className="row mb-5">
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
                <div className="row">
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
                <div className="row mt-4">
                    <div className="col-8">
                        <label>Quantidade:</label>
                        <input type="number" className="form-control"
                            value={this.state.quantidadeProduto}
                            onChange={e => this.updatenFieldQ(e)}
                            placeholder="Digite a quantidade ... " />
                    </div>
                </div>
                <div className="row mb-5 mt-4">
                    <div className="col-8">
                        <label>Valor:</label>
                        <input type="text" className="form-control"
                            value={this.state.valorProduto}
                            onChange={e => this.updatenFieldV(e)}
                            placeholder="Digite o valor ... " />
                    </div>
                </div>
            </div>
        )
    }

    renderTable() {
        if (this.state.produtos.length){
            return(
                <div className="from">
                    <div className="row">
                        <table className="table mt-4 mb-5">
                            <thead>
                                <tr>
                                    <th>Produtos Adicionados</th>
                                    <th>Quantidade</th>
                                    <th>Valor</th>
                                    <th>Remover</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderRows()}
                            </tbody>
                        </table>
                    </div>
                    <div className="row mb-5">
                        <div className="col-12 d-flex">
                            <div className="col-9">
                                <label>Total</label>
                                
                                <input type="text" className="form-control col-4"
                                    value={this.formatMoney(this.state.valorVenda)}
                                    disabled/>    
                            </div>
                            
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
                    <td>{produto.quantidade}</td>
                    <td>{this.formatMoney(produto.valor)}</td>
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
            <div className="from mt-4">
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