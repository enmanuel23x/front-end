/* eslint eqeqeq: 0 */
/* eslint-disable import/first */
import React, {Component} from "react";
import Navigation from "./external/Navigation";
import Pagination from "./external/pagination";
import Footer from "./external/Footer";
import Swal from 'sweetalert2'
import timeZoneConverter from 'time-zone-converter';
import config from '../config/config';
const axios = require('axios').default;
axios.defaults.baseURL = config.backURL;
const skillsPerPage = 1;

/* Write here the email address that will receive the messages  */
const email = config.email;


class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
        email: localStorage.getItem("email"),
        name: localStorage.getItem("name"),
        id: null,
        userSkill: null,
        skills: null,
        defined: null,
        cat: null,
        custom_skills: null,
        currentPage: 1,
        upperPageBound: 3,
        lowerPageBound: 0,
        pageBound: 3,
        message: "",
        first_conn: "",
        last_conn: "",
        last_conn_updated: ""

    };
    this.updateSkills = this.updateSkills.bind(this);
    this.charge = this.charge.bind(this);
    this.loadSkills = this.loadSkills.bind(this);
    this.charge();
    this.btnNextClick = this.btnNextClick.bind(this);
    this.btnPrevClick = this.btnPrevClick.bind(this);
    this.deleteUserSkill = this.deleteUserSkill.bind(this);
    this.addUserSkill = this.addUserSkill.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.onChangeMessage = this.onChangeMessage.bind(this);

    }
    updateSkills(){
        const obj =this;
        const ids = obj.state.userSkill.map(item => parseInt(item.id));
        axios.post('/rg/resources/edit/'+obj.state.id,{skills:ids})
        .then(function (res) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Datos guardados!',
                showConfirmButton: false,
                timer: 1500
            })
        }).catch(function (error) {
            console.error(error)
        });
    }
    charge(){
      let days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
      let obj=this;
      let email=localStorage.getItem("email");
      axios.get('/rg/resources/ids').then(function (res1) {
          axios.post('/rg/resources/emails',{ids:res1.data}).then(function (res2) {
              let index = res2.data.reduce(function(acc, curr, index) { if (curr === email) {acc.push(index);}return acc;}, []);
              const id = res1.data[index];
              if(id === undefined){
                  obj.setState(
                      {email:email,
                          id: null,
                          userSkill: null,
                          skills:null,
                          defined:false
                      });
              }else{
                  obj.loadSkills(id)
              }
          }).catch(function (error) {
              console.error(error)
          });
      }).catch(function (error) {
          console.error(error)
      });

      function getDate(){
          axios.post('bd/data', {email: localStorage.getItem("email")})
              .then((res) => {
                  //console.log(res.data)
                  let first_day = new Date(res.data[0].first_conn);
                  let first_dayName = days[first_day.getDay()];
                  let last_day = new Date(res.data[0].last_conn);
                  let last_dayName = days[last_day.getDay()];

                  const first_connection = first_dayName +", " + timeZoneConverter(res.data[0].first_conn, 0, -4, 'YYYY/MM/DD HH:mm');
                  let last_connection = last_dayName +", " + timeZoneConverter(res.data[0].last_conn, 0, -4, 'YYYY/MM/DD HH:mm');

                  obj.state.first_conn = first_connection;
                  obj.state.last_conn = last_connection;
                  // console.log("previa: ", obj.state.last_conn);
                  axios.post('bd/update', {email: sessionStorage.getItem("email"), create: false}).then(response => {
                      axios.post('bd/data', {email: sessionStorage.getItem("email")}).then(res2 => {
                          obj.state.last_conn_updated = timeZoneConverter(res2.data[0].last_conn, 0, -4, 'YYYY/MM/DD HH:mm:ss');
                          // console.log("actual: ", obj.state.last_conn_updated)
                      })
                  })
              })
      }

      axios.post('bd/data', {email: sessionStorage.getItem("email")})
          .then((res) => {
              if (res.data.length === 0){
                  axios.post('bd/update', {email: sessionStorage.getItem("email"), create: true})
                      .then(res => {
                          //console.log("ok", res)
                      }).then(()=> {
                        getDate()
                  })
              } else {
                  getDate()
              }
          });
    }
    loadSkills(id){
      let obj=this;
      axios.get('/rg/skills').then(function (skills) {
        axios.get('/rg/resource/'+id).then(function (res) {
          if(res.data.selected_custom_field_options.length !== 0){
              obj.setState({email:res.data.email,
                  id: id,
                  userSkill:res.data.selected_custom_field_options,
                  skills: skills.data,
                  defined:null
              })
          }else{
              obj.setState({
                  email:res.data.email,
                  id: id,
                  userSkill: null,
                  skills:skills.data,
                  defined:null
              })
          }

          /* Get available Skills */
          // Categories
          let custom_fields = [];
          let custom_levels = [];
          let fields = [];
          let values = [];
          let categories = [];

          let custom_skills = [];
          let obj2 = obj.state.skills.sort(function(a, b) {
            return a.value - b.value;
          })
          for (let i = 0; i < obj2.length; i++) {
              custom_fields.push(obj2[i].value);
              custom_levels.push(obj2[i].id);
          }
          for (let i = 0; i < custom_fields.length; i++) {
              categories.push(custom_fields[i].split("-")[0])
          }
          

          for (let i = 0; i < custom_fields.length; i++) {
              values.push(custom_fields[i].split("-")[1])
          }
          values = values.filter((v, i, a) => a.indexOf(v) === i);

          let j = 0;
          let prev="",index=0;
          for (let i = 0; i < values.length; i++) {
            if(prev==""){
                fields.push([{"value": values[i], "levels": {"advanced": custom_levels[j], "medium": custom_levels[j+2], "basic": custom_levels[j+1]}}]);
              }else if(prev==categories[i*3]){
                fields[index].push({"value": values[i], "levels": {"advanced": custom_levels[j], "medium": custom_levels[j+2], "basic": custom_levels[j+1]} });
              }else{
                index++;
                fields.push([{"value": values[i], "levels": {"advanced": custom_levels[j], "medium": custom_levels[j+2], "basic": custom_levels[j+1]}}]);
              }
              j += 3;
              prev=categories[i*3];
          }
          categories = categories.filter((v, i, a) => a.indexOf(v) === i);
          for (let i = 0; i < categories.length; i++) {
              custom_skills.push({"title": categories[i], "fields": fields[i]})
          }

          obj.setState({
              defined:true,custom_skills: custom_skills
          });
          //console.log(obj.state)
          // Levels and ids
        }).catch(function (error) {
          console.error(error)
        });
      }).catch(function (error) {
        console.error(error)
    });
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
    deleteUserSkill(e){
        e.preventDefault();
        const id=e.target.value
        this.setState({userSkill:this.state.userSkill.filter( item => item.id != id )})
    }
    addUserSkill(id,title){
        const skills= this.state.custom_skills.filter(item => item.title == title).map(item => item.fields);
        const res = skills[0].filter(item => item.levels.basic == id || item.levels.advanced == id || item.levels.medium == id );
        let l = res[0].levels.medium == id ? "Medio" : "Basico";
            l = res[0].levels.advanced == id ? "Avanzado" : l;
            l = title+"-"+res[0].value+"-"+l
        let us 
        if(res.length!=0){
            this.setState({userSkill:this.state.userSkill.filter( item => item.id != res[0].levels.basic && item.id != res[0].levels.medium && item.id != res[0].levels.advanced)},
            ()=>{
                us= this.state.userSkill
                us.push({id:id,name: "Skills", value: l})
                this.setState({userSkill:us});
            })
        }else{
            us= this.state.userSkill
            us.push({id:id,name: "Skills", value: l})
            this.setState({userSkill:us});
        }
    }
    submitForm(e, status){
        let lack_skill = "Mapeo Conocimiento: Notificacion de falta de habilidad";
        let unregistered = "Usuario no registrado";
        e.preventDefault();
        let obj = this;
        if (status === 1){
            axios.post('/email/send', {"email": email, "subject": lack_skill,
                // eslint-disable-next-line no-useless-concat
                "text":"Colaborador: "+ sessionStorage.getItem("name") +'\n' + "Correo: " + sessionStorage.getItem("email") + '\n' + "Mensaje: " + obj.state.message}).then((res) =>{
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
                console.log(err)
            })
        } else if (status === 0) {
            axios.post('/email/send', {"email": email, "subject": unregistered,
                // eslint-disable-next-line no-useless-concat
                "text":"Colaborador: "+ sessionStorage.getItem("name") +'\n' + "Correo: " + sessionStorage.getItem("email") + '\n' + "Mensaje: " + obj.state.message}).then((res) =>{
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
                console.log(err)
            })
        }

    }
    onChangeMessage(event){
        this.setState({
            message: event.target.value
        })
    }


  render() {
    const indexOfLastskill = this.state.currentPage * skillsPerPage;
    const indexOfFirstskill = indexOfLastskill - skillsPerPage;
    let currentskills,renderskills = null;
    if(this.state.defined === true){
        currentskills = this.state.custom_skills.slice(indexOfFirstskill, indexOfLastskill);
        renderskills= currentskills.map((item,index) => {
            return <Pagination key={index+indexOfFirstskill} skills={item.fields} obj={this} label={item.title}/>;
          });
    }
    return (
      <div className="App">
        <div className="home">
          <Navigation/>
          <div className="content">
          <h1 className="title">EVOLUCIONA JUNTO A LA TECNOLOGIA</h1>
          <div className="box">
            <h1>Mapa de competencias técnicas</h1>
            {this.state.defined === false &&
            <div>
                <div className="row">
                    <div className="col">
                        <div className="container">
                            <form onSubmit={(e) => {
                                this.submitForm(e, 0)
                            }}>
                                <h4 className="mt-5 mb-3">Parece que no estas registrado :(</h4>
                                <h6>Haznoslo saber!</h6>
                                <div className="form-group">
                                    <label htmlFor="message">Mensaje</label>
                                    <textarea className="form-control" id="message" rows="3"
                                              placeholder="Indicanos que falta...!" value={this.state.message}
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
                 <div className="row pt-4">
                     <div className="col">
                         <h5>Habilidades disponibles</h5>
                         {renderskills}
                         <div>
                             {this.state.currentPage == 1 && <button disabled className="btn btn-secondary">Atras</button>}
                             {this.state.currentPage > 1 && <button onClick={this.btnPrevClick} className="btn btn-secondary">Atras</button>}
                             {this.state.custom_skills.length/skillsPerPage > this.state.currentPage && <button onClick={this.btnNextClick} className="btn btn-info ml-3">Siguiente</button>}
                             {!(this.state.custom_skills.length/skillsPerPage > this.state.currentPage) && <button className="btn btn-info ml-3" disabled>Siguiente</button>}
                         </div>
                     </div>
                     <div className="hr-vertical"></div>
                     <div className="col">
                         <h5>Tus habilidades</h5>
                         <div className="container paginationCont">
                             <h4> </h4>
                             <table className="table table-striped">
                                 <thead>
                                 <tr>
                                     <th scope="col">#</th>
                                     <th scope="col">Habilidad</th>
                                     <th scope="col">Nivel</th>
                                     <th scope="col">Opcion</th>
                                 </tr>
                                 </thead>
                                 <tbody>
                                 {React.Children.toArray(this.state.userSkill.filter(item => item.name =="Skills").map((item, i) =>
                                     <tr>
                                         <th scope="row">{i+1}</th>
                                         <th scope="row">{item.value.split("-")[1]}</th>
                                         <th scope="row">{item.value.split("-")[2]}</th>
                                         <th scope="row">
                                             <button className="btn btn-danger" value={item.id} onClick={this.deleteUserSkill}>Eliminar</button>
                                         </th>
                                     </tr>
                                 ))}
                                 </tbody>
                             </table>
                             {this.state.userSkill.filter(item => item.name =="Skills").length == 0 &&
                                 <h5>No posee skills registradas actualmente</h5>}
                         </div>
                         <button onClick={this.updateSkills} className="btn btn-primary">Guardar</button>
                         <hr/>
                         <div className="card mt-3 mb-3">
                             <div className="card-header">
                                 <strong>Actividad de acceso</strong>
                             </div>
                             <ul className="list-group list-group-flush">
                                 <li className="list-group-item">
                                     <strong>Primer Acceso al sitio:</strong> <small>{this.state.first_conn}</small>
                                 </li>
                                 <li className="list-group-item">
                                     <strong>Ultimo Acesso al sitio:</strong> <small>{this.state.last_conn}</small>
                                 </li>

                             </ul>
                         </div>

                     </div>
                 </div>
                 <hr/>
                 <div className="row">
                     <div className="col">
                         <div className="container">
                             <form onSubmit={(e) => {
                                 this.submitForm(e, 1)
                             }}>
                                 <h4 className="mt-5 mb-3">¿No encuentras tu habilidad enlistada?</h4>
                                 <div className="form-group">
                                     <label htmlFor="message">Mensaje</label>
                                     <textarea className="form-control" id="message" rows="3"
                                               placeholder="Indicanos que falta...!" value={this.state.message}
                                     onChange={this.onChangeMessage} required={true}/>
                                 </div>
                                 <button type="submit" className="btn btn-primary">Enviar</button>
                             </form>
                         </div>
                     </div>
                 </div>
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
export default Home;
