import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Web3Provider } from "@ethersproject/providers";

const injectedConnector = new InjectedConnector({
    supportedChainIds: [
        1,      // Mainnet
        4,      // Rinkeby
        137,    // Polygon
    ]
});

const ConnectButton = () => {
    const web3 = useWeb3React<Web3Provider>();

    const onClick = async () => {
        await web3.activate(injectedConnector);
    }

    const onClickDisconnect = async () => {
        web3.deactivate();
    }

    return (
        web3.active ?
            (<button onClick={onClickDisconnect}>Disconnect</button>)
            :
            (<button onClick={onClick}>Connect to Wallet</button>)
    )
}

export default ConnectButton