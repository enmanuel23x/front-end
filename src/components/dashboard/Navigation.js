import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import 'antd/dist/antd.css';
import './assets/css/navigation.css';



// Components
import UsersTable from "./Users";
import Skills from "./Skills";
import Categories from "./Categories";
import Groups from "./Groups";
import keycloak from '../../config/keycloak';
// Icons
import {
    UserOutlined,
    BarChartOutlined,
    ApartmentOutlined,
    AppstoreOutlined,
    LogoutOutlined
} from '@ant-design/icons';
const { Title } = Typography;
const { Header, Sider, Content } = Layout;

class SiderDemo extends React.Component {
    state = {
        collapsed: false,
        selected: 1
    };
    logout() {
        keycloak.logout();
      }
    render() {
        return (
            <Layout>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <a href="/">                    <img src={require('./assets/img/logo.png')} style={{paddingTop: "20px", paddingLeft:"20px", paddingBottom:"20px"}} alt="logo" />
                    </a>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} >
                        <Menu.Item key="1" icon={<UserOutlined />} onClick={() => this.setState({selected: 1})} className="customclass">
                            Usuarios
                        </Menu.Item>
                        <Menu.Item key="4" icon={<AppstoreOutlined />} onClick={() => this.setState({selected: 4})} className="customclass">
                            Gerencia
                        </Menu.Item>
                        <Menu.Item key="3" icon={<ApartmentOutlined />} onClick={() => this.setState({selected: 3})} className="customclass">
                            Categorías
                        </Menu.Item>
                        <Menu.Item key="2" icon={<BarChartOutlined />}  onClick={() => this.setState({selected: 2})} className="customclass">
                            Conocimientos
                        </Menu.Item>
                        <Menu.Item key="5" icon={<LogoutOutlined />} className="customclass" onClick={ () => this.logout() }>
                            Salir
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }}>
                        {/* eslint-disable-next-line react/jsx-no-undef */}
                        <Title level={4} style={{paddingTop: "20px", paddingLeft:"20px", paddingBottom:"20px"}}>Registro de conocimientos - Panel Administrativo</Title>
                    </Header>
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                        }}
                    >
                        {this.state.selected === 1 ? <UsersTable /> : null}
                        {this.state.selected === 2 ? <Skills/> : null}
                        {this.state.selected === 3 ? <Categories/> : null}
                        {this.state.selected === 4 ? <Groups/> : null}

                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default SiderDemo
