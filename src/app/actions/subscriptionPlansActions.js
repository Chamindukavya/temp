'use server'
import Subscription from "../../models/subscriptionModel";
import dbConnect from "@/lib/mongoose";

export const getSubscriptionPlans = async () => {
    try {
      await dbConnect();
      const subscriptions = await Subscription.find().lean(); 
      const plainSubscriptions = subscriptions.map(subscription => {
        const plainSubscription = {
          ...subscription,
          _id: subscription._id.toString(), 
        };
        return plainSubscription;
      });

  
      return plainSubscriptions;
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      throw error;
    }
  };