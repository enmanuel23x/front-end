import React, {useState} from 'react';
import 'antd/dist/antd.css';
import {Table, Space, Button} from 'antd';
const axios = require('axios').default;

const columns = [
    {
        title: 'Conocimiento',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Categoria',
        dataIndex: 'category',
        key: 'category',
    },
    {
        title: 'Operación',
        key: 'action',
        width: "20%",
        render: (text, record) => (
            <Space size="middle">
                <a>Eliminar</a>
                <a>Editar</a>
            </Space>
        ),
    },
];




const Skills = () => {
    const [data, setData] = useState([]);
    let skills = []

    axios.get('/resource/tableSkills')
        .then(function (response) {
            // handle success
            console.log(response.data);
            for (let i = 0; i <  response.data.length; i++) {
                skills.push({
                    name: response.data[i].name,
                    category: response.data[i].category_id,
                })
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            setData(skills)
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
                Agregar nuevo conocimiento
            </Button>
            <Table
                columns={columns}
                dataSource={data}
                bordered
            />
        </div>

    )
};

export default Skills
