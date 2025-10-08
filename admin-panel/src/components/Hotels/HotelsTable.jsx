import { Table, Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import HotelViewModal from "./HotelViewModal";

const HotelsTable = ({ hotels, loading, onRefresh }) => {
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading hotels...</p>
      </div>
    );
  }

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Hotel ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>License No</th>
            <th>Subscription</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.length > 0 ? (
            hotels.map((hotel) => (
              <tr key={hotel.hotel_id}>
                <td>{hotel.hotel_id}</td>
                <td>{hotel.hotel_name}</td>
                <td>{hotel.hotel_email}</td>
                <td>{hotel.hotel_address}</td>
                <td>{hotel.license_no}</td>
                <td>{hotel.subscription === true ? "Active" : "Expired"}</td>
                <td className="d-flex gap-2">
                  <Button
                    variant="warning"
                    size="md"
                    onClick={() => {
                      setSelectedHotel(hotel);
                      setShowViewModal(true);
                    }}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No hotels found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* View Modal */}
      {selectedHotel && (
        <HotelViewModal
          show={showViewModal}
          handleClose={() => setShowViewModal(false)}
          hotel={selectedHotel}
          onUpdated={onRefresh} 
        />
      )}
    </>
  );
};

export default HotelsTable;
