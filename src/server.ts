import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { initDb } from "./config";
import route from "./routes";
const stripe = require('stripe')('sk_test_51OvckGP3mxqok9yXybw4zbg9w92jHFQpJVisFPNBdbnoHr34StWQvGJ26udhXv97AjLnSWpdJGaEv0j4vMjMHfWN00S5XlgNgM');

dotenv.config();
const app = express();
const port = 5000; 
app.use(express.json());
app.use(cors());
app.use(cookieParser());
route(app);

initDb();

app.post('/api/create-checkout-session', async (req, res) => {
  const { amount, currency, items } = req.body;

  try {
      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: items.map((item:any) => ({
              price_data: {
                  currency: currency,
                  product_data: {
                      name: item.name,
                  },
                  unit_amount: item.price * 100, // Stripe cần số tiền dưới dạng cent
              },
              quantity: item.quantity,
          })),
          mode: 'payment',
          success_url: 'http://localhost:3000/', // URL sau khi thanh toán thành công
          cancel_url: 'http://localhost:3000/paymentcancel', // URL nếu người dùng hủy thanh toán
      });

      res.json({ id: session.id });
  } catch (error:any) {
      res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
