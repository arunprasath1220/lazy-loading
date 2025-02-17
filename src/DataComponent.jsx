import { useState, useEffect, useRef } from "react";
import styles from "./App.module.css";

export default function DataComponent() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const observerRef = useRef(null);

  const fetchBook = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=wisdom&limit=1&page=${books.length + 1}`);
      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      if (data.docs.length > 0) {
        const book = data.docs[0];
        setBooks((prev) => [
          ...prev,
          {
            title: book.title,
            author: book.author_name ? book.author_name.join(", ") : "Unknown",
          },
        ]);
      }
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBook(); 
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchBook();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [loading]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📚 Books & Authors</h2>

      {books.map((item, index) => (
        <div key={index} className={styles.bookCard}>
          <p className={styles.bookTitle}>📖 {item.title}</p>
          <p className={styles.bookAuthor}><strong>✍ Author:</strong> {item.author}</p>
        </div>
      ))}

      <div ref={observerRef} className={styles.observer}></div>

      {loading && <h3 className={styles.loading}>⏳ Loading more books...</h3>}
      {error && <h3 className={styles.error}>❌ Error: {error}</h3>}
    </div>
  );
}
