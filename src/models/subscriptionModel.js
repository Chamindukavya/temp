import {Schema,models,model} from "mongoose";

const subscriptionSchema = new Schema({

    subscriptionType:{
        required: true,
        type: String,
    },
    validity:{
        required: true,
        type: String,
    },
    amount:{
        required: true,
        type: String,
        unique: true
    },
    description:{
        required: true,
        type: String
    }
});

const Subscription = models.Subscription || model("Subscription", subscriptionSchema);

export default Subscription;