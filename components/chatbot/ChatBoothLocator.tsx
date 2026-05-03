"use client";

import { useState } from "react";
import { Crosshair, MapPin, Loader2, Navigation } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type Booth = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
};

export function ChatBoothLocator() {
  const t = useTranslations("booth");
  const { locale } = useParams<{ locale: string }>();
  const [isLocating, setIsLocating] = useState(false);
  const [booths, setBooths] = useState<Booth[]>([]);
  const [error, setError] = useState("");

  const generateMockBooths = (lat: number, lng: number) => {
    return [
      {
        id: "1",
        name: "Govt. Primary School (Booth 42)",
        lat: lat + 0.005,
        lng: lng + 0.005,
        address: "Sector 4, Main Road"
      },
      {
        id: "2",
        name: "Community Center (Booth 43)",
        lat: lat - 0.004,
        lng: lng + 0.003,
        address: "Sector 5, Near Park"
      },
      {
        id: "3",
        name: "City College Hall (Booth 44)",
        lat: lat + 0.002,
        lng: lng - 0.006,
        address: "University Campus"
      }
    ];
  };

  const handleUseMyLocation = () => {
    setError("");
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setBooths(generateMockBooths(lat, lng));
          setIsLocating(false);
        },
        () => {
          setError(t("errorLocation"));
          setIsLocating(false);
        }
      );
    } else {
      setError(t("errorGeo"));
      setIsLocating(false);
    }
  };

  return (
    <div className="mt-3 w-full rounded-xl border border-orange-200 bg-orange-50/50 p-3 dark:border-orange-900/30 dark:bg-orange-900/10">
      {booths.length === 0 ? (
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
            <MapPin size={20} />
          </div>
          <h4 className="mb-1 text-sm font-bold text-slate-800 dark:text-slate-200">{t("findNearest")}</h4>
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
            {t("locationAccess")}
          </p>
          <button
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-70"
          >
            {isLocating ? <Loader2 className="animate-spin" size={14} /> : <Crosshair size={14} />}
            {t("useLocation")}
          </button>
          {error && <p className="mt-2 text-[10px] text-red-500">{error}</p>}
        </div>
      ) : (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{t("nearestStations")}</h4>
          <div className="flex max-h-[160px] flex-col gap-2 overflow-y-auto pr-1">
            {booths.map((booth, i) => (
              <motion.div
                key={booth.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{booth.name}</h5>
                    <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">{booth.address}</p>
                  </div>
                  <Link
                    href={`/${locale}/booth`}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-orange-100 text-orange-600 transition-colors hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50"
                    title={t("getDirections")}
                  >
                    <Navigation size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="pt-1 text-center">
            <Link
              href={`/${locale}/booth`}
              className="text-[10px] font-semibold text-orange-500 hover:text-orange-600 hover:underline"
            >
              {t("openMap")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
