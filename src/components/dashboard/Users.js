import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Space, Table, Divider} from 'antd';
import Swal from 'sweetalert2';

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
    let users = []
    await axiosInstance.get('/resource/tableUser')
        .then(async function (response) {
            // handle success
            for (let i = 0; i <  response.data.length; i++) {
                await users.push({
                    name: response.data[i].full_name,
                    email: response.data[i].email,
                    group: response.data[i].group_id,
                    id: response.data[i].id,
                    skills: response.data[i].skills,
                    group_name: response.data[i].group_name,
                    sede: response.data[i].sede,
                    cargo: response.data[i].cargo
                })
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
            console.log("Data successfully fetched")

        });
    return users
}


const Users = () =>  {
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
            title: 'Nombre',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Gerencia',
            dataIndex: 'group_name',
        },
        {
            title: 'Cargo',
            dataIndex: 'cargo'
        },
        {
            title: 'Sede',
            dataIndex: 'sede'
        },
        {
            title: 'Operación',
            key: 'action',
            width: "5%",
            align: 'center',
            render: (text, record) => (
                <Space size="small">
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={() => deleteRecord(record.id,record.name)}><DeleteFilled /></a>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={() => updateUsers(record.id, record.name, record.email, record.group, record.skills, record.cargo, record.sede)}><EditFilled /></a>

                </Space>
            ),
        },
    ];


    function deleteRecord(id, name){
        Swal.fire({
            title: "¿Quieres eliminar al usuario "+name+"?",
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
                    Swal.fire({
                        title:"El usuario fue eliminado!",
                        icon: "success",
                    })
                        .then((data) =>{
                            axiosInstance.delete('resource/users/'+id)
                                .then( function (response) {
                                    fillTable()
                                });
                        });
                } else {
                    Swal.fire("El usuario no fue eliminado!");
                }
            });
    }

    async function createUsers(){
        let groups = {}
        await axiosInstance.get('/resource/groups')
            .then(async function (response) {
                // handle success
                for (let i = 0; i <  response.data.length; i++) {
                    groups[response.data[i].id] = response.data[i].name
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                console.log("Skills fetched")
                // always executed
            });
        Swal.mixin({
            input: 'text',
            confirmButtonText: 'Siguiente &rarr;',
            cancelButtonText: 'Cancelar',

            showCancelButton: true,
            progressSteps: ['1', '2', '3', '4', '5']
        }).queue([
            {
                title: 'Nombre',
                text: 'Ingrese nombre del colaborador'
            },
            {
                title: 'Email',
                text: 'Ingrese email corporativo',
                input: 'email'
            },
            {
                title: 'Gerencia',
                text: 'Elija la gerencia asociada',
                input: 'select',
                inputOptions: groups
            },
            {
                title: 'Cargo',
                text: 'Cargo desempeñado en Intelix',
            },
            {
                title: 'Sede',
                text: 'Sede asociada',
            }
        ]).then((result) => {
            if (result.value) {
                const answers = (result.value)
                console.log(answers)
                axiosInstance.put('resource/users', {
                    email: answers[1],
                    full_name: answers[0],
                    group_id: parseInt(answers[2]),
                    cargo: answers[3],
                    sede: answers[4]
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
                    title: 'Nuevo Usuario añadido',
                    showConfirmButton: false,
                    timer: 1500
                })

            }
        })




    }

    function updateUsers(id, name, email, group_id, skills, cargo, sede){
        let groups = {}
        axiosInstance.get('/resource/groups')
            .then(async function (response) {
                // handle success
                for (let i = 0; i <  response.data.length; i++) {
                    groups[response.data[i].id] = response.data[i].name
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                console.log("Groups fetched")
                // always executed
            });
        Swal.mixin({
            input: 'text',
            confirmButtonText: 'Siguiente &rarr;',
            cancelButtonText: 'Cancelar',

            showCancelButton: true,
            progressSteps: ['1', '2', '3', '4', '5']
        }).queue([
            {
                title: 'Nombre',
                text: 'Ingrese nombre del colaborador',
                inputValue: name
            },
            {
                title: 'Email',
                text: 'Ingrese email corporativo',
                input: 'email',
                inputValue: email
            },
            {
                title: 'Gerencia',
                text: 'Elija la gerencia asociada',
                input: 'select',
                inputValue: group_id,
                inputOptions: groups
            },
            {
                title: 'Cargo',
                text: 'Cargo desempeñado en Intelix',
                inputValue: cargo
            },
            {
                title: 'Sede',
                text: 'Sede asociada',
                inputValue: sede
            }
        ]).then((result) => {
            if (result.value) {
                const answers = (result.value)
                console.log(answers)
                axiosInstance.post('resource/users', {
                    id: id,
                    email: answers[1],
                    full_name: answers[0],
                    group_id: parseInt(answers[2]),
                    skills: skills,
                    cargo: answers[3],
                    sede: answers[4]
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
                    title: 'Usuario Actualizado',
                    showConfirmButton: false,
                    timer: 1500
                })

            }
        })
    }

    return(
        <div>
            <Button
                onClick={createUsers}
                type="primary"
                style={{ backgroundColor: "#08979c", borderColor: "#08979c" }}
            >
                Agregar usuario <PlusOutlined />
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

export default Users
