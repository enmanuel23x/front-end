import React, {useEffect, useState} from 'react';
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

async function getData() {
    let skills = []
    await axios.get('/resource/tableSkills')
        .then(async function (response) {
            // handle success
            for (let i = 0; i <  response.data.length; i++) {
                await skills.push({
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
            console.log("Data successfully fetched")
            // always executed
        });
    return skills
}


const Skills = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fillTable(){
            let info = await getData()
            console.log(info)
            setData(info)
        }
        fillTable()


    }, [])
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
