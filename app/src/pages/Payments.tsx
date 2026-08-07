import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import "styles/pages/checkout-form.css"

function Payment() {
  // Define the type for stripePromise as Stripe | null
  const [stripePromise, setStripePromise] = useState<Stripe | null>(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/config").then(async (r) => {
      const { publishableKey } = await r.json();
      const stripeInstance = await loadStripe(publishableKey);
      setStripePromise(stripeInstance);
    });
  }, []);

  useEffect(() => {
    console.log(clientSecret);
    fetch("http://localhost:3001/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }).then(async (result) => {
      //const responseBody = await result.text(); // Read as text
      const responseBody = await result.json();
      var { clientSecret } = responseBody;

      setClientSecret(clientSecret);
    });
  }, []);

  const appearance = {
    theme: "night", // Dark theme
    variables: {
      colorPrimary: "#ffffff",
      colorBackground: "#1e1e2f",
      colorText: "#ffffff",
      colorTextSecondary: "#cccccc",
      colorDanger: "#ff5252",
      fontFamily: "Arial, sans-serif",
      spacingUnit: "10px",
      borderRadius: "8px",
      fontWeight: "bolder",
    },
    rules: {
      ".Input": {
        fontWeight: "bolder",
        color: "#ffffff",
      },
      ".Label": {
        fontWeight: "bolder",
        color: "#cccccc",
      },
    },
  } as const;

  return (
    <div className="checkout-form-div">
      <h1>Secure Payment Gateway</h1>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}

export default Payment;
