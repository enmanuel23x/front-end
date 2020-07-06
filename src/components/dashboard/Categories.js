import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Space, Table, Tag, Divider} from 'antd';
import Swal from 'sweetalert2'
import {
    DeleteFilled,
    EditFilled,
    PlusOutlined
} from '@ant-design/icons';
import config from "../../config/config";
import https from 'https';
const axios = require('axios').default;
axios.defaults.baseURL = config.backURL;
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  });


async function getData() {
    let categories = []
    await axiosInstance.get('/resource/categories')
        .then(async function (response) {
            // handle success
            for (let i = 0; i <  response.data.length; i++) {
                await categories.push({
                    name: response.data[i].name,
                    description: response.data[i].description,
                    tags: JSON.parse(response.data[i].group_ids),
                    id: response.data[i].id
                })
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            console.log("Data successfully fetched")
            // always executed
        });
    return categories
}
async function getData2() {
    let groups = []
    await axiosInstance.get('/resource/groups')
        .then(async function (response) {
            groups = await response.data;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            console.log("Data successfully fetched")
            // always executed
        });
    return groups
}

const Categories = () => {

    const [data, setData] = useState([]);
    const [groups, setGroups] = useState([]);
    async function fillTable(){
        const info = await getData()
        setData(info)
        const info2 = await getData2()
        setGroups(info2)
    }
    useEffect(() => {
        fillTable()
    }, [])
    function fillName(id){
        const result= groups.filter( (el) => el.id ==id)[0];
        const name = result == undefined ? "" : result.name;
        return name;
    }
    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Descripción',
            className: 'description',
            dataIndex: 'description'
        },
        {
            title: 'Gerencias',
            key: 'tags',
            dataIndex: 'tags',
            render: tags => (
                <>
                    {tags.map(tag => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {fillName(tag)}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Operación',
            key: 'action',
            width: "5%",
            align: 'center',
            render: (text, record) => (
                <Space size="small">
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={() => deleteRecord(record.id,record.name)}><DeleteFilled/></a>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={() => editRecord(record)}><EditFilled/></a>
                </Space>
            ),
        },
    ];
    async function editRecord(record){
        const id = record.id;
        const checks = await groups.map( (element) => {
            return record.tags.includes(parseInt(element.id))
        });
        const htmlChecks = await groups.map( (element,i) => (checks[i] ?
            '<tr><th scope="row"><input type="checkbox" name="'+element.id+'" id="'+element.id+'" checked/></th><td>'+element.name+'</td></tr>'
            :
            '<tr><th scope="row"><input type="checkbox" name="'+element.id+'" id="'+element.id+'" /></th><td>'+element.name+'</td></tr>')).join(",");
        const { value: formValues } = await Swal.fire({
            title: 'Crear Categoría',
            html:
                '<form id="edit">'+
              '<div class="form-group"><label for="exampleInputEmail1">Nombre de la Categoría</label><input  class="form-control" type="text" name="t1" id="t1" placeholder="Nombre de la Categoría" value="'+record.name+'"></div>' +
              '<div class="form-group"><label for="exampleInputEmail1">Descripción de la Categoría</label><input  class="form-control"input type="text" name="t2" id="t2" placeholder="Descripción de la Categoría" value="'+record.description+'"></div>'+
              '<table class="table"><thead class="thead-dark"><tr><th scope="col">Selección</th><th scope="col">Gerencia</th></tr></thead><tbody>'+
              htmlChecks
              +'</tbody></table></form>',
            focusConfirm: false,
            buttons: true,
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const data = document.getElementById("edit").elements;
                let result = []
                for (let i=0;i<data.length;i++){
                    if(i == 0 || i == 1){
                        result.push(data[i].value)
                    }else{
                        result.push(data[i].checked)
                    }
                }
                return result;
            }
          })

          if (formValues) {
            const name = formValues[0], description = formValues[1];
            const group_ids = JSON.stringify(groups.map( (group,i)=> formValues[2+i] ? group.id : null).filter( (el) => el != null ));
            axiosInstance.post('resource/categories', {id ,name, description, group_ids})
                .then(response => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Categoría editada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    fillTable()
                })
                .catch(error => {
                    console.log(error);
                });
          }
    }
    async function createCategorie(){
        const htmlChecks = await groups.map( (element) => '<tr><th scope="row"><input type="checkbox" name="'+element.id+'" id="'+element.id+'" checked="false" /></th><td>'+element.name+'</td></tr>').join(",");
        const { value: formValues } = await Swal.fire({
            title: 'Crear Categoría',
            html:
                '<form id="create">'+
              '<div class="form-group"><label for="exampleInputEmail1">Nombre de la Categoría</label><input  class="form-control" type="text" name="t1" id="t1" placeholder="Nombre de la Categoría"></div>' +
              '<div class="form-group"><label for="exampleInputEmail1">Descripción de la Categoría</label><input  class="form-control"input type="text" name="t2" id="t2" placeholder="Descripción de la Categoría"></div>'+
              '<table class="table"><thead class="thead-dark"><tr><th scope="col">Selección</th><th scope="col">Gerencia</th></tr></thead><tbody>'+
              htmlChecks
              +'</tbody></table></form>',
            focusConfirm: false,
            buttons: true,
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const data = document.getElementById("create").elements;
                let result = []
                for (let i=0;i<data.length;i++){
                    if(i == 0 || i == 1){
                        result.push(data[i].value)
                    }else{
                        result.push(data[i].checked)
                    }
                }
                return result;
            }
          })

          if (formValues) {
            const name = formValues[0], description = formValues[1];
            const group_ids = JSON.stringify(groups.map( (group,i)=> formValues[2+i] ? group.id : null).filter( (el) => el != null ));
            axiosInstance.put('resource/categories', {name, description, group_ids})
                .then(response => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Nueva Categoría Añadida',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    fillTable()
                })
                .catch(error => {
                    console.log(error);
                });
          }
    }
    function deleteRecord(id, name){
        Swal.fire({
            title: "¿Quieres eliminar la Categoría "+name+"?",
            text: "Una vez eliminado no se podra recuperar",
            icon: "warning",
            buttons: true,
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete.value) {
                    axiosInstance.delete('resource/categories/'+id)
                        .then( function (response) {
                            if(response.data == "ERROR"){
                                Swal.fire({
                                    title:"La Categoría no puede ser eliminado!",
                                    text: "Por favor, verifique que la Categoría no este en\n"+
                                          "uso en algun conocimiento registrado",
                                    icon: "warning",
                                });
                            }else{
                                Swal.fire({
                                    title:"La Categoría fue eliminado!",
                                    icon: "success",
                                });
                            }
                            fillTable()
                            });
                } else {
                    Swal.fire("La Categoría no fue eliminada!");
                }
            });
    }
    return (
        <div>
            <Button
                onClick={createCategorie}
                type="primary"
                style={{ backgroundColor: "#08979c", borderColor: "#08979c" }}
            >
                Agregar categoría <PlusOutlined/>
            </Button>
            <Divider/>
            <Table
                columns={columns}
                dataSource={data}
                pagination={{
                  pageSize: 6
                }}
                bordered
            />
        </div>

    )
};

export default Categories
