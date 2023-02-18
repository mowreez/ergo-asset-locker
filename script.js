// Connect to Nautilus wallet
function connectWallet() {
    const connector = new ErgoConnector({
      apiUrl: 'https://api.ergoplatform.com',
      network: 'mainnet',
    });
  
    connector.connect().then(() => {
      alert('Connected to Nautilus wallet!');
    }).catch((error) => {
      console.error(error);
      alert('Failed to connect to Nautilus wallet');
    });
  }
  
  // Convert amount in ERG to nanoERG
  function toNanoErg(amount) {
    return amount * 1000000000;
  }
  
  // Send transaction using smart contract
  async function sendTransaction() {
    const recipient = document.getElementById('recipient').value;
    const amount = toNanoErg(document.getElementById('amount').value);
    const pin = document.getElementById('pin').value;
    const duration = document.getElementById('duration').value;
    const txBuilder = new ErgoTxBuilder();
    txBuilder.addOutput(recipient, amount);
    const txJson = txBuilder.build();
    const txWithInputs = await ErgoWalletPoc2.prepareUnsignedTransaction(
      txJson,
      ErgoBoxSelectorUtil.ErgoBoxSelector,
      toNanoErg(0.00001), // minimum box value
      pin,
      duration
    );
    const signedTx = await connector.signTransaction(txWithInputs);
    const txId = await connector.submitTransaction(signedTx);
    console.log(`Transaction sent with id: ${txId}`);
    document.getElementById('message').innerText = 'Transaction sent!';
  }
  

  // to read the amount of asset locked in the smart contract for a given address you need to use the Ergo API
  //. You can make an API call to get the UTXOs for the address, and then filter the results to find the UTXOs 
  //that correspond to the smart contract
  async function displayLockedAsset() {
    const connector = new ErgoConnector({
      apiUrl: 'https://api.ergoplatform.com',
      network: 'mainnet',
    });
  
    // Get UTXOs for the connected address
    const address = await connector.getAddress();
    const unspentBoxes = await connector.getUnspentBoxesFor(address);
  
    // Filter UTXOs to find the ones that correspond to the smart contract
    const filteredBoxes = unspentBoxes.filter(async box => {
      const script = box.ergoTree;
      const context = {
        currentHeight: await connector.getCurrentHeight(),
        headers: [],
        inputs: [box],
        outputs: [],
        variables: {}
      };
      return await ErgoScriptCompiler.check(script, context);
    });
  
    // Calculate the total amount of asset locked in the smart contract
    const lockedAsset = filteredBoxes.reduce((acc, box) => acc + box.value, 0);
  
    // Display the result to the user
    const lockedAssetElement = document.getElementById('locked-asset');
    lockedAssetElement.innerText = `${lockedAsset} asset is locked in the smart contract for address ${address}.`;
  }
  
  