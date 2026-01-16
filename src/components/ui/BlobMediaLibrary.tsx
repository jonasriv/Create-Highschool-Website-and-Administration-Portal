"use client";

import React, { useEffect, useState } from "react";

type BlobItem = {
  url: string;
  pathname: string;
  size: number;
  uploadedAt?: string;
};

export default function BlobMediaLibrary({
  token,
  onImageSelected,
  buttonClassName = "",
}: {
  token: string;
  onImageSelected: (url: string) => void;
  buttonClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blobs, setBlobs] = useState<BlobItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchBlobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/blob/list?prefix=news/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Kunne ikke hente bibliotek");

      setBlobs(Array.isArray(data.blobs) ? data.blobs : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Feil ved henting");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchBlobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const filtered = blobs.filter((b) =>
    (b.pathname || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClassName || "bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg"}
      >
        Hent fra bibliotek
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* overlay */}
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* modal */}
          <div className="relative z-10 w-[95vw] max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl border">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-black">Bildebibliotek</h2>
                <p className="text-sm text-gray-600">Klikk et bilde for å velge</p>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={fetchBlobs}
                  className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-black"
                >
                  Oppdater
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
                >
                  Lukk
                </button>
              </div>
            </div>

            <div className="p-4 border-b flex text-sm gap-3 items-center">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Søk (filnavn)..."
                className="w-full rounded-lg border p-2 text-black"
              />
            </div>

            <div className="p-4 overflow-auto max-h-[65vh]">
              {loading && <p className="text-black">Laster...</p>}
              {error && <p className="text-red-600">{error}</p>}

              {!loading && !error && filtered.length === 0 && (
                <p className="text-black">Ingen bilder funnet.</p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filtered.map((b) => (
                  <button
                    key={b.url}
                    type="button"
                    onClick={() => {
                      onImageSelected(b.url);
                      setOpen(false);
                    }}
                    className="group rounded-xl border overflow-hidden bg-white hover:shadow-lg"
                    title={b.pathname}
                  >
                    <div className="aspect-square w-full bg-gray-50">
                      <img
                        src={b.url}
                        alt={b.pathname}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2 text-left">
                      <p className="text-xs text-black truncate">{b.pathname.replace("news/", "")}</p>
                      <p className="text-[10px] text-gray-500">
                        {(b.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}