import React, { Component } from 'react';

class Footer extends Component {
    render() {
        return (
            <footer><i className="fa fa-copyright"></i> Intelix Synergy {(new Date().getFullYear())}</footer> 
                   );
    }
}

export default Footer;