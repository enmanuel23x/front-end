import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Table, Space, Button} from 'antd';
import Swal from 'sweetalert2'
const axios = require('axios').default;



async function getData() {
    let skills = []
    await axios.get('/resource/tableSkills')
        .then(async function (response) {
            // handle success
            for (let i = 0; i <  response.data.length; i++) {
                await skills.push({
                    name: response.data[i].name,
                    category: response.data[i].category_id,
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
    return skills
}
const Skills = () => {
    const [data, setData] = useState([]);

    async function fillTable(){
        let info = await getData()
        console.log(info)
        setData(info)
    }
    useEffect(() => {
        fillTable()
    }, [])

    function deleteRecord(id, name){
        Swal.fire({
            title: "¿Quieres eliminar la habilidad "+name+"?",
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
                        title:"La habilidad fue eliminada!",
                        icon: "success",
                    })
                        .then((data) =>{
                            axios.delete('resource/skills/'+id)
                                .then( function (response) {
                                    fillTable()
                                });
                        });
                } else {
                    Swal.fire("La habilidad no fue eliminada!");
                }
            });
    }


    async function createSkill(){
        let skills = {}
        await axios.get('/resource/categories')
            .then(async function (response) {
                // handle success
                for (let i = 0; i <  response.data.length; i++) {
                    skills[response.data[i].id] = response.data[i].name
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
            progressSteps: ['1', '2']
        }).queue([
            {
                title: 'Conocimiento',
                text: 'Ingrese la habilidad asociada'
            },
            {
                title: 'Categoria',
                text: 'Elija la Categoria',
                input: 'select',
                inputOptions: skills
            },
        ]).then((result) => {
            if (result.value) {
                const answers = (result.value)

                axios.put('resource/skills', {
                    name: answers[0],
                    category_id: parseInt(answers[1])
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
                    title: 'Nuevo Conocimiento añadido',
                    showConfirmButton: false,
                    timer: 1500
                })

            }
        })
    }
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
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={() => deleteRecord(record.id,record.name)}>Eliminar</a>
                    <a>Editar</a>

                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button
                onClick={createSkill}
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
