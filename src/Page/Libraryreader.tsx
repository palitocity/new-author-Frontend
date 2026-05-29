/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../config/axiosconfiq";
import MediaExperience from "../components/media/MediaExperience";

export default function LibraryReader() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`/library/${email}/${id}`);

        setBook(res.data?.data);
      } catch (err: any) {
        setError(err?.response?.data?.error || "Unable to load purchased book");
      } finally {
        setLoading(false);
      }
    };

    if (email && id) {
      fetchBook();
    }
  }, [email, id]);

  if (loading) {
    return <div className="p-10 text-center">Loading purchased content...</div>;
  }

  if (error || !book) {
    return (
      <div className="p-10 text-center text-red-500">
        {error || "Book not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 p-4">
      <MediaExperience book={book} />
    </div>
  );
}
