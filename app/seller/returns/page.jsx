"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import Modal, { ConfirmationModal } from "@/components/Modal";
import Footer from "@/components/seller/Footer";
import Navbar from "@/components/seller/Navbar";
import BackButton from "@/components/BackButton";

const SellerReturns = () => {
  const { getToken, currency } = useAppContext();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundMethod, setRefundMethod] = useState("");
  const [restock, setRestock] = useState(false);
  const [processing, setProcessing] = useState(false);
  // Remove ConfirmationModal state

  const fetchReturns = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/order/list", { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        setReturns(data.orders.filter(order => order.returnRequest && order.returnRequest.status !== 'None'));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReturns(); }, []);

  const openModal = (order, type) => {
    setSelectedOrder(order);
    setActionType(type);
    setModalMessage("");
    setRefundAmount(order.amount);
    setRefundMethod(order.returnRequest?.refundMethod || "");
    setRestock(false);
  };
  const closeModal = () => {
    setSelectedOrder(null);
    setActionType(null);
    setModalMessage("");
    setRefundAmount("");
    setRefundMethod("");
    setRestock(false);
  };
  const processReturn = async () => {
    setProcessing(true);
    try {
      const token = await getToken();
      const { data } = await axios.post("/api/order/process-return", {
        orderId: selectedOrder._id,
        action: actionType,
        message: modalMessage,
        refundAmount: actionType === 'approve' ? refundAmount : undefined,
        restock: actionType === 'approve' ? restock : false
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        toast.success(data.message);
        closeModal();
        fetchReturns();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleApprove = (order) => {
    openModal(order, 'approve');
  };
  const handleReject = (order) => {
    openModal(order, 'reject');
  };
  // Remove ConfirmationModal JSX

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between relative">
      <div className="w-full flex justify-start px-4 md:px-8 pt-4"><BackButton customText="Back to Dashboard" customHref="/seller" /></div>
      {/* <Navbar /> Removed to eliminate logo and logout button from main content area */}
      <div className="max-w-5xl mx-auto w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold">Return/Refund Requests</h2>
        </div>
        {loading ? <div>Loading...</div> : returns.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded">No return/refund requests found.</div>
        ) : (
          <div className="space-y-6">
            {returns.map(order => (
              <div key={order._id} className="border rounded-lg p-5 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="font-medium text-lg mb-1">Order #{order._id}</div>
                  <div className="text-sm text-gray-700 mb-1">User: {order.userId}</div>
                  <div className="text-sm text-gray-700 mb-1">Items: {order.items.map(item => item.product?.name + ' x' + item.quantity).join(', ')}</div>
                  <div className="text-sm text-gray-700 mb-1">Amount: {currency}{order.amount}</div>
                  <div className="text-sm text-gray-700 mb-1">Status: <b>{order.returnRequest.status}</b></div>
                  <div className="text-sm text-gray-700 mb-1">Reason: {order.returnRequest.reason}</div>
                  <div className="text-sm text-gray-700 mb-1">Requested: {order.returnRequest.requestedAt ? new Date(order.returnRequest.requestedAt).toLocaleString() : ''}</div>
                  {order.returnRequest.refundMethod && <div className="text-sm text-gray-700 mb-1">Refund Method: {order.returnRequest.refundMethod}</div>}
                  {order.returnRequest.refundAmount && <div className="text-sm text-gray-700 mb-1">Refund Amount: {currency}{order.returnRequest.refundAmount}</div>}
                  {order.returnRequest.message && <div className="text-sm text-gray-700 mb-1">Message: {order.returnRequest.message}</div>}
                  {order.returnRequest.restocked && <div className="text-sm text-green-700 mb-1">Stock Restocked</div>}
                </div>
                {order.returnRequest.status === 'Requested' && (
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                      onClick={() => handleApprove(order)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(order)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedOrder && (
        <Modal onClose={closeModal}>
          <div className="p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">{actionType === 'approve' ? 'Approve' : 'Reject'} Return/Refund</h2>
            {actionType === 'approve' && (
              <>
                <label className="block mb-2 font-medium">Refund Amount</label>
                <input
                  type="number"
                  className="w-full border rounded p-2 mb-4"
                  value={refundAmount}
                  onChange={e => setRefundAmount(e.target.value)}
                  min="0"
                />
                <label className="block mb-2 font-medium">Refund Method</label>
                <select
                  className="w-full border rounded p-2 mb-4"
                  value={refundMethod}
                  onChange={e => setRefundMethod(e.target.value)}
                >
                  <option value="">Select method</option>
                  <option value="Original Payment">Original Payment</option>
                  <option value="Cash, after returning the product">Cash, after returning the product</option>
                </select>
                <label className="inline-flex items-center mb-4">
                  <input
                    type="checkbox"
                    className="form-checkbox mr-2"
                    checked={restock}
                    onChange={e => setRestock(e.target.checked)}
                  />
                  Restock items
                </label>
              </>
            )}
            <label className="block mb-2 font-medium">Message to user</label>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={3}
              value={modalMessage}
              onChange={e => setModalMessage(e.target.value)}
              placeholder="Add a note for the user (optional)"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={processReturn}
                disabled={processing || (actionType === 'approve' && (!refundAmount || !refundMethod))}
                className={`flex-1 px-4 py-2 ${actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded`}
              >
                {processing ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
      {/* Remove ConfirmationModal JSX */}
      <Footer />
    </div>
  );
};

export default SellerReturns; 