'use client'
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, createTransferInstruction } from "@solana/spl-token";
import React, {useState} from 'react'

const TokenTransfer: React.FC = () => {
    const {publicKey, sendTransaction} = useWallet();
    const {connection} = useConnection();

    const [receiver, setReceiver] = useState('');
    const [amount, setAmount] = useState('');
    const [tokenMint, setTokenMint] = useState('');
    const [transactionStatus, setTransactionStatus] = useState('');

    const transferTokens = async () => {
        if(!publicKey) {
            alert('Please connect your wallet!');
            return;
        }
        
        if(!receiver || !amount) {
            alert('Please fill out all fields!');
            return;
        }

        try {
            const recipient = new PublicKey(receiver);
            const mintAddress = new PublicKey(tokenMint);
            const amountToTransfer = parseFloat(amount) * 10 ** 9;

            const senderTokenAccount = await getAssociatedTokenAddress(mintAddress, publicKey);
            const recipientTokenAccount = await getAssociatedTokenAddress(mintAddress, recipient);


            const transaction = new Transaction().add(
                createTransferInstruction(
                    senderTokenAccount,
                    recipientTokenAccount,
                    publicKey,
                    amountToTransfer
                )
            );

            const signature = await sendTransaction(transaction, connection);
            setTransactionStatus(`Transaction sent! Signature: ${signature}`);
           
        } catch (error) {
            console.error('Error during transaction:', error);
            setTransactionStatus('Transfer failed. Check the console for details')
        }
    }

    return(
        <div style={{padding: '20px', maxWidth: '500px', margin: 'auto'}}>
            <h1>Transfer SPL Token</h1>
            <div style={{marginBottom: '10px'}}>
                <label>Token Mint Address:</label>
                <input type="text" placeholder="Token Mint Address" value={tokenMint} onChange={(e) => setTokenMint(e.target.value)} style={{width: '100%', padding: '8px', marginTop: '5px'}}></input>
            </div>
            <div style={{marginBottom: '10px'}}>
                <label>Recipient Address</label>
                <input type="text" placeholder="Recipient Address" value={receiver} onChange={(e) => setReceiver(e.target.value)} style={{width: '100%', padding: '8px', marginTop: '5px'}}></input>
            </div>
            <div style={{marginBottom: '10px'}}>
                <label>Amount:</label>
                <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} style={{width: '100%', padding: '8px', marginTop: '5px'}}></input>
            </div>
            <button
                onClick={transferTokens}
                style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    cursor: 'pointer',
                }}>Transfer Tokens</button>

            {transactionStatus && <p style={{marginTop: '10px'}}>{transactionStatus}</p>}
            <WalletMultiButton />
            
        </div>
    )
}

export default TokenTransfer;