import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import axios from 'axios'
import server from '../../server'
import { loadSeller } from '../../redux/actions/sellerActions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Banknote, Landmark, Wallet, Loader2 } from 'lucide-react'

const WithdrawMoney = () => {
  const { seller } = useSelector((state) => state.seller)
  const dispatch = useDispatch()
  const [amount, setAmount] = useState('')
  const [withdraws, setWithdraws] = useState([])
  const [bankDialogOpen, setBankDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [bank, setBank] = useState({
    bankName: '', branch: '', accountNumber: '', accountName: '',
  })

  const fetchWithdraws = async () => {
    try {
      const { data } = await axios.get(
        `${server}withdraw/seller-withdraw-requests/${seller._id}`,
        { withCredentials: true }
      )
      setWithdraws(data.withdraws || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (seller?._id) {
      fetchWithdraws()
      const interval = setInterval(fetchWithdraws, 30000)
      return () => clearInterval(interval)
    }
  }, [seller])

  const handleBankSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await axios.put(
        `${server}shop/update-payment-methods`,
        { withdrawMethod: bank },
        { withCredentials: true }
      )
      if (data.success) {
        toast.success('Bank info saved')
        dispatch(loadSeller())
        setBankDialogOpen(false)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save bank info')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteBank = async () => {
    setSaving(true)
    try {
      const { data } = await axios.delete(`${server}shop/delete-withdraw-method`, { withCredentials: true })
      if (data.success) {
        toast.success('Bank info removed')
        dispatch(loadSeller())
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    if (Number(amount) > (seller?.availableBalance || 0)) {
      toast.error('Insufficient balance')
      return
    }
    if (Number(amount) < 50) {
      toast.error('Minimum withdrawal is $50')
      return
    }
    setSubmitting(true)
    try {
      const { data } = await axios.post(
        `${server}withdraw/create-withdraw-request`,
        { amount: Number(amount) },
        { withCredentials: true }
      )
      if (data.success) {
        toast.success('Withdraw request submitted')
        dispatch(loadSeller())
        setAmount('')
        fetchWithdraws()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request')
    } finally {
      setSubmitting(false)
    }
  }

  const availableBalance = seller?.availableBalance ?? 0
  const hasBank = !!seller?.withdrawMethod
  const bankInfo = seller?.withdrawMethod

  const bankForm = (
    <form onSubmit={handleBankSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bankName">Bank Name</Label>
        <Input id="bankName" value={bank.bankName} onChange={(e) => setBank({ ...bank, bankName: e.target.value })} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="branch">Branch</Label>
        <Input id="branch" value={bank.branch} onChange={(e) => setBank({ ...bank, branch: e.target.value })} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input id="accountNumber" value={bank.accountNumber} onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="accountName">Account Name</Label>
        <Input id="accountName" value={bank.accountName} onChange={(e) => setBank({ ...bank, accountName: e.target.value })} required />
      </div>
    </form>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-indigo-600" />
            Withdraw Money
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasBank ? (
            <div className="text-center py-8">
              <Landmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No withdrawal method set. Please add your bank details first.</p>
              <Button onClick={() => setBankDialogOpen(true)}>
                Add Bank Details
              </Button>
              <Dialog open={bankDialogOpen} onOpenChange={setBankDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bank Account Details</DialogTitle>
                  </DialogHeader>
                  {bankForm}
                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setBankDialogOpen(false)} disabled={saving}>Cancel</Button>
                    <Button type="submit" onClick={handleBankSubmit} disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 bg-muted/40 rounded-xl border">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Banknote className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-2xl font-bold text-indigo-600">${availableBalance.toFixed(2)}</p>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-12 hidden sm:block" />
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Bank Account</p>
                  <p className="font-medium">{bankInfo?.bankName} — {bankInfo?.accountNumber}</p>
                  <div className="flex gap-2 justify-end mt-1">
                    <Button variant="link" size="sm" className="text-indigo-600 p-0 h-auto" onClick={() => { setBank(bankInfo); setBankDialogOpen(true) }}>
                      Edit
                    </Button>
                    <Button variant="link" size="sm" className="text-red-500 p-0 h-auto" onClick={handleDeleteBank} disabled={saving}>
                      {saving ? 'Removing...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($) — Minimum $50</Label>
                  <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
                </div>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Request
                </Button>
              </form>

              <Dialog open={bankDialogOpen} onOpenChange={setBankDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Bank Details</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => { handleBankSubmit(e); setBankDialogOpen(false) }} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName-edit">Bank Name</Label>
                      <Input id="bankName-edit" defaultValue={bankInfo?.bankName} onChange={(e) => setBank({ ...bank, bankName: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="branch-edit">Branch</Label>
                      <Input id="branch-edit" defaultValue={bankInfo?.branch} onChange={(e) => setBank({ ...bank, branch: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber-edit">Account Number</Label>
                      <Input id="accountNumber-edit" defaultValue={bankInfo?.accountNumber} onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountName-edit">Account Name</Label>
                      <Input id="accountName-edit" defaultValue={bankInfo?.accountName} onChange={(e) => setBank({ ...bank, accountName: e.target.value })} required />
                    </div>
                    <DialogFooter className="gap-2 px-0 pb-0">
                      <Button variant="outline" onClick={() => setBankDialogOpen(false)} type="button" disabled={saving}>Cancel</Button>
                      <Button type="submit" disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-indigo-600" />
            Withdraw History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdraws.map((w) => (
                <TableRow key={w._id}>
                  <TableCell className="font-medium">${w.amount?.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      w.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      w.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>{w.status}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(w.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {withdraws.length === 0 && (
                <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No requests yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default WithdrawMoney
