import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"
const connectBtn = document.getElementById("connectBtn")
const fundBtn = document.getElementById("fundBtn")
const amountInput = document.getElementById("ethAmount")
const getBalanceBtn = document.getElementById("balanceBtn")
const withdrawBtn = document.getElementById("withdrawBtn")
connectBtn.onclick = connect
fundBtn.onclick = fund
getBalanceBtn.onclick = getBalance
withdrawBtn.onclick = withdraw

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" })
    connectBtn.innerHTML = "Connected :)"
  } else {
    console.log("No metamask!")
    connectBtn.innerHTML = "No metamask :("
  }
}

async function fund() {
  const ethAmount = amountInput.value
  console.log(`Funding with eth ammount: ${ethAmount}....`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    console.log(signer)
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })

      await listenForTransactionMine(transactionResponse, provider)
      console.log("Funded!")
    } catch (error) {
      console.log(error)
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse}!`)
  // Listen for this transaction to finish
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      )
      resolve()
    })
  })
}

async function getBalance() {
  console.log("GetBalance")
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(ethers.utils.formatEther(balance))
  }
}

async function withdraw() {
  console.log("Withdraw")
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    console.log(signer)
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.withdraw()

      await listenForTransactionMine(transactionResponse, provider)
      console.log("Withdrew from contract!")
    } catch (error) {
      console.log(error)
    }
  }
}
