import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Space, Table, Tag} from 'antd';
const axios = require('axios').default;

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
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
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
async function getData() {
    let categories = []
    await axios.get('/resource/categories')
        .then(async function (response) {
            // handle success
            for (let i = 0; i <  response.data.length; i++) {
                await categories.push({
                    name: response.data[i].name,
                    description: response.data[i].description,
                    tags: Array.from(response.data[i].group_ids)
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


const Categories = () => {

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
                Agregar Nueva Categoria
            </Button>
            <Table
                columns={columns}
                dataSource={data}
                bordered
            />
        </div>

    )
};

export default Categories
