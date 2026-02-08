import DetonationReveal from "@/components/DetonationReveal";
import EventWelcome from "@/components/EventWelcome";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Home({ params }: PageProps) {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);

  return (
    <DetonationReveal>
      <EventWelcome title={decodedId} />
    </DetonationReveal>
  );
}