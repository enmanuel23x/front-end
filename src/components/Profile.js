/* eslint eqeqeq: 0 */
/* eslint-disable import/first */
import React, {Component} from "react";
import Navigation from "./external/Navigation";
import Pagination from "./external/pagination";
import Footer from "./external/Footer";
import Swal from 'sweetalert2'
import timeZoneConverter from 'time-zone-converter';
import config from "../config/config";
import https from 'https';
const axios = require('axios').default;
axios.defaults.baseURL = config.backURL;
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  });
const skillsPerPage = 1;
import keycloak from "../config/keycloak"
/* Write here the email address that will receive the messages  */
const email = config.email;


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
        email: keycloak.idTokenParsed.email,
        name: keycloak.idTokenParsed.name,
        id: null,
        full_name: null,
        group_name: null,
        sede: null,
        cargo: null,
        userSkill: null,
        skills: null,
        defined: null,
        group: null,
        cat: null,
        currentPage: 1,
        upperPageBound: 3,
        lowerPageBound: 0,
        pageBound: 3,
        message: "",
        first_conn: "",
        last_conn: "",
        last_conn_updated: "",
        err:0

    };
    this.charge = this.charge.bind(this);
    this.loadSkills = this.loadSkills.bind(this);
    this.btnNextClick = this.btnNextClick.bind(this);
    this.btnPrevClick = this.btnPrevClick.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.onChangeMessage = this.onChangeMessage.bind(this);
    this.conn_err = this.conn_err.bind(this);
    this.deleteUserSkill = this.deleteUserSkill.bind(this);
    this.updateSkills = this.updateSkills.bind(this);
    this.addUserSkill = this.addUserSkill.bind(this);
    this.charge();
    }
    addUserSkill(index,lvl, cat){
        console.log(index,lvl, cat)
        const skills= this.state.skills.filter(item => item.title == cat);
        const name = skills[0].skills[index];
        const id = skills[0].ids[index];
        const indexInUser = this.state.userSkill.ids.map( (element,i)=> element == id ? i : null).filter((el)=>el!=null)
        let result = this.state.userSkill;
        console.log("indexUser:"+indexInUser.length!=0)
        if(indexInUser.length!=0){
            result.lvls[indexInUser[0]] = lvl
        }else{
            result.lvls.push(lvl);
            result.ids.push(id);
            result.names.push(name)
        }
        this.setState({userSkill: result})
    }
    loadSkills(group){
        let obj=this;
        axiosInstance.get('/resource/skills/'+group).then(function (skills) {
          let custom =[], i = 0, prevCat = ""
          skills.data.forEach(element => {
              if(element.category_name == prevCat){
                  custom[i].skills.push(element.name)
                  custom[i].ids.push(element.id)
              }else{
                  if(prevCat!= ""){i++;}
                  prevCat = element.category_name;
                  custom.push({title: prevCat, skills:[element.name], ids:[element.id]})
              }
          });
          if(obj.state.userSkill.length!=0){
            obj.setState({skills:custom, defined:true})
          }else{
            obj.setState({skills:custom, defined:false})
          }
        }).catch(function (error) {
          obj.conn_err();
          console.error(error)
      });
      }
    charge(){//en progreso
      let days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
      let obj=this;
      let email=keycloak.idTokenParsed.email;
      axiosInstance.get('/resource/users/'+email).then(function (res) {
        if(res.data.length==0){
            obj.setState(
                {email:email,
                    id: null,
                    userSkill: null,
                    skills:null,
                    defined:false
                });
        }else{
            obj.setState(
                {email:email,
                    id: res.data[0].id,
                    userSkill: JSON.parse(res.data[0].skills),
                    full_name:  res.data[0].full_name,
                    group: res.data[0].group_id,
                    group_name: res.data[0].group_name,
                    sede: res.data[0].sede,
                    cargo: res.data[0].cargo
                });
          obj.loadSkills(res.data[0].group_id)
        }
      }).catch(function (error) {
        obj.conn_err();
          console.error(error)
      });

      function getDate(){
          let create = false;
          axiosInstance.post('bd/data', {email: keycloak.idTokenParsed.email})
              .then((res) => {
                if(res.data.length == 0){
                    create = true;
                }else{
                    let first_day = new Date(res.data[0].first_conn);
                    let first_dayName = days[first_day.getDay()];
                    let last_day = new Date(res.data[0].last_conn);
                    let last_dayName = days[last_day.getDay()];

                    const first_connection = first_dayName +", " + timeZoneConverter(res.data[0].first_conn, 0, -4, 'YYYY/MM/DD HH:mm');
                    let last_connection = last_dayName +", " + timeZoneConverter(res.data[0].last_conn, 0, -4, 'YYYY/MM/DD HH:mm');

                    obj.state.first_conn = first_connection;
                    obj.state.last_conn = last_connection;
                    }
                  axiosInstance.post('bd/update', {email: keycloak.idTokenParsed.email, create: create}).then(response => {
                    if(create){
                        getDate()
                    }else{
                        obj.state.last_conn_updated = timeZoneConverter(response.data, 0, -4, 'YYYY/MM/DD HH:mm:ss');
                    }
                  })
              })
      }
      getDate()
    }
    btnPrevClick() {
        if((this.state.currentPage -1)%this.state.pageBound === 0 ){
            this.setState({upperPageBound: this.state.upperPageBound - this.state.pageBound});
            this.setState({lowerPageBound: this.state.lowerPageBound - this.state.pageBound});
        }
        let listid = this.state.currentPage - 1;
        this.setState({ currentPage : listid});
    }
    btnNextClick() {
        if((this.state.currentPage +1) > this.state.upperPageBound ){
            this.setState({upperPageBound: this.state.upperPageBound + this.state.pageBound});
            this.setState({lowerPageBound: this.state.lowerPageBound + this.state.pageBound});
        }
        let listid = this.state.currentPage + 1;
        this.setState({ currentPage : listid});
    }
    conn_err(){
        if(this.state.err >= 2){
            this.setState({err:this.state.err+1})
            this.charge();
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error al cargar el servicio!',
                html: 'Por favor revise su conexión y reintente.<br>Si el problema persiste contacte con soporte.',
                confirmButton:true
            })
        }
        
    }
    submitForm(e, status){
        let lack_skill = "Mapeo Conocimientos: Notificación de falta de habilidad";
        let unregistered = "Mapeo Conocimientos: Notificación para creación de usuario";
        e.preventDefault();
        let obj = this;
        if (status === 1){
            axiosInstance.post('/email/send', {"email": email, "subject": lack_skill,
                // eslint-disable-next-line no-useless-concat
                "text":"Colaborador: "+ keycloak.idTokenParsed.name +'\n' + "Correo: " + keycloak.idTokenParsed.email + '\n' + "Mensaje: " + obj.state.message}).then((res) =>{
                Swal.fire({
                    icon: 'success',
                    title: 'Mensaje enviado!',
                    html: 'Pronto actualizaremos la lista',
                    timer: 2000,
                    timerProgressBar: true,
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        obj.setState({
                            message: ""
                        });
                    }
                });

            }).catch((err) => {
                obj.conn_err();
                console.log(err)
            })
        } else if (status === 0) {
            axiosInstance.post('/email/send', {"email": email, "subject": unregistered,
                // eslint-disable-next-line no-useless-concat
                "text":"Colaborador: "+ keycloak.idTokenParsed.name +'\n' + "Correo: " + keycloak.idTokenParsed.email + '\n' + "Mensaje: " + obj.state.message}).then((res) =>{
                Swal.fire({
                    icon: 'success',
                    title: 'Mensaje enviado!',
                    html: 'Pronto te añadiremos a la lista...',
                    timer: 2000,
                    timerProgressBar: true,
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        obj.setState({
                            message: ""
                        });
                    }
                });
            }).catch((err) => {
                obj.conn_err();
                console.log(err)
            })
        }

    }
    onChangeMessage(event){
        this.setState({
            message: event.target.value
        })
    }
    deleteUserSkill(id){
        const index = this.state.userSkill.ids.map( (item, i) => item == id ? i : null ).filter( (item) => item != null)[0];
        const result = {ids: this.state.userSkill.ids.filter( (item, i) => i != index), lvls: this.state.userSkill.lvls.filter( (item, i) => i != index), names: this.state.userSkill.names.filter( (item, i) => i != index)}
        this.setState({userSkill: result})
    }
    updateSkills(){
        const obj =this;
        axiosInstance.post('/resource/users',{
            id: obj.state.id, 
            email: obj.state.email, 
            full_name: obj.state.full_name, 
            group_id: obj.state.group, 
            skills: JSON.stringify(obj.state.userSkill),
            sede: obj.state.sede,
            cargo: obj.state.cargo
        })
        .then(function (res) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Datos guardados!',
                showConfirmButton: false,
                timer: 1500
            })
        }).catch(function (error) {
            obj.conn_err();
            console.error(error)
        });
    }
  render() {
    const indexOfLastskill = this.state.currentPage * skillsPerPage;
    const indexOfFirstskill = indexOfLastskill - skillsPerPage;
    let currentskills,renderskills = null;
    if(this.state.defined === true){
        currentskills = this.state.skills.slice(indexOfFirstskill, indexOfLastskill);
        renderskills= currentskills.map((item,index) => {
            return <Pagination key={index+indexOfFirstskill} skills={item} obj={this} label={item.title}/>;
          });
    }
    return (
      <div className="App">
        <div className="home">
          <Navigation/>
          <div className="content">
          <h1 className="title">EVOLUCIONA JUNTO A LA TECNOLOGÍA</h1>
          <div className="box">
            <h2>Registro de Conocimientos</h2>
            {this.state.defined === false &&
            <div>
                <div className="row">
                    <div className="col">
                        <div className="container">
                            <form onSubmit={(e) => {
                                this.submitForm(e, 0)
                            }}>
                                <h4 className="mt-5 mb-3">Parece que no estas registrado.</h4>
                                <div className="form-group">
                                    <label htmlFor="message">Mensaje</label>
                                    <textarea className="form-control" id="message" rows="3"
                                              placeholder="Comunícate con nosotros...!" value={this.state.message}
                                              onChange={this.onChangeMessage} required={true}/>
                                </div>
                                <button type="submit" className="btn btn-primary">Enviar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            }
            {this.state.defined === true &&
             <div>
                 <h5 className="custom-h5"><b>Gerencia:</b> {this.state.group_name}</h5>
                 <br></br>
                 <div className="row">
                     <div className="col pt-4">
                         <h5 className="custom-h5">Conocimientos Disponibles
                             <div className="tooltip-message">
                                 <i className="fa fa-info-circle h5"></i>
                                 <span className="message">
                                     <ul>
                                         <li><strong>Básico:</strong> Has completado exitosamente cursos en línea o presenciales sobre la tecnología.</li>
                                         <li><strong>Medio:</strong> Has acumulado al menos seis meses de experiencia total en la tecnología a través de la culminación exitosa de solicitudes.</li>
                                         <li><strong>Avanzado:</strong> Has acumulado más de seis meses de experiencia total en la tecnología a través de la culminación exitosa de solicitudes.</li>
                                     </ul>
                                 </span>
                             </div>
                         </h5>
                         {renderskills}
                         <div>
                             {this.state.currentPage == 1 && <button disabled className="btn btn-secondary">Atrás</button>}
                             {this.state.currentPage > 1 && <button onClick={this.btnPrevClick} className="btn btn-secondary">Atrás</button>}
                             {this.state.skills.length/skillsPerPage > this.state.currentPage && <button onClick={this.btnNextClick} className="btn btn-info ml-3">Siguiente</button>}
                             {!(this.state.skills.length/skillsPerPage > this.state.currentPage) && <button className="btn btn-info ml-3" disabled>Siguiente</button>}
                         </div>
                         <hr/>
                         {/*Actividad de usuario*/}
                         <div className="card mt-3 mb-3">
                             <div className="card-header">
                                 <strong>Actividad de acceso</strong>
                             </div>
                             <ul className="list-group list-group-flush">
                                 <li className="list-group-item">
                                     <strong>Primer Acceso al sitio:</strong> <small>{this.state.first_conn}</small>
                                 </li>
                                 <li className="list-group-item">
                                     <strong>Último Acceso al sitio:</strong> <small>{this.state.last_conn}</small>
                                 </li>

                             </ul>
                         </div>
                     </div>
                     <div className="hr-vertical"></div>
                     <div className="col pt-4">
                         <h5>Mis Conocimientos</h5>
                         <div className="container paginationCont">
                             <h4> </h4>
                             <table className="table table-striped">
                                 <thead>
                                 <tr>
                                     <th scope="col">#</th>
                                     <th scope="col">Conocimiento</th>
                                     <th scope="col">Nivel</th>
                                     <th scope="col">Acción</th>
                                 </tr>
                                 </thead>
                                 <tbody>
                                 {React.Children.toArray(this.state.userSkill.names.map((item, i) =>
                                     <tr>
                                         <th scope="row">{i+1}</th>
                                         <th scope="row">{item}</th>
                                         <th scope="row">{this.state.userSkill.lvls[i]}</th>
                                         <th scope="row">
                                             <button className="btn btn-danger" value={item.id} onClick={() => this.deleteUserSkill(this.state.userSkill.ids[i])}>Eliminar</button>
                                         </th>
                                     </tr>
                                 ))}
                                 </tbody>
                             </table>
                             {this.state.userSkill.names.length == 0 &&
                                 <h5>No posee habilidades registradas actualmente</h5>}
                         </div>
                         <button onClick={this.updateSkills} className="btn btn-info mb-2">Guardar</button>
                         {/*Ausencia de conocimiento*/}
                         <hr/>
                         <div className="row">
                             <div className="col">
                                 <div className="container">
                                     <form onSubmit={(e) => {
                                         this.submitForm(e, 1)
                                     }}>
                                         <h4 className="mb-3">¿Posees un conocimiento y no lo ves en la lista?</h4>
                                         <div className="form-group">
                                             <label htmlFor="message">Mensaje</label>
                                             <textarea className="form-control" id="message" rows="3"
                                                       placeholder="¡Indícanos cuál...!" value={this.state.message}
                                                       onChange={this.onChangeMessage} required={true}/>
                                         </div>
                                         <button type="submit" className="btn btn-info">Enviar</button>
                                     </form>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
                 <hr/>
             </div>
             }
            {this.state.defined === null &&
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
            }
{/*<FloatButtom/>*/}
          </div>
          </div>
          <Footer/>
        </div>
      </div>
    );
  }
}
export default Profile;
