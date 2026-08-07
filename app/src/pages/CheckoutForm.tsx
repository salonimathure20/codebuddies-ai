import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useLocation } from "react-router-dom";
import { PaymentIntent, StripeError } from "@stripe/stripe-js";
import "styles/pages/checkout-form.css";

// Define the response type explicitly
interface ConfirmPaymentResponse {
  error?: StripeError;
  paymentIntent?: PaymentIntent;
}

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe or elements not loaded");
      return;
    }

    setIsProcessing(true);

    const { planName, price } = location.state || {
      planName: "Unknown Plan",
      price: "$0",
    };

    // Save plan details to localStorage
    localStorage.setItem("selectedPlan", JSON.stringify({ planName, price }));

    // Proceed with payment confirmation
    const response = (await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
    })) as ConfirmPaymentResponse;

    console.log("Stripe response:", response);

    if (response.error) {
      console.error("Payment error:", response.error);
      setMessage(response.error.message || "An error occurred.");
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" className="payment-form " onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isProcessing || !stripe || !elements} id="submit">
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
