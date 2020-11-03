import React, { Component } from 'react'
import Auxilliary from '../../hoc/Auxilliary/Auxilliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.6
}

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    updatePurchaseState () {
        const ingredients = {
            ...this.state.ingredients
        }

        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce((sum, el) => {
                return sum + el
            }, 0)

            this.setState({
                purchaseable: sum > 0
            })
    }

    addIngredientHandler = type => {

        const oldCount = this.state.ingredients[type]
        const updatedCount = oldCount + 1
        const updatedIngredients = {
            ...this.state.ingredients,
        }
        updatedIngredients[type] = updatedCount
        // const newTotal = Object.keys(updatedIngredients).reduce((total, item) => total + updatedIngredients[item] * INGREDIENT_PRICES[item],4)
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: newPrice
        }, () => this.updatePurchaseState())
        
    }

    removeIngredientHandler = type => {
        const oldCount = this.state.ingredients[type]
        const updatedCount = oldCount - 1
        const updatedIngredients = {
            ...this.state.ingredients,
        }
        updatedIngredients[type] = updatedCount
        // const newTotal = Object.keys(updatedIngredients).reduce((total, item) => total + updatedIngredients[item] * INGREDIENT_PRICES[item],4)
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: newPrice
        }, () => this.updatePurchaseState())
        
    
    }

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        })
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
        const queryParams = []

        for ( let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        }

        queryParams.push('price=' + this.state.totalPrice.toFixed(2))
        const queryString = queryParams.join('&')

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        })

    }

    componentDidMount() {
        axios.get('/ingredients.json')
            .then(res => {
                this.setState({ingredients: res.data})
            })
            .catch(err => {
                this.setState({error: true})
            })
    }

    render() {

        const disabledInfo = {
            ...this.state.ingredients
        }

        for ( let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null

        
        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;

        if(this.state.ingredients){
            burger = (
                <Auxilliary>
                <Burger  ingredients={this.state.ingredients}/>
                    <BuildControls
                        disabled={disabledInfo} 
                        ingredientRemoved={this.removeIngredientHandler}
                        ingredientAdded={this.addIngredientHandler}
                        purchaseable={this.state.purchaseable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice}
                        />
                        </Auxilliary>
            )
            orderSummary = <OrderSummary 
                                price={this.state.totalPrice}
                                ingredients={this.state.ingredients}
                                purchaseCancelled={this.purchaseCancelHendler}
                                purchaseContinued={this.purchaseContinueHandler}
                                />
    
        }

        if(this.state.loading) {
            orderSummary = <Spinner/>
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


export default withErrorHandler(BurgerBuilder, axios);