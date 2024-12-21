import React from 'react'
import { SwapWidget, Theme } from '@uniswap/widgets'
import '@uniswap/widgets/fonts.css'
import { useWeb3React } from '@web3-react/core'
import { JsonRpcProvider } from '@ethersproject/providers'
import { useMemo, useState } from 'react'

// Custom theme matching the dark interface with red accents
const theme: Theme = {
  primary: '#FF0000', // Red
  secondary: '#DC143C', // Crimson
  interactive: '#FF0000', // Red
  container: '#111111', // Dark surface
  module: '#000000', // Dark background
  accent: '#FF0000', // Red accent
  outline: '#333333', // Border gray
  dialog: '#000000', // Dark background
  fontFamily: 'Inter, sans-serif',
  borderRadius: {
    large: 12,
    medium: 8,
    small: 4,
    xsmall: 2
  },
}

// JSON-RPC endpoint for Ethereum mainnet
const MAINNET_RPC = 'https://cloudflare-eth.com' // Public RPC endpoint, no API key needed

// Configure the jsonRpcUrlMap for network support
const jsonRpcUrlMap = {
  1: [MAINNET_RPC],
  5: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'] // Public Goerli endpoint
}

const XSwap: React.FC = () => {
  const { library } = useWeb3React()
  const [tokenListError, setTokenListError] = useState(false)
  
  // Use a memoized provider to prevent unnecessary re-renders
  const provider = useMemo(() => {
    try {
      return new JsonRpcProvider(MAINNET_RPC)
    } catch (error) {
      console.error('Provider initialization error:', error)
      // Return null if provider initialization fails
      return null
    }
  }, [library])

  // Handle token list errors
  const handleTokenListError = (error: Error) => {
    console.error('Token list error:', error)
    setTokenListError(true)
  }

  // Show error message if no provider is available
  if (!provider) {
    return (
      <div className="flex flex-col items-center">
        <div className="flex justify-between items-center w-full mb-6">
          <h2 className="text-2xl font-bold text-accent-red">BITCOIN DEX</h2>
          <div className="flex space-x-4">
            <a href="https://X.com/BitcoinAI_ETH" target="_blank" rel="noopener noreferrer">
              <img src="/x-logo.svg" alt="X" className="w-8 h-8 rounded-full bg-dark-surface p-1.5" />
            </a>
            <a href="https://t.me/BitcoinAIOnETH" target="_blank" rel="noopener noreferrer">
              <img src="/telegram-logo.svg" alt="Telegram" className="w-8 h-8 rounded-full bg-dark-surface p-1.5" />
            </a>
          </div>
        </div>
        <div className="w-full max-w-[360px] p-6 bg-dark-bg rounded-lg overflow-hidden shadow-xl border border-red-500/20">
          <p className="text-red-500 text-center">
            Unable to connect to Ethereum network. Please check your connection and try again.
          </p>
        </div>
      </div>
    )
  }

  // Show error message if token lists fail to load
  if (tokenListError) {
    return (
      <div className="flex flex-col items-center">
        <div className="flex justify-between items-center w-full mb-6">
          <h2 className="text-2xl font-bold text-accent-red">BITCOIN DEX</h2>
          <div className="flex space-x-4">
            <a href="https://X.com/BitcoinAI_ETH" target="_blank" rel="noopener noreferrer">
              <img src="/x-logo.svg" alt="X" className="w-8 h-8 rounded-full bg-dark-surface p-1.5" />
            </a>
            <a href="https://t.me/BitcoinAIOnETH" target="_blank" rel="noopener noreferrer">
              <img src="/telegram-logo.svg" alt="Telegram" className="w-8 h-8 rounded-full bg-dark-surface p-1.5" />
            </a>
          </div>
        </div>
        <div className="w-full max-w-[360px] p-6 bg-dark-bg rounded-lg overflow-hidden shadow-xl border border-red-500/20">
          <p className="text-red-500 text-center">
            Unable to load token lists. Please try again later.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between items-center w-full mb-6">
        <div>
          <h2 className="text-2xl font-bold text-accent-red">BITCOIN DEX</h2>
          <p className="text-lg text-gray-400 text-center">
            BUY $BTCAI!<br />
            RIGHT HERE!<br />
            RIGHT NOW!<br />
            On Bitcoin AI's Private DEX!
          </p>
        </div>
        <div className="flex space-x-4">
          <a href="https://X.com/BitcoinAI_ETH" target="_blank" rel="noopener noreferrer">
            <img src="/x-logo.svg" alt="X" className="w-8 h-8 rounded-full bg-dark-surface p-1.5" />
          </a>
          <a href="https://t.me/BitcoinAIOnETH" target="_blank" rel="noopener noreferrer">
            <img src="/telegram-logo.svg" alt="Telegram" className="w-8 h-8 rounded-full bg-dark-surface p-1.5" />
          </a>
        </div>
      </div>
      <div className="w-full max-w-[360px] bg-dark-bg rounded-lg overflow-hidden shadow-xl border border-accent-red/20">
        <SwapWidget
          provider={provider}
          theme={theme}
          width="100%"
          defaultInputTokenAddress="NATIVE"
          onError={handleTokenListError}
          hideConnectionUI={true}
          brandedFooter={false}
          permit2={false}
          tokenList="https://tokens.uniswap.org"
        />
      </div>
      <p className="text-sm text-gray-400 mt-4 text-center">
        Powered by Uniswap Protocol
      </p>
    </div>
  )
}

export default XSwap
