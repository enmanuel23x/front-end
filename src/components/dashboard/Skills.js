import React from 'react';
import 'antd/dist/antd.css';
import {Table, Tag, Space, Button} from 'antd';

const columns = [
    {
        title: 'Conocimiento',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Categoria',
        dataIndex: 'age',
        key: 'age',
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
            <Space size="middle">
                <a>Eliminar</a>
                <a>Editar</a>
            </Space>
        ),
    },
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        tags: ['cool', 'teacher'],
    },
];


const Skills = () => {
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
