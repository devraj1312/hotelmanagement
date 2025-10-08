import { useEffect, useState } from "react";
import axios from "axios";
import HotelsTable from "../components/Hotels/HotelsTable";
import "../styles/Hotels.scss";

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHotels = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/hotel/fetch-hotels", {
        withCredentials: true,
      });
      setHotels(res.data.hotels || []); 
    } catch (err) {
      console.error("Error fetching hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return (
    <div className="hotels-page container-fluid p-2">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2>🏨 Hotels</h2>
      </div>
      <HotelsTable hotels={hotels} loading={loading} onRefresh={fetchHotels} />
    </div>
  );
};

export default Hotels;
