import React from 'react';
import ReactJson from "react-json-view";
import {BlockChain} from "./services/types.ts";

type Props = {
    block: BlockChain;
}

const LastBlockchain: React.FC<Props> = ({block}) => {
    return (
        <div className="container wallet">
            <h2>Last Blockchain #{block.index}</h2>
            <div style={{padding: '14px 0'}}>
                <a href="https://api-ua-ecdsa-node.onrender.com/blockchain" target='_blank'>
                    API Endpoints
                </a>
                {` | `}
                <a href="https://github.com/valmirphp/alchemy-university-ecdsa-node#API" target='_blank'>
                    API Documentation
                </a>
            </div>
            <ReactJson src={block} theme={"bright"} displayDataTypes={false} style={{
                padding: '16px',
            }}/>
        </div>
    );
};

export default LastBlockchain;
