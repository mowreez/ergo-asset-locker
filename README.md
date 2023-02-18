# ergo-asset-locker
 This is an ergo smart contract that locks an asset over a period of time and sends it back to the original sender.

To avoid unauthorized withdrawal (in case your wallet is compromised) I added pin code that uses a cryptographic key created by the proveDlog function to lock the tokens instead of a password. 

The key is passed as a parameter to the script when it is created, and is included in the transaction as a data input. 

The script checks that the data input matches the key used to lock the tokens before allowing the transaction to be executed.


V2 IDEA
As you lock your asset, you will be given a key card (Unique cryptographic NFT).

Key Card = allows the locked fund to be withdrawn by who ever is the holder.