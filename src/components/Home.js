import React, { Component } from "react";
import Navigation from "./external/Navigation";
import Footer from "./external/Footer";
//import FloatButtom from "./external/FloatButtom"
import { NavLink } from 'react-router-dom'


class Home extends Component {
  render() {
    return (
        <div className="App">
            <div className="home">
                <Navigation/>
                <div className="content">
                    <h1 className="title">EVOLUCIONA JUNTO A LA TECNOLOGIA</h1>
                    <div className="box">
                        <div className="row">
                            <div className="col">
                                <h1 className="welcome-header">Bienvenido a nuestra nueva app de Mapeo de Conocimientos.</h1>
                                <NavLink exact to="/perfil"><button className="btn btn-dark welcome-header">Ver Perfil</button></NavLink>
                            </div>
                            <div className="col">
                                <div className="home-img-container">
                                    <img src="./img/progress_data.svg"  alt=""/>
                                </div>
                            </div>
                        </div>
                    {/*<FloatButtom/>*/}
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
    );
  }
}
export default Home;
