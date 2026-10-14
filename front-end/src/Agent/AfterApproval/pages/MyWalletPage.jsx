import { useEffect, useState } from 'react'
import { getAgentWallet, requestAgentWithdrawal } from '../../../services/api'

function MyWalletPage() {
  const [type, setType] = useState('online')
  const [amount, setAmount] = useState('')
  const [requested, setRequested] = useState(false)
  const [wallet, setWallet] = useState({ online: 0, cash: 0, withdrawals: [], transactions: [] })
  const [message, setMessage] = useState('')
  useEffect(() => { getAgentWallet().then(setWallet).catch((error) => setMessage(error.message)) }, [])

  function requestWithdrawal(event) {
    event.preventDefault()
    requestAgentWithdrawal({ type, amount }).then((result) => { setRequested(true); setMessage(result.message); return getAgentWallet() }).then(setWallet).catch((error) => setMessage(error.message))
  }

  return (
    <section className="after-wallet-page" aria-labelledby="wallet-title">
      <header className="after-wallet-heading">
        <h1 id="wallet-title">My Wallet</h1>
        <p>Manage your Online/Cash balance and withdrawal requests.</p>
      </header>

      <div className="after-wallet-balances">
        <article><span>Online Balance</span><strong>{wallet.online}</strong></article>
        <article><span>Cash Balance</span><strong>{wallet.cash}</strong></article>
      </div>

      <div className="after-wallet-columns">
        <form className="after-wallet-card after-withdrawal-card" onSubmit={requestWithdrawal}>
          <h2>Request Withdrawal</h2>
          <p className="withdrawal-note">Minimum withdrawal: ₹5000 · TDS: 2%</p>
          <label>Points Type<select value={type} onChange={(event) => setType(event.target.value)}><option value="online">Online</option><option value="cash">Cash</option></select></label>
          <label>Amount<input type="number" min="5000" value={amount} onChange={(event) => { setAmount(event.target.value); setRequested(false) }} required /></label>
          <button type="submit" className="after-wallet-submit">{requested ? 'Request Submitted' : 'Request Withdrawal'}</button>
        </form>

        <section className="after-wallet-card after-transactions-card">
          <h2>Recent Transactions</h2>
          {wallet.transactions.length ? wallet.transactions.map((transaction) => <p key={transaction.id}>₹{transaction.amount} · {transaction.description || transaction.type} · {transaction.status || 'Credited'}</p>) : <p>No transactions yet.</p>}
          {wallet.withdrawals.map((withdrawal) => <p key={withdrawal.id}>Withdrawal ₹{withdrawal.amount} · {withdrawal.status}</p>)}
          {message && <p role="status">{message}</p>}
        </section>
      </div>
    </section>
  )
}

export default MyWalletPage
