import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Space, Table} from 'antd';
import { data } from 'jquery';
import Swal from 'sweetalert2';
const axios = require('axios').default;


async function getData() {
    let users = []
    await axios.get('/resource/tableUser')
        .then(async function (response) {
            // handle success
            for (let i = 0; i <  response.data.length; i++) {
                await users.push({
                    name: response.data[i].full_name,
                    email: response.data[i].email,
                    group: response.data[i].group_id,
                    id: response.data[i].id
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
        console.log(info)
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
            align: 'right',
        },
        {
            title: 'Grupo',
            dataIndex: 'group',
            align: 'right',
        },
        {
            title: 'Operación',
            key: 'action',
            render: (text, record) => (
                <Space size="small">
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={() => deleteRecord(record.id,record.name)}>Eliminar</a>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a>Editar</a>
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
                            axios.delete('resource/users/'+id)
                                .then( function (response) {
                                    console.log(response)
                                    fillTable()
                                });
                        });
                } else {
                    Swal.fire("El usuario no fue eliminado!");
                }
            });
    }


    return(
        <div>
            <Button
                type="primary"
                style={{
                    marginBottom: 16,
                }}
            >
                Agregar Usuario Nuevo
            </Button>

            <Table
                columns={columns}
                dataSource={data}
                bordered
            />
        </div>
    )

};

export default Users