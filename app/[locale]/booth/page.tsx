import { BoothLocator } from "@/components/booth/BoothLocator";

export default function BoothPage() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div>
      <BoothLocator apiKey={apiKey} />
    </div>
  );
}
