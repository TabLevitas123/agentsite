import { SwapWidget, Theme } from '@uniswap/widgets'
import '@uniswap/widgets/fonts.css'
import { useWeb3React } from '@web3-react/core'
import { JsonRpcProvider } from '@ethersproject/providers'
import { useMemo, useState } from 'react'

// Custom theme matching the dark interface
const theme: Theme = {
  primary: '#4F46E5', // Indigo (accent color)
  secondary: '#374151', // Medium gray
  interactive: '#4F46E5', // Indigo
  container: '#1F2937', // Darker gray
  module: '#111827', // Darkest gray
  accent: '#10B981', // Accent green
  outline: '#4B5563', // Border gray
  dialog: '#111827', // Darkest gray
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

// Use multiple token lists for redundancy
const TOKEN_LISTS = [
  'https://tokens.coingecko.com/uniswap/all.json',
  'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json',
  'https://raw.githubusercontent.com/Uniswap/default-token-list/master/build/uniswap-default.tokenlist.json'
]

const XSwap: React.FC = () => {
  const { account, library } = useWeb3React()
  const [tokenListError, setTokenListError] = useState(false)
  
  // Use a memoized provider to prevent unnecessary re-renders
  const provider = useMemo(() => {
    try {
      // Try to use Web3 provider if available
      if (library) {
        return library
      }
      // Fallback to public RPC
      return new JsonRpcProvider(MAINNET_RPC)
    } catch (error) {
      console.error('Provider initialization error:', error)
      // Return null if provider initialization fails
      return null
    }
  }, [library])

  // Handle token list errors
  const handleTokenListError = () => {
    console.error('Failed to load token lists')
    setTokenListError(true)
  }

  // Show error message if no provider is available
  if (!provider) {
    return (
      <div className="flex flex-col items-center">
        <div className="flex justify-between items-center w-full mb-6">
          <h2 className="text-2xl font-bold text-accent-green">AGENT DEX</h2>
          <div className="flex space-x-4">
            <a href="https://X.com/AgentXAI_ETH" target="_blank" rel="noopener noreferrer">
              <img src="/x-logo.svg" alt="X" className="w-8 h-8 rounded-full bg-dark-surface p-1.5" />
            </a>
            <a href="https://t.me/AgentXAIOnETH" target="_blank" rel="noopener noreferrer">
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
          <h2 className="text-2xl font-bold text-accent-green">AGENT DEX</h2>
          <div className="flex space-x-4">
            <a href="https://X.com/AgentXAI_ETH" target="_blank" rel="noopener noreferrer">
              <img src="/x-logo.svg" alt="X" className="w-8 h-8 rounded-full bg-dark-surface p-1.5" />
            </a>
            <a href="https://t.me/AgentXAIOnETH" target="_blank" rel="noopener noreferrer">
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
          <h2 className="text-2xl font-bold text-accent-green">AGENT DEX</h2>
          <p className="text-lg text-gray-400 text-center">
            BUY $AGENTX!<br />
            RIGHT HERE!<br />
            RIGHT NOW!<br />
            On Agent X's Private DEX!
          </p>
        </div>
        <div className="flex space-x-4">
          <a href="https://X.com/AgentXAI_ETH" target="_blank" rel="noopener noreferrer">
            <img src="/x-logo.svg" alt="X" className="w-8 h-8 rounded-full bg-dark-surface p-1.5" />
          </a>
          <a href="https://t.me/AgentXAIOnETH" target="_blank" rel="noopener noreferrer">
            <img src="/telegram-logo.svg" alt="Telegram" className="w-8 h-8 rounded-full bg-dark-surface p-1.5" />
          </a>
        </div>
      </div>
      <div className="w-full max-w-[360px] bg-dark-bg rounded-lg overflow-hidden shadow-xl border border-accent-green/20">
        <SwapWidget
          provider={provider}
          theme={theme}
          width="100%"
          defaultOutputTokenAddress="0x6B175474E89094C44Da98b954EedeAC495271d0F" // DAI address
          defaultInputTokenAddress="NATIVE" // ETH
          tokenList={TOKEN_LISTS[0]}
          onError={handleTokenListError}
          convenienceFee={0}
          convenienceFeeRecipient={account || undefined}
        />
      </div>
      <p className="text-sm text-gray-400 mt-4 text-center">
        Powered by Uniswap Protocol
      </p>
    </div>
  )
}

export default XSwap
