import DetonationReveal from "@/components/DetonationReveal"; // Adjust path as needed

export default function Home() {
  return (
    <DetonationReveal>
      {/* EVERYTHING inside here renders AFTER the explosion */}
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <h1 className="text-6xl font-bold mb-4">WELCOME</h1>
        <p className="text-xl text-gray-400">You have entered the site.</p>
      </div>
    </DetonationReveal>
  );
}