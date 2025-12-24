// components/WhatsappChat.js
export default function WhatsappChat() {
  return (
    <a
      href="https://wa.me/01868944080" // <-- Replace with your WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-transform transform hover:scale-110"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12c0 4.418-3.582 8-8 8a8 8 0 01-7.95-7h-.05l-2 2V4l2 2h.05A8 8 0 0121 12z"
        />
      </svg>
    </a>
  );
}