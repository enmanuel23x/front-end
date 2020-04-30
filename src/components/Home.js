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
                                <div className="row">
                                    <h1 className="welcome-header">Bienvenido a nuestra herramienta de mapeo de conocimientos </h1>
                                    <NavLink exact to="/perfil"><button className="btn btn-dark welcome-header btn-perfil">Ver Perfil</button></NavLink>
                                </div>
                                <div className="row">
                                    <hr/></div>
                                <div className="row">
                                    <h3>Leyenda de conocimientos</h3>
                                    <table className="table table">
                                        <thead>
                                        <tr>
                                            <th scope="col">Nivel</th>
                                            <th scope="col">Descripción</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>Básico</td>
                                            <td>Has completado exitosamente cursos en línea o presenciales sobre la tecnología.</td>
                                        </tr>
                                        <tr>
                                            <td>Medio</td>
                                            <td>Has acumulado al menos seis meses de experiencia total en la tecnología a través de la culminación exitosa de solicitudes.</td>
                                        </tr>
                                        <tr>
                                            <td >Avanzado</td>
                                            <td>Has acumulado más de seis meses de experiencia total en la tecnología a través de la culminación exitosa de solicitudes.</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
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
