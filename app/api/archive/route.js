import { useState } from "react";

export default function ArchiveComponent() {
  const [status, setStatus] = useState("");

  const handleArchive = async () => {
    setStatus("Archiving files...");
    try {
      const response = await fetch("/api/archive", {
        method: "POST",
      });

      const result = await response.json();
      if (response.ok) {
        setStatus(result.message);
      } else {
        setStatus(`Error: ${result.message}`);
      }
    } catch (error) {
      setStatus(`Request failed: ${error.message}`);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <button
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        onClick={handleArchive}
      >
        Archive Files
      </button>
      {status && <p className="mt-4 text-gray-700">{status}</p>}
    </div>
  );
}
