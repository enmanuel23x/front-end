import React from 'react';
import 'antd/dist/antd.css';
import {Button, Space, Table} from 'antd';

const columns = [
    {
        title: 'Nombre',
        dataIndex: 'name',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Descripcion',
        className: 'column-money',
        dataIndex: 'money',
        align: 'right',
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

const data = [
    {
        key: '1',
        name: 'John Brown',
        money: '￥300,000.00',
    },
    {
        key: '2',
        name: 'Jim Green',
        money: '￥1,256,000.00',
    },
    {
        key: '3',
        name: 'Joe Black',
        money: '￥120,000.00',
    },
];

const Categories = () => {
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
