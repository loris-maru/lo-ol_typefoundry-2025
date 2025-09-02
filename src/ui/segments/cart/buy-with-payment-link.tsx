export default function BuyWithPaymentLink({
  paymentLinkUrl,
  label = 'Buy now',
  className = '',
}: {
  paymentLinkUrl: string;
  label?: string;
  className?: string;
}) {
  return (
    <button
      onClick={() => (window.location.href = paymentLinkUrl)}
      className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 font-medium shadow-md transition ${className}`}
    >
      {label}
    </button>
  );
}
