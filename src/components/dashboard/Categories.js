import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Space, Table, Tag, Divider} from 'antd';
import Swal from 'sweetalert2'
import {
    DeleteFilled,
    EditFilled,
    PlusOutlined
} from '@ant-design/icons';
const axios = require('axios').default;


async function getData() {
    let categories = []
    await axios.get('/resource/categories')
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
    await axios.get('/resource/groups')
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
    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Descripcion',
            className: 'description',
            dataIndex: 'description',
            align: 'right',
        },
        {
            title: 'Grupos',
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
                                {tag}
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
                    <a><EditFilled/></a>
                </Space>
            ),
        },
    ];
    async function createCategorie(){
        
        const htmlChecks = await groups.map( (element) => '<tr><th scope="row"><input type="checkbox" name="'+element.id+'" id="'+element.id+'" checked="false" /></th><td>'+element.name+'</td></tr>').join(",");
        const { value: formValues } = await Swal.fire({
            title: 'Crear categoria',
            html:
                '<form id="create">'+
              '<div class="form-group"><label for="exampleInputEmail1">Nombre de la categoria</label><input  class="form-control" type="text" name="t1" id="t1" placeholder="Nombre de la categoria"></div>' +
              '<div class="form-group"><label for="exampleInputEmail1">Descripcion de la categoria</label><input  class="form-control"input type="text" name="t2" id="t2" placeholder="Descripcion de la categoria"></div>'+
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
            console.log(formValues);
            //Valores del form ej: ["asfa", true, false, true, "564"]
            //Por ahora primero ultimo no son checks
          }
    }
    function deleteRecord(id, name){
        Swal.fire({
            title: "¿Quieres eliminar la categoria "+name+"?",
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
                    axios.delete('resource/categories/'+id)
                        .then( function (response) {
                            if(response.data == "ERROR"){
                                Swal.fire({
                                    title:"La categoria no puede ser eliminado!",
                                    text: "Por favor, verifique que la categoria no este en\n"+
                                          "uso en alguna habilidad registrada",
                                    icon: "warning",
                                });
                            }else{
                                Swal.fire({
                                    title:"La categoria fue eliminado!",
                                    icon: "success",
                                });
                            }
                            fillTable()
                            });
                } else {
                    Swal.fire("La categoria no fue eliminada!");
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
                Agregar Nueva Categoria <PlusOutlined/>
            </Button>
            <Divider/>
            <Table
                columns={columns}
                dataSource={data}
                bordered
            />
        </div>

    )
};

export default Categories
