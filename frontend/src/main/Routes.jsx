import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Home from '../components/home/Home'
import UserCrud from '../components/user/UserCrud'
import ProductCrud from '../components/product/ProductCrud'
import RelatorioClientes from '../components/relatorio/RelatorioClientes'
import Vendas from '../components/movimentacao/Venda'

export default props =>
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/users' component={UserCrud} />
        <Route path='/product' component={ProductCrud} />
        <Route path='/relclientes' component={RelatorioClientes} />
        <Route path='/vendas' component={Vendas} />
        <Redirect from='*' to='/' />
    </Switch>