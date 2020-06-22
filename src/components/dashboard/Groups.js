import React from 'react';
import 'antd/dist/antd.css';
import {Button, Space, Table} from 'antd';

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

const data = [
    {
        key: '1',
        name: 'Aplicaciones',
        description: '...',
    },
    {
        key: '2',
        name: 'Operaciones',
        description: '...',
    },

];
//
// const rowSelection = {
//     onChange: (selectedRowKeys, selectedRows) => {
//         console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//     },
//     onSelect: (record, selected, selectedRows) => {
//         console.log(record, selected, selectedRows);
//     },
//     onSelectAll: (selected, selectedRows, changeRows) => {
//         console.log(selected, selectedRows, changeRows);
//     },
// };

const Groups = () => {
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
