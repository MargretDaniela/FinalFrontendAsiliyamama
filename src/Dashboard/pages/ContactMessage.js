import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Spinner, Alert, Pagination, InputGroup, Form, Modal } from 'react-bootstrap';

const jwtDecode = (token) => {
    try {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error("Failed to decode token:", error);
        return {};
    }
};
const AdminContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
  // const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleAuthError = useCallback((errMessage) => {
    setError(errMessage);
    localStorage.removeItem('authToken');
  }, []);

  // Initial Auth Check: Runs once on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      handleAuthError("Authentication token missing. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.is_admin || false);
      setIsSuperAdmin(decodedToken.is_super_admin || false);
    } catch (err) {
      console.error("Failed to decode token:", err);
      handleAuthError("Invalid or expired token. Please log in again.");
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  // Fetch Contact Messages: Triggers on specific state changes
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        handleAuthError("Authentication token missing.");
        return;
      }

      const params = new URLSearchParams({
        page: currentPage,
        per_page: 10,
        search: searchQuery,
        status: statusFilter,
      });

      const response = await fetch(`${API_BASE_URL}/api/v1/contact_bp/all?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            if (response.status === 401 || response.status === 403) {
              handleAuthError(errorData.error || errorData.msg || "Authentication failed or access denied. Please log in again.");
              return;
            }
            throw new Error(errorData.error || errorData.msg || `Failed to fetch messages: ${response.status}`);
        } else {
            const errorText = await response.text();
            throw new Error(`Server responded with non-JSON data (Status: ${response.status}). Response (first 200 chars): ${errorText.substring(0, 200)}...`);
        }
      }

      const data = await response.json();
      setMessages(data.messages || []);
      setTotalPages(data.pages || Math.ceil((data.total_messages || 0) / 10));
      setTotalMessages(data.total_messages || 0);

    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter, handleAuthError, API_BASE_URL]);

  // THIS IS THE CORRECTED PART:
  // We now use a new boolean state `isAuthComplete` to trigger the fetch
  // This prevents the infinite loop caused by the `loading` state changing.
  const [isAuthComplete, setIsAuthComplete] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      handleAuthError("Authentication token missing. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.is_admin || false);
      setIsSuperAdmin(decodedToken.is_super_admin || false);
    } catch (err) {
      console.error("Failed to decode token:", err);
      handleAuthError("Invalid or expired token. Please log in again.");
    } finally {
      setIsAuthComplete(true);
    }
  }, [handleAuthError]);

  useEffect(() => {
    if (isAuthComplete && (isAdmin || isSuperAdmin) && !error) {
      fetchMessages();
    } else if (isAuthComplete && !isAdmin && !isSuperAdmin && !error) {
      setError("You do not have permission to view this page.");
      setLoading(false); // Make sure to stop the spinner here too
    }
  }, [isAuthComplete, isAdmin, isSuperAdmin, error, fetchMessages]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => {
      setCurrentPage(1);
    }, 500));
  };

  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleViewDetails = (message) => {
    setSelectedMessage(message);
    setReplyContent(message.reply_content || '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
    setReplyContent('');
  };

  const handleSendReplyAndMarkAsReplied = async (messageId) => {
    if (!replyContent.trim()) {
      alert("Please enter a reply before marking as replied.");
      return;
    }
    if (!window.confirm("Are you sure you want to send this reply and mark this message as 'Replied'?")) {
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        handleAuthError("Authentication token missing.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/contact_bp/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'replied',
          reply_content: replyContent.trim()
        })
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            if (response.status === 401 || response.status === 403) {
              handleAuthError(errorData.error || errorData.msg || "Authentication failed or access denied. Please log in again.");
              return;
            }
            throw new Error(errorData.error || errorData.msg || `Failed to send reply: ${response.status}`);
        } else {
            const errorText = await response.text();
            throw new Error(`Server responded with non-JSON data (Status: ${response.status}). Response (first 200 chars): ${errorText.substring(0, 200)}...`);
        }
      }

      fetchMessages();
      handleCloseModal();
      alert('Reply sent and message marked as replied!');
    } catch (err) {
      console.error("Error sending reply:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        handleAuthError("Authentication token missing.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/contact_bp/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            if (response.status === 401 || response.status === 403) {
              handleAuthError(errorData.error || errorData.msg || "Authentication failed or access denied. Please log in again.");
              return;
            }
            throw new Error(errorData.error || errorData.msg || `Failed to delete message: ${response.status}`);
        } else {
            const errorText = await response.text();
            throw new Error(`Server responded with non-JSON data (Status: ${response.status}). Response (first 200 chars): ${errorText.substring(0, 200)}...`);
        }
      }

      fetchMessages();
      handleCloseModal();
      alert('Message deleted successfully!');
    } catch (err) {
      console.error("Error deleting message:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // --- Render Logic ---

  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Checking user permissions and fetching messages...</p>
      </div>
    );
  }

  if (!isAdmin && !isSuperAdmin) {
     return <Alert variant="warning" className="m-4">Access Denied: You do not have the necessary permissions to view this page.</Alert>;
  }

  if (error) {
    return <Alert variant="danger" className="m-4">Error: {error}</Alert>;
  }

  return (
    <div className="container mt-4">
      <h2>Contact Messages</h2>
      <div className="d-flex justify-content-between mb-3 align-items-center flex-wrap">
        <h4 className="mb-2 mb-md-0">Total Messages: {totalMessages}</h4>
        <InputGroup className="w-md-50 w-100 mb-2 mb-md-0">
          <Form.Control
            type="text"
            placeholder="Search by Name, Email, or Message..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button variant="outline-secondary" onClick={handleClearSearch}>Clear Search</Button>
        </InputGroup>
        <Form.Select
          className="w-auto ml-md-3"
          value={statusFilter}
          onChange={handleStatusFilterChange}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </Form.Select>
      </div>
      {messages.length === 0 && (
        <Alert variant="info">
          {searchQuery || statusFilter ? "No messages found for your criteria." : "No contact messages available."}
        </Alert>
      )}
      {messages.length > 0 && (
        <>
          <Table striped bordered hover responsive className="mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message Snippet</th>
                <th>Date Sent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.contact_id}>
                  <td>{message.contact_id}</td>
                  <td>{message.name}</td>
                  <td>{message.email}</td>
                  <td>{message.message.substring(0, 50)}{message.message.length > 50 ? '...' : ''}</td>
                  <td>{message.date_sent ? formatDate(message.date_sent) : 'N/A'}</td>
                  <td>{message.status ? (message.status.charAt(0).toUpperCase() + message.status.slice(1)) : 'Pending'}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleViewDetails(message)}
                    >
                      View / Reply
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center mt-3">
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          </Pagination>
        </>
      )}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Message Details - ID: {selectedMessage?.contact_id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMessage ? (
            <>
              <p><strong>Name:</strong> {selectedMessage.name}</p>
              <p><strong>Email:</strong> {selectedMessage.email}</p>
              <p><strong>Date Sent:</strong> {formatDate(selectedMessage.date_sent)}</p>
              <p><strong>Status:</strong> {selectedMessage.status ? (selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1)) : 'Pending'}</p>
              {selectedMessage.status === 'replied' && (
                <>
                  <p><strong>Replied On:</strong> {formatDate(selectedMessage.replied_at)}</p>
                  <p><strong>Replied By:</strong> {selectedMessage.replied_by_user_name || `User ID: ${selectedMessage.replied_by_user_id}`}</p>
                  <hr />
                  <h5>Reply Content:</h5>
                  <p>{selectedMessage.reply_content}</p>
                </>
              )}
              <hr />
              <h5>Original Message:</h5>
              <p>{selectedMessage.message}</p>
              {selectedMessage.status !== 'replied' && (
                <>
                  <h5 className="mt-4">Your Reply:</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Reply Content</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your reply here..."
                    />
                  </Form.Group>
                </>
              )}
            </>
          ) : (
            <p>No message selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedMessage && (
            <div className="d-flex justify-content-between w-100 flex-wrap">
              <div className="mb-2 mb-md-0 d-flex flex-wrap gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Regarding Your Inquiry (Message ID: ${selectedMessage.contact_id})`}
                  className="btn btn-primary"
                >
                  Reply via Email
                </a>
                {selectedMessage.status !== 'replied' && (
                  <Button
                    variant="success"
                    onClick={() => handleSendReplyAndMarkAsReplied(selectedMessage.contact_id)}
                    disabled={!replyContent.trim()}
                  >
                    Send Reply & Mark as Replied
                  </Button>
                )}
              </div>
              <Button
                variant="danger"
                onClick={() => handleDeleteMessage(selectedMessage.contact_id)}
              >
                Delete Message
              </Button>
            </div>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminContactMessagesPage;