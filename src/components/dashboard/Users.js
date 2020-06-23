import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Space, Table} from 'antd';
const axios = require('axios').default;


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
                <a>Eliminar</a>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>Editar</a>
            </Space>
        ),
    },
];



async function getData() {
    let users = []
    await axios.get('/resource/tableUser')
        .then(async function (response) {
            // handle success
            for (let i = 0; i <  response.data.length; i++) {
                await users.push({
                    name: response.data[i].full_name,
                    email: response.data[i].email,
                    group: response.data[i].group_id
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

    useEffect(() => {
        async function fillTable(){
            let info = await getData()
            console.log(info)
            setData(info)
        }
        fillTable()


    }, [])




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
