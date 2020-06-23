import React, {useState, useEffect} from 'react';
import 'antd/dist/antd.css';
import {Button, Space, Table} from 'antd';
import Swal from "sweetalert2";
const axios = require('axios').default;

async function getData() {
    let groups = []
    await axios.get('/resource/groups')
        .then(async function (response) {
            // handle success
            for (let i = 0; i <  response.data.length; i++) {
                await groups.push({
                    name: response.data[i].name,
                    description: response.data[i].description,
                    id: response.data[i].id
                })
            }
        })
        .catch(function (error) {
            // handle error
            // console.log(error);
        })
        .then(function () {
            console.log("Data successfully fetched")
            // always executed
        });
    return groups;
}


const Groups = () => {
    const [data, setData] = useState([]);

    async function fillTable(){
        let info = await getData()
        console.log(info)
        setData(info)
    }
    useEffect(() => {

        fillTable()


    }, [])
    const columns = [
        {
            title: 'Gerencia',
            dataIndex: 'name',
            width: "15%"
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            align: 'right',
            width: "65%"
        },
        {
            title: 'Operación',
            key: 'action',
            width: "20%",
            render: (text, record) => (
                <Space size="small">
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={() => deleteRecord(record.id,record.name)}>Eliminar</a>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={() => updateGroup(record.id, record.name, record.description)}>Editar</a>
                </Space>
            ),
        },
    ];
    function deleteRecord(id, name){
        Swal.fire({
            title: "¿Quieres eliminar el grupo "+name+"?",
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
                    axios.delete('resource/groups/'+id)
                        .then( function (response) {
                            if(response.data === "ERROR"){
                                Swal.fire({
                                    title:"El grupo no puede ser eliminado!",
                                    text: "Por favor, verifique que el grupo no este en\n"+
                                          "uso en alguna categoria registrada",
                                    icon: "warning",
                                });
                            }else{
                                Swal.fire({
                                    title:"El grupo fue eliminado!",
                                    icon: "success",
                                });
                            }
                            fillTable()
                            });
                } else {
                    Swal.fire("El grupo no fue eliminado!");
                }
            });
    }
    async function createGroup(){
        Swal.mixin({
            input: 'text',
            confirmButtonText: 'Siguiente &rarr;',
            cancelButtonText: 'Cancelar',

            showCancelButton: true,
            progressSteps: ['1', '2']
        }).queue([
            {
                title: 'Gerencia',
                text: 'Ingrese la gerencia asociada'
            },
            {
                title: 'Descripción',
                text: 'Breve descripción',
            },
        ]).then((result) => {
            if (result.value) {
                const answers = (result.value)
                axios.put('resource/groups', {
                    name: answers[0],
                    description: answers[1]
                })
                    .then(response => {
                        // console.log(response);
                        fillTable()
                    })
                    .catch(error => {
                        console.log(error);
                    });
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Nueva Gerencia Añadida',
                    showConfirmButton: false,
                    timer: 1500
                })

            }
        })
    }

    function updateGroup(id, name, description) {
        Swal.mixin({
            input: 'text',
            confirmButtonText: 'Siguiente &rarr;',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            progressSteps: ['1', '2']
        }).queue([
            {
                title: 'Gerencia',
                text: 'Ingrese la gerencia asociada',
                inputValue: name
            },
            {
                title: 'Descripción',
                text: 'Breve descripción',
                inputValue: description
            },
        ]).then((result) => {
            if (result.value) {
                const answers = (result.value)
                axios.post('resource/groups', {
                    id: id,
                    name: answers[0],
                    description: answers[1]
                })
                    .then(response => {
                        // console.log(response);
                        fillTable()
                    })
                    .catch(error => {
                        console.log(error);
                    });
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Gerencia Actualizada',
                    showConfirmButton: false,
                    timer: 1500
                })

            }
        })
    }
    return (
        <div>
            <Button
                onClick={createGroup}
                type="primary"
                style={{
                    marginBottom: 16,
                }}
            >
                Agregar nuevo grupo
            </Button>
            <Table
                columns={columns}
                dataSource={data}
                // rowSelection={rowSelection}
                bordered
                title={() => 'Grupos de Gerencia'}
            />
        </div>

    )
};

export default Groups
