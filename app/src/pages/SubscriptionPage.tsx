import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "styles/pages/subscription-page.css";

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  const plans = [
    {
      name: t("free_plan"),
      price: "$0/month",
      features: Array.isArray(t("free_plan_features", { returnObjects: true }))
        ? (t("free_plan_features", { returnObjects: true }) as string[])
        : [],
    },
    {
      name: t("premium_plan"),
      price: "$15/month",
      features: Array.isArray(
        t("premium_plan_features", { returnObjects: true })
      )
        ? (t("premium_plan_features", { returnObjects: true }) as string[])
        : [],
      isHighlighted: true,
    },
    {
      name: t("team_plan"),
      price: "$50/month",
      features: Array.isArray(t("team_plan_features", { returnObjects: true }))
        ? (t("team_plan_features", { returnObjects: true }) as string[])
        : [],
    },
  ];

  const handlePlanSelection = (plan: any) => {
    navigate("/payment", { state: { planName: plan.name, price: plan.price } });
  };

  return (
    <div className="subscription-page">
      <header className="subscription-header">
        <h1>{t("choose_plan")}</h1>
        <p>{t("pick_best_plan")}</p>
      </header>

      <div className="plans-container">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`plan-card ${plan.isHighlighted ? "highlighted" : ""}`}
          >
            <h2>{plan.name}</h2>
            <p className="price">{plan.price}</p>
            <ul className="features-list">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <button onClick={() => handlePlanSelection(plan)}>
              {plan.isHighlighted ? t("get_started") : t("choose_plan_button")}
            </button>
          </div>
        ))}
      </div>

      <footer className="subscription-footer">
        <p>
          <a href="/contact">{t("contact_team")}</a>
        </p>
      </footer>
    </div>
  );
};

export default SubscriptionPage;
