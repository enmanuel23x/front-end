import React, {useState, useEffect} from 'react';
import 'antd/dist/antd.css';
import {Button, Space, Table} from 'antd';
import Swal from "sweetalert2";
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
async function getData() {
    let groups = []
    await axios.get('/resource/groups')
        .then(async function (response) {
            // handle success
            for (let i = 0; i <  response.data.length; i++) {
                await groups.push({
                    name: response.data[i].name,
                    description: response.data[i].description,
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
        console.log(info)
        setData(info)
    }
    useEffect(() => {

        fillTable()


    }, [])

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
            },
        ]).then((result) => {
            if (result.value) {
                const answers = (result.value)
                axios.put('resource/groups', {
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
    return (
        <div>
            <Button
                onClick={createGroup}
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
