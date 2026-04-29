"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { epicSchema, type EpicFormValues } from "@/lib/validators";
import type { VoterDetails } from "@/lib/eci-apis";
import { ExternalLink } from "lucide-react";

export function VoterVerifyForm() {
  const t = useTranslations("verify");
  const tCommon = useTranslations("common");
  const [result, setResult] = useState<VoterDetails | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EpicFormValues>({
    resolver: zodResolver(epicSchema),
  });

  async function onSubmit({ epic }: EpicFormValues) {
    const res = await fetch("/api/verify-voter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ epic }),
    });
    const data: VoterDetails = await res.json();
    setResult(data);
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="epic" className="block text-sm font-medium">{t("epicLabel")}</label>
          <input
            id="epic"
            {...register("epic")}
            placeholder={t("epicPlaceholder")}
            className="mt-1 min-h-[44px] w-full rounded-xl border px-3 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {errors.epic && (
            <p className="mt-1 text-xs text-red-500" role="alert">{errors.epic.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-[44px] w-full rounded-xl bg-orange-500 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {isSubmitting ? tCommon("loading") : tCommon("verify")}
        </button>
      </form>

      {result && (
        <div
          className={`rounded-2xl border p-5 ${
            result.status === "not_found"
              ? "border-red-300 bg-red-50"
              : result.status === "redirect"
              ? "border-blue-300 bg-blue-50"
              : "border-green-300 bg-green-50"
          }`}
        >
          {result.status === "not_found" && (
            <p className="text-sm text-red-700">{t("notFound")}</p>
          )}

          {result.status === "redirect" && (
            <div className="space-y-3">
              <p className="text-sm text-blue-800">
                Voter verification is available directly on the official ECI portal.
                Click below to search with your EPIC number.
              </p>
              <a
                href={result.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Search on ECI Portal <ExternalLink size={14} />
              </a>
            </div>
          )}

          {result.status === "registered" && (
            <dl className="space-y-2 text-sm">
              <div><dt className="font-semibold">{t("constituency")}</dt><dd>{result.constituency}</dd></div>
              <div><dt className="font-semibold">{t("pollingStation")}</dt><dd>{result.pollingStation}</dd></div>
              <div><dt className="font-semibold">{t("status")}</dt><dd className="font-medium text-green-700">{t("registered")}</dd></div>
            </dl>
          )}
        </div>
      )}
    </section>
  );
}
