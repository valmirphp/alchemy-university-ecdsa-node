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
            <ReactJson src={block} theme={"bright"} displayDataTypes={false} style={{
                padding: '16px',
            }}/>
        </div>
    );
};

export default LastBlockchain;
