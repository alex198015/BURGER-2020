import React from 'react'
import classes from './Burger.module.css'
import BurgerIngredient from './Burgeringridients/burgerIngredient'
// import {withRouter} from 'react-router-dom'

const burger = props => {
    let transformIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            return [...new Array(props.ingredients[igKey])]
            .map((_, index) => <BurgerIngredient type={igKey} key={igKey + index}/>)})
            .reduce((arr, el) => {
                return arr.concat(el)
             }, []);


           if(!transformIngredients.length){

            transformIngredients = <p>Please start adding ingredients!</p>

           }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    )
}

export default burger;
// export default withRouter(burger);