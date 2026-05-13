/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "../config/axiosconfiq";

export default function Library() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem("userEmail"); // IMPORTANT

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await axios.get(`/library/${email}`);
        setBooks(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (email) fetchLibrary();
  }, [email]);

  if (loading) return <p>Loading library...</p>;

  return (
    <div>
      <h1>My Library</h1>

      {books.map((item: any) => (
        <div key={item._id}>
          <h2>{item.book.title}</h2>
          <img src={item.book.coverImage} width={100} />

          <a href={item.book.pdfFile} target="_blank">
            Read / Download
          </a>
        </div>
      ))}
    </div>
  );
}
