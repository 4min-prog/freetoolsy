export default function AdSlot({ slot = "bottom" }: { slot?: "top" | "bottom" }) {
  return (
    <div className="mt-8">
      <div
        id={slot === "top" ? "ad-top" : "ad-bottom"}
        style={{ minHeight: "90px" }}
        className="w-full bg-gray-100/5 border border-dashed border-gray-700 rounded flex items-center justify-center text-gray-500 text-sm"
      >
        Advertisement
      </div>
    </div>
  );
}