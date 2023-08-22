import React from 'react';


const Footer: React.FC = () => {
    return (
        <div style={{margin: '50px 30px 0 30px'}}>
            <hr/>

            <div className="app">
                Developed by Valmir Barbosa. Project GitHub link: <a
                href="https://github.com/valmirphp/alchemy-university-ecdsa-node"
                target="_blank">valmirphp/alchemy-university-ecdsa-node</a>
            </div>
        </div>
    );
};

export default Footer;
