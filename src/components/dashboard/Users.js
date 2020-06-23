import React, {useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Space, Table} from 'antd';
import config from "../../config/config";
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


const Users = () => {
    const [data, setData] = useState([]);

    let users = []
    axios.get('/resource/tableUser')
        .then(function (response) {
            // handle success
            console.log(response.data);
            for (let i = 0; i <  response.data.length; i++) {
                users.push({
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
            setData(users)
            console.log(data)
            // always executed
        });

    return (
        <div>
            <Button
                // onClick={}
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
                // rowSelection={rowSelection}
                bordered

            />
        </div>

    )
};

export default Users
