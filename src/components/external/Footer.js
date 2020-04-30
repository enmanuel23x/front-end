import React, { Component } from 'react';

class Footer extends Component {
    render() {
        return (
            <footer>
                <div className="footer-font">
                    <i className="fa fa-copyright"></i> Intelix Synergy {(new Date().getFullYear())}
                </div>
            </footer>
        );
    }
}

export default Footer;