import React, {useState, useEffect} from 'react';
import 'antd/dist/antd.css';
import {Button, Space, Table, Divider} from 'antd';
import Swal from "sweetalert2";
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
    let groups = []
    await axiosInstance.get('/resource/groups')
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
        setData(info)
    }
    useEffect(() => {

        fillTable()


    }, [])
    const columns = [
        {
            title: 'Gerencia',
            dataIndex: 'name',
            width: "40%"
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            width: "65%"
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
                    <a onClick={() => updateGroup(record.id, record.name, record.description)}><EditFilled/></a>
                </Space>
            ),
        },
    ];
    function deleteRecord(id, name){
        Swal.fire({
            title: "¿Quieres eliminar La gerencia "+name+"?",
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
                    axiosInstance.delete('resource/groups/'+id)
                        .then( function (response) {
                            if(response.data === "ERROR"){
                                Swal.fire({
                                    title:"La gerencia no puede ser eliminada!",
                                    text: "Por favor, verifique que La gerencia no este en\n"+
                                          "uso en alguna Categoría registrada",
                                    icon: "warning",
                                });
                            }else{
                                Swal.fire({
                                    title:"La gerencia fue eliminada!",
                                    icon: "success",
                                });
                            }
                            fillTable()
                            });
                } else {
                    Swal.fire("La gerencia no fue eliminada!");
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
                input: 'textarea'
            },
        ]).then((result) => {
            if (result.value) {
                const answers = (result.value)
                axiosInstance.put('resource/groups', {
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
                inputValue: description,
                input: 'textarea'
            },
        ]).then((result) => {
            if (result.value) {
                const answers = (result.value)
                axiosInstance.post('resource/groups', {
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
                style={{ backgroundColor: "#08979c", borderColor: "#08979c" }}
            >
                Agregar gerencia <PlusOutlined/>
            </Button>
            <Divider/>
            <Table
                columns={columns}
                dataSource={data}
                // rowSelection={rowSelection}
                bordered
            />
        </div>

    )
};

export default Groups
