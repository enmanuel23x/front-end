import React, { Component } from 'react';
/* eslint eqeqeq: 0 */
/* eslint-disable import/first */
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Skills from '../dashboard/Skills';
let parent
const swal = withReactContent(Swal);
class Pagination extends Component {

    constructor(props) {
        super(props);
          this.state={skills:props.skills,titulo: props.label,
            currentPage: 1,
            skillsPerPage: 3,
            upperPageBound: 3,
            lowerPageBound: 0,
            isPrevBtnActive: 'disabled',
            isNextBtnActive: '',
            pageBound: 3,
            lvls: []
          };
          this.handleClick = this.handleClick.bind(this);
          this.btnDecrementClick = this.btnDecrementClick.bind(this);
          this.btnIncrementClick = this.btnIncrementClick.bind(this);
          this.btnNextClick = this.btnNextClick.bind(this);
          this.btnPrevClick = this.btnPrevClick.bind(this);
          this.setPrevAndNextBtnClass = this.setPrevAndNextBtnClass.bind(this);
          this.add=this.add.bind(this);
          this.validate=this.validate.bind(this);
          this.lvl=this.lvl.bind(this);
          parent=props.obj
        }
        lvl(index, e){
          var change = {};
          change[index] = e.target.value;
          this.setState({lvls:change});
        }
        validate(id){
          if(parent.state.userSkill!=undefined){
            const exist= parent.state.userSkill.ids.includes(id)
            return exist;
          }
        }
        add(index,ilvl){
          index = index == -1 ? 0 : index;
          if(this.state.lvls !=null && this.state.lvls[ilvl]!=undefined){
            parent.addUserSkill(index, this.state.lvls[ilvl],this.state.titulo)
          }else{
            swal.fire({
              icon: 'error',
              title: 'Error en el nivel',
              text: 'Debe seleccionar un nivel de conocimiento'
            })
          }
        }
        handleClick(event) {
          let listid = Number(event.target.id);
          this.setState({
            currentPage: listid
          });
          this.setPrevAndNextBtnClass(listid);
        }
        setPrevAndNextBtnClass(listid) {
          let totalPage = Math.ceil(this.state.skills.length / this.state.skillsPerPage);
          this.setState({isNextBtnActive: 'disabled'});
          this.setState({isPrevBtnActive: 'disabled'});
          if(totalPage === listid && totalPage > 1){
              this.setState({isPrevBtnActive: ''});
          }
          else if(listid === 1 && totalPage > 1){
              this.setState({isNextBtnActive: ''});
          }
          else if(totalPage > 1){
              this.setState({isNextBtnActive: ''});
              this.setState({isPrevBtnActive: ''});
          }
      }
        btnIncrementClick() {
            this.setState({upperPageBound: this.state.upperPageBound + this.state.pageBound});
            this.setState({lowerPageBound: this.state.lowerPageBound + this.state.pageBound});
            let listid = this.state.upperPageBound + 1;
            this.setState({ currentPage: listid});
            this.setPrevAndNextBtnClass(listid);
      }
        btnDecrementClick() {
          this.setState({upperPageBound: this.state.upperPageBound - this.state.pageBound});
          this.setState({lowerPageBound: this.state.lowerPageBound - this.state.pageBound});
          let listid = this.state.upperPageBound - this.state.pageBound;
          this.setState({ currentPage: listid});
          this.setPrevAndNextBtnClass(listid);
      }
      btnPrevClick() {
          if((this.state.currentPage -1)%this.state.pageBound === 0 ){
              this.setState({upperPageBound: this.state.upperPageBound - this.state.pageBound});
              this.setState({lowerPageBound: this.state.lowerPageBound - this.state.pageBound});
          }
          let listid = this.state.currentPage - 1;
          this.setState({ currentPage : listid});
          this.setPrevAndNextBtnClass(listid);
      }
      btnNextClick() {
          if((this.state.currentPage +1) > this.state.upperPageBound ){
              this.setState({upperPageBound: this.state.upperPageBound + this.state.pageBound});
              this.setState({lowerPageBound: this.state.lowerPageBound + this.state.pageBound});
          }
          let listid = this.state.currentPage + 1;
          this.setState({ currentPage : listid});
          this.setPrevAndNextBtnClass(listid);
      }
      render() {
        const { skills,titulo, currentPage, skillsPerPage,upperPageBound,lowerPageBound,isPrevBtnActive,isNextBtnActive } = this.state;
        // Logic for displaying current skills
        const indexOfLastskill = currentPage * skillsPerPage;
        const indexOfFirstskill = indexOfLastskill - skillsPerPage;
        const currentskills = skills.skills.slice(indexOfFirstskill, indexOfLastskill);
        const renderskills = currentskills.map((skill, index) => {
          return <tr key={index}>
          <th scope="row">{skill}</th>
          <th scope="row">
            <select className="form-control" onChange={this.lvl.bind(this, index)} defaultValue={'DEFAULT'}>
              <option value='DEFAULT' disabled>-- Seleccione un nivel --</option>
              <option value="Básico">Básico</option>
              <option value="Medio">Medio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
            </th>
          <th scope="row">
          {!(this.validate(skills.ids[index])) && <button className="btn btn-dark" value={index} onClick={() => this.add(index+((currentPage-1)*this.state.skillsPerPage), index)}>Agregar</button>}
          {(this.validate(skills.ids[index])) && <button className="btn btn-info" value={index} onClick={() => this.add(index+((currentPage-1)*this.state.skillsPerPage), index)}>Actualizar</button>}    
          </th>
      </tr>;
        });

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(skills.skills.length / skillsPerPage); i++) {
          pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            if(number === 1 && currentPage === 1){
                return(
                    <li key={number} className='page-number active' id={number}><a href="#/" id={number} onClick={this.handleClick}>{number}</a></li>
                )
            }
            else if(number === currentPage){
              return(
                <li key={number} className='page-number active' id={number}><a href="#/" id={number} onClick={this.handleClick}>{number}</a></li>
            )
          }
            else if((number < upperPageBound + 1) && number > lowerPageBound){
                return(
                    <li key={number} id={number} className='page-number'><a  href="#/" id={number} onClick={this.handleClick}>{number}</a></li>
                )
            }else{
              return (<div></div>)
            }
        });
        let pageIncrementBtn = null;
        if(pageNumbers.length > upperPageBound){
            pageIncrementBtn = <li className=''><a href="#/" onClick={this.btnIncrementClick}> &hellip; </a></li>
        }
        let pageDecrementBtn = null;
        if(lowerPageBound >= 1){
            pageDecrementBtn = <li className=''><a href="#/" onClick={this.btnDecrementClick}> &hellip; </a></li>
        }
        let renderPrevBtn = null;
        if(isPrevBtnActive !== 'disabled'){
            renderPrevBtn = <li className="prev"><a href="#/" id="btnPrev" onClick={this.btnPrevClick}> Anterior </a></li>
        }
        let renderNextBtn = null;
        if(skills.length/3 > currentPage){
          if(isNextBtnActive === 'disabled') {
            renderNextBtn = <li className="next"><span id="btnNext"> Siguiente </span></li>
        }
        else{
            renderNextBtn = <li className="next"><a href="#/" id="btnNext" onClick={this.btnNextClick}> Siguiente</a></li>
        }
        }
        return (
          <div>
            <div className="container paginationCont">
            <h5>{titulo}</h5>
          <table className="table table-striped">
                        <thead>
                        <tr>
                            <th scope="col">Conocimiento</th>
                            <th scope="col">Nivel</th>
                            <th scope="col">Acción</th>
                        </tr>
                        </thead>
                        <tbody >
                        {renderskills}
                        </tbody>
                    </table>
                    <ul className="pag">
              {renderPrevBtn}
              {pageDecrementBtn}
              {renderPageNumbers}
              {pageIncrementBtn}
              {renderNextBtn}
            </ul>
        </div>
            
          </div>
        );
      }
  }
export default Pagination;
