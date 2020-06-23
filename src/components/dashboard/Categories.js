import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Space, Table, Tag} from 'antd';
import Swal from 'sweetalert2'
const axios = require('axios').default;


async function getData() {
    let categories = []
    await axios.get('/resource/categories')
        .then(async function (response) {
            // handle success
            for (let i = 0; i <  response.data.length; i++) {
                await categories.push({
                    name: response.data[i].name,
                    description: response.data[i].description,
                    tags: Array.from(response.data[i].group_ids),
                    id: response.data[i].id
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
                    <a onClick={() => deleteRecord(record.id,record.name)}>Eliminar</a>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a>Editar</a>
                </Space>
            ),
        },
    ];
    function deleteRecord(id, name){
        Swal.fire({
            title: "¿Quieres eliminar la categoria "+name+"?",
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
                        title:"La categoria fue eliminada!",
                        icon: "success",
                    })
                        .then((data) =>{
                            axios.delete('resource/categories/'+id)
                                .then( function (response) {
                                    fillTable()
                                });
                        });
                } else {
                    Swal.fire("La categoria no fue eliminada!");
                }
            });
    }
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
