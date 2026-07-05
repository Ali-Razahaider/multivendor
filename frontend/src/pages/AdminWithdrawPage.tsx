import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import AdminHeader from '../components/Admin/AdminHeader'
import AdminSideBar from '../components/Admin/AdminSideBar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import axios from 'axios'
import server from '../server'
import { Loader2 } from 'lucide-react'

const AdminWithdrawPage = () => {
  const [withdraws, setWithdraws] = useState([])
  const [selected, setSelected] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetch = async () => {
    try {
      const { data } = await axios.get(
        `${server}withdraw/admin-all-withdraws`,
        { withCredentials: true }
      )
      setWithdraws(data.withdraws || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { fetch() }, [])

  const updateStatus = async (id, status) => {
    setLoading(true)
    try {
      const { data } = await axios.put(
        `${server}withdraw/update-withdraw-request/${id}`,
        { status, sellerId: selected?.seller?._id },
        { withCredentials: true }
      )
      if (data.success) {
        toast.success(`Withdraw ${status === 'Approved' ? 'approved' : 'rejected'}`)
        setOpenModal(false)
        setSelected(null)
        fetch()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <AdminHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={7} />
        </div>
        <div className="w-full p-8">
          <h3 className="text-[22px] font-semibold pb-2">Withdraw Requests</h3>
          <Card className="w-full mb-4">
            <CardContent className="p-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shop</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdraws.map((w) => (
                    <TableRow key={w._id}>
                      <TableCell className="font-medium">{w.seller?.name}</TableCell>
                      <TableCell>${w.amount?.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          w.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          w.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>{w.status}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{new Date(w.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {w.status === 'Processing' && (
                          <Button
                            size="sm"
                            onClick={() => { setSelected(w); setOpenModal(true) }}
                          >
                            Update
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {withdraws.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No requests</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Withdraw Request</DialogTitle>
            <DialogDescription>
              {selected?.seller?.name} — ${selected?.amount?.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Approve this request to mark it as paid and notify the seller.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenModal(false)} disabled={loading}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => updateStatus(selected._id, 'Rejected')}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Reject
            </Button>
            <Button
                className="bg-green-600 hover:bg-green-700"
              onClick={() => updateStatus(selected._id, 'Approved')}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminWithdrawPage
