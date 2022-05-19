import { Col, Row } from "reactstrap";
import React, { Component } from 'react';
import CategoryList from "./CategoryList";
import Navi from "./Navi";
import ProductList from "./ProductList";
import { Container} from "reactstrap";
import alertify from "alertifyjs";
import { Route} from "react-router-dom";
import NotFound from "./NotFound";
import CartList from "./CartList";
import { Switch } from "react-router-dom";
import FormDemo1 from "./FormDemo1";
import FormDemo2 from "./FormDemo2";
export default class App extends Component {
  state={currentCategory:"",products:[],cart:[] };
  componentDidMount(){
    this.getProducts();
  }
  changeCategory=category=>{
    this.setState({currentCategory:category.categoryName});
    this.getProducts(category.id);
  };
  getProducts=categoryId=>{
    let url="http://localhost:3000/products";
    if(categoryId){
      url+="?categoryId=" + categoryId;
    }
    fetch(url)
    .then(response=>response.json())
    .then(data=>this.setState({products:data}));
  }
  addToCart=(product)=>{
    let newCart=this.state.cart;
    let addedItem=newCart.find(c=>c.product.id===product.id);
    if(addedItem){
      addedItem.quantity+=1;
    }
    else{
      newCart.push({product:product,quantity:1});
    }
    
    this.setState({cart:newCart});
    alertify.success(product.productName + " Added To Cart!",2)
  }
  removeFromCart=(product)=>{
    let newCart=this.state.cart.filter(c=>c.product.id!==product.id)
    this.setState({cart:newCart})
    alertify.error(product.productName + "Removed From Cart ")
  }   
render(){
    let productInfo = {title:"Product List"}
    let categoryInfo = {title:"Category List"}
  return (
    <div >
      <Container>
        <Navi removeFromCart={this.removeFromCart} cart={this.state.cart}/>  
        <Row>
          <Col xs="3">
           <CategoryList currentCategory={this.state.currentCategory} changeCategory={this.changeCategory} info={categoryInfo}/>
          </Col>
          <Col xs="9">
            <Switch>
       
                <Route 
                exact 
                path="/" 
                render={props=>(
                <ProductList 
                {...props}
                products={this.state.products} 
                addToCart={this.addToCart} 
                currentCategory={this.state.currentCategory} 
                info={productInfo}
                />)
                }/> 
                <Route
                exact 
                path="/cart" 
                render={props=>(
                <CartList
                {...props}
                cart={this.state.cart} 
                removeFromCart={this.removeFromCart} 
                />)
                }/>
              <Route  path="/form1" component={FormDemo1}></Route> 
              <Route path="/form" component={FormDemo2}></Route>
               <Route component={NotFound}/>
               </Switch>

            
          </Col>
        </Row>
      </Container>
      
      
    </div>
  )

  }
}

