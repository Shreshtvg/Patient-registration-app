import Head from "next/head";
import { useEffect, useState } from "react";
import { PGlite } from "@electric-sql/pglite";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [query, setQuery] = useState("SELECT * FROM patients;");
  const [results, setResults] = useState("");
  const [db, setDb] = useState(null);

  useEffect(() => {
    let dbInstance;

    (async () => {
      dbInstance = new PGlite();
      await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS patients (
          id SERIAL PRIMARY KEY,
          name TEXT,
          age INTEGER
        );
      `);

      const savedPatients = localStorage.getItem("patient-rows");
      if (savedPatients) {
        const rows = JSON.parse(savedPatients);
        for (const row of rows) {
          await dbInstance.exec(
            `INSERT INTO patients (name, age) VALUES ('${row.name.replace(/'/g, "''")}', ${row.age})`
          );
        }
      }

      setDb(dbInstance);
    })();

    const onStorageChange = async (event) => {
      if (event.key === "patient-rows") {
        const newRows = JSON.parse(event.newValue || "[]");
        const tempDb = new PGlite();
        await tempDb.exec(`
          CREATE TABLE IF NOT EXISTS patients (
            id SERIAL PRIMARY KEY,
            name TEXT,
            age INTEGER
          );
        `);
        for (const row of newRows) {
          await tempDb.exec(
            `INSERT INTO patients (name, age) VALUES ('${row.name.replace(/'/g, "''")}', ${row.age})`
          );
        }
        setDb(tempDb);
        runQuery(tempDb);
      }
    };

    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  const register = async (e) => {
    e.preventDefault();
    if (!name || !age || !db) return alert("Missing info or DB not ready");

    const safeName = name.replace(/'/g, "''");
    const ageInt = parseInt(age);
    await db.exec(
      `INSERT INTO patients (name, age) VALUES ('${safeName}', ${ageInt});`
    );

    const result = await db.query("SELECT * FROM patients");
    const rows = result.rows;
    localStorage.setItem("patient-rows", JSON.stringify(rows));

    setName("");
    setAge("");
  };

  const runQuery = async (customDb = db) => {
    if (!customDb) return;
    try {
      const result = await customDb.query(query);
      setResults(JSON.stringify(result.rows, null, 2));
    } catch (err) {
      setResults("Error: " + err.message);
    }
  };

  // Function to clear all data from the database and localStorage
  const deleteAllData = async () => {
    if (db) {
      await db.exec("DELETE FROM patients;");
      localStorage.removeItem("patient-rows");
      setResults("All data has been deleted.");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Patient Registration</title>
      </Head>
      <h1> Patient Registration</h1>
      <form onSubmit={register} className={styles.form}>
        <input
          className={styles.input}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={styles.input}
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button type="submit" className={styles.button}>
          Register
        </button>
      </form>

      <h2> Run SQL Query</h2>
      <textarea
        className={styles.textarea}
        rows="4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button onClick={() => runQuery()} className={styles.button}>
          Run
        </button>
        <button
          onClick={() => setResults("")}
          className={styles.button}
          style={{ backgroundColor: "#e74c3c" }}
        >
          Clear Results
        </button>
        <button
          onClick={deleteAllData}
          className={styles.button}
          style={{ backgroundColor: "#e67e22" }}
        >
          Delete All Data
        </button>
      </div>

      {results && (
        <pre className={styles.results}>{results}</pre>
      )}
    </div>
  );
}
