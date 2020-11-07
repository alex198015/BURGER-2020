import React, { Component} from 'react'
import { Route, Switch , withRouter, Redirect} from "react-router-dom"
import {connect} from 'react-redux'
import asyncComponent from './hoc/asyncComponent/asyncComponent'
import {withSuspense} from './hoc/withSuspense/withSuspense'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
// import Checkout from './containers/Checkout/Checkout'
// import Orders from './containers/Orders/Orders'
// import Auth from './containers/Auth/Auth'
import Layout from './hoc/Layout/Layout'
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index'



const asyncCheckout = asyncComponent(() => import('./containers/Checkout/Checkout'))
const asyncOrders = React.lazy(() => import('./containers/Orders/Orders'))
const asyncAuth = asyncComponent(() => import('./containers/Auth/Auth'))

class App extends Component {

  componentDidMount(){
    this.props.onTryAutoSignUp()
  }

  render() {

    let routes = (
      <Switch>
          <Route path="/auth" component={asyncAuth}/>
          <Route path="/" exact component={BurgerBuilder}/>
          <Redirect to="/"/>
      </Switch>
    
    )

    if(this.props.isAuthenticated) {

      routes = (
       
        <Switch>
            <Route path="/checkout" component={asyncCheckout}/>
            <Route path="/orders" render={withSuspense(asyncOrders)}/>
            <Route path="/logout" component={Logout}/>
            <Route path="/auth" component={asyncAuth}/>
            <Route path="/" exact component={BurgerBuilder}/>
            <Redirect to="/"/>
        </Switch>
       
        )
    }
    
    return (
      <div>
        <Layout>
         {routes}
        </Layout>
      </div>
    );
    
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignUp: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
