import { Router } from "express";
import { savePaymentDetails } from "../controller/payments-controller";

const router = Router();

router.post("/save-payment-details", savePaymentDetails);

export default router;
