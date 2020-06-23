import React, {useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Space, Table} from 'antd';
const axios = require('axios').default;

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
                <a>Eliminar</a>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>Editar</a>
            </Space>
        ),
    },
];



const Groups = () => {
    const [data, setData] = useState([]);

    let groups = []
    axios.get('/resource/groups')
        .then(function (response) {
            // handle success
            console.log(response.data);
            for (let i = 0; i <  response.data.length; i++) {
                groups.push({
                    name: response.data[i].name,
                    description: response.data[i].description,
                })
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            setData(groups)
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
