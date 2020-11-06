import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from '../../axios-orders'
import Auxilliary from '../../hoc/Auxilliary/Auxilliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index'


class BurgerBuilder extends Component {

    state = {
        // ingredients: null,
        // totalPrice: 4,
        // purchaseable: false,
        purchasing: false,
    }

    updatePurchaseState ( ingredients ) {
        const sum = Object.keys( ingredients )
            .map( igKey => {
                return ingredients[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        return sum > 0;
    }

    // addIngredientHandler = type => {

    //     const oldCount = this.state.ingredients[type]
    //     const updatedCount = oldCount + 1
    //     const updatedIngredients = {
    //         ...this.state.ingredients,
    //     }
    //     updatedIngredients[type] = updatedCount
    //     // const newTotal = Object.keys(updatedIngredients).reduce((total, item) => total + updatedIngredients[item] * INGREDIENT_PRICES[item],4)
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;

    //     this.setState({
    //         ingredients: updatedIngredients,
    //         totalPrice: newPrice
    //     }, () => this.updatePurchaseState())
        
    // }

    // removeIngredientHandler = type => {
    //     const oldCount = this.state.ingredients[type]
    //     const updatedCount = oldCount - 1
    //     const updatedIngredients = {
    //         ...this.state.ingredients,
    //     }
    //     updatedIngredients[type] = updatedCount
    //     // const newTotal = Object.keys(updatedIngredients).reduce((total, item) => total + updatedIngredients[item] * INGREDIENT_PRICES[item],4)
    //     const priceDeduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceDeduction;

    //     this.setState({
    //         ingredients: updatedIngredients,
    //         totalPrice: newPrice
    //     }, () => this.updatePurchaseState())
        
    
    // }

    purchaseHandler = () => {
        if(this.props.isAuthenticated) {
            this.setState({
            purchasing: true
        })
        } else {
            this.props.onSetAuthRedirectPath('/checkout')
            this.props.history.push('/auth')
        }
        
    }

    purchaseCancelHendler = () => {
        this.setState({
            purchasing: false
        })
    }

    purchaseContinueHandler = () => {

        // this.setState({loading: true})
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price: this.state.totalPrice.toFixed(2),
        //     customer: {
        //         name: 'Alex',
        //         adress: {
        //             street: 'Pobedy 55',
        //             zipCode: '123456',
        //             country: 'Ukraine'
        //         },
        //         email: 'kitten344@gmail.com'
        //     },
        //     deliveryMethod: 'fastest'
        // }
        // // alert('You continue!')
        // axios.post('/orders.json', order )
        //     .then(response => {
        //         this.setState({loading: false, purchasing: false})
        //     })
        //     .catch(err => {
        //         this.setState({loading: false})
        //     })
        // const queryParams = []

        // for ( let i in this.state.ingredients) {
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        // }

        // queryParams.push('price=' + this.state.totalPrice.toFixed(2))
        // const queryString = queryParams.join('&')

        // this.props.history.push({
        //     pathname: '/checkout',
        //     search: '?' + queryString
        // })

        this.props.onInitPurchase()
        this.props.history.push('/checkout')


    }

    componentDidMount() {
        // axios.get('/ingredients.json')
        //     .then(res => {
        //         this.setState({ingredients: res.data})
        //     })
        //     .catch(err => {
        //         this.setState({error: true})
        //     })
        
            this.props.onInitIngredients()
        
    }

    render() {
        const disabledInfo = {
            ...this.props.ings
        }

        for ( let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null

        
        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;

        if(this.props.ings){
            burger = (
                <Auxilliary>
                <Burger  ingredients={this.props.ings}/>
                    <BuildControls
                        disabled={disabledInfo} 
                        ingredientRemoved={this.props.onIngredientRemoved}
                        ingredientAdded={this.props.onIngredientAdded}
                        purchaseable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler}
                        isAuth={this.props.isAuthenticated}
                        price={this.props.price}
                        />
                        </Auxilliary>
            )
            orderSummary = <OrderSummary 
                                price={this.props.price}
                                ingredients={this.props.ings}
                                purchaseCancelled={this.purchaseCancelHendler}
                                purchaseContinued={this.purchaseContinueHandler}
                                />
    
        }
        
        return (
            <Auxilliary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHendler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Auxilliary>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burger.ingredients,
        price: state.burger.totalPrice,
        error:state.burger.error,
        isAuthenticated: state.auth.token,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase:() => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRediredctPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));