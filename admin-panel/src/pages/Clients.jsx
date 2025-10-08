import { useEffect, useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Clients.scss";

const BASE_URL = "http://localhost:5001"; 

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openImage, setOpenImage] = useState(null); 

  // Fetch Clients
  const fetchClients = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/owner/fetch`, {
        withCredentials: true,
      });
      setClients(res.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Toggle Status
  const handleToggleOwnerStatus = async (id) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/owner/toggle-status/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );

      toast.success(res.data.message);
      fetchClients();

    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Unauthorized! Please login again.");
      } else {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    }
  };



  return (
    <div className="clients-page container-fluid p-2">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2>👥 Clients</h2>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading clients...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Owner ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((client) => {
                const isActive = client.owner_status === true;
                return (
                  <tr key={client.owner_id}>
                    <td>{client.owner_id}</td>
                    <td>{client.owner_name}</td>
                    <td>{client.owner_email}</td>
                    <td>{client.owner_phone}</td>
                    <td>{client.owner_address}</td>
                    <td>
                      <Button
                        variant={isActive ? "danger" : "success"}
                        size="md"
                        onClick={() => handleToggleOwnerStatus(client.owner_id)}
                      >
                        {isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No clients found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {openImage && (
        <div
          className="image-modal-backdrop"
          onClick={() => setOpenImage(null)}
        >
          <img src={openImage} alt="Full View" className="image-full" />
        </div>
      )}

      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
    </div>
  );
};

export default Clients;
