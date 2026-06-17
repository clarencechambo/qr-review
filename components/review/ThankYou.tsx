export default function ThankYou() {
  return (
    <div className="text-center py-8">
      <div
        className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: "#E8174B1a", color: "#E8174B" }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-3 text-gray-900">Thank you!</h2>
      <p className="text-gray-600">
        Your feedback means a lot to us. We'll use it to keep improving your experience.
      </p>
    </div>
  );
}
