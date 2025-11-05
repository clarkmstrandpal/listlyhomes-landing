import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FiltersDrawer({ filters, setFilters }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Click outside to close
  const onBackdropClick = (e) => {
    // only close if they clicked the backdrop (not inside panel)
    if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
  };

  return (
    <>
      <button
        className="fixed top-4 right-4 z-[60] rounded-lg px-3 py-2 bg-gray-900 text-slate-900 shadow-lg hover:bg-gray-800"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Close Filters" : "Filters"}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/30 z-40"
              onMouseDown={onBackdropClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Slide-in panel */}
            <motion.aside
              ref={panelRef}
              className="fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-white border-l border-gray-200 shadow-2xl z-50"
              role="dialog"
              aria-modal="true"
              initial={{ x: 360, opacity: 0.6 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 360, opacity: 0.6 }}
              transition={{ type: "spring", stiffness: 420, damping: 40 }}
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Filter Leads</h2>
                  <button
                    className="rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                    aria-label="Close filters"
                  >
                    âœ•
                  </button>
                </div>

                <label className="block text-sm">
                  ZIP
                  <input
                    className="mt-1 w-full border rounded p-2"
                    type="text"
                    placeholder="e.g. 72756"
                    value={filters.zip ?? ""}
                    onChange={(e) => setFilters({ ...filters, zip: e.target.value })}
                  />
                </label>

                <label className="block text-sm">
                  Min Price
                  <input
                    className="mt-1 w-full border rounded p-2"
                    type="number"
                    inputMode="numeric"
                    value={filters.minPrice ?? ""}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                </label>

                <label className="block text-sm">
                  Max Price
                  <input
                    className="mt-1 w-full border rounded p-2"
                    type="number"
                    inputMode="numeric"
                    value={filters.maxPrice ?? ""}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </label>

                <label className="block text-sm">
                  Status
                  <select
                    className="mt-1 w-full border rounded p-2"
                    value={filters.status ?? ""}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value || undefined })
                    }
                  >
                    <option value="">Any</option>
                    <option value="new">New</option>
                    <option value="claimed">Claimed</option>
                  </select>
                </label>

                <div className="flex gap-2 pt-2">
                  <button
                    className="px-3 py-2 rounded bg-blue-600 text-slate-900 hover:bg-blue-700"
                    onClick={() => setOpen(false)}
                  >
                    Apply
                  </button>
                  <button
                    className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
                    onClick={() =>
                      setFilters({ zip: "", minPrice: "", maxPrice: "", status: "" })
                    }
                  >
                    Clear
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}


