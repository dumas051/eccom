import { Inngest } from "inngest";
import connectDB from "./db";
import User from "../models/User";
import Order from "../models/Order";

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: "eccom-next",
  // Add development mode for better debugging
  dev: process.env.NODE_ENV === 'development',
  // Add signing key for production
  signingKey: process.env.INNGEST_SIGNING_KEY
});

// inngest function to save user data to database
export const syncUserCreation = inngest.createFunction(
    { 
      id: 'sync-user-from-clerk',
      name: 'Sync User Creation from Clerk'
    },
    { event: 'clerk/user.created' },
    async ({ event, step }) => {
        try {
            console.log('Processing user creation event:', event);
            
            const { id, first_name, last_name, email_addresses, image_url } = event.data;
            
            if (!id || !email_addresses || email_addresses.length === 0) {
                throw new Error('Missing required user data');
            }
            
            const userData = {
                _id: id,
                name: `${first_name || ''} ${last_name || ''}`.trim() || 'Unknown User',
                email: email_addresses[0].email_address,
                imageUrl: image_url || ''
            };
            
            console.log('User data to create:', userData);
            
            await step.run('connect-database', async () => {
                await connectDB();
            });
            
            await step.run('create-user', async () => {
                const existingUser = await User.findById(id);
                if (existingUser) {
                    console.log('User already exists, updating instead');
                    await User.findByIdAndUpdate(id, userData, { new: true });
                } else {
                    await User.create(userData);
                }
            });
            
            console.log('User creation completed successfully');
            return { success: true, userId: id };
            
        } catch (error) {
            console.error("Error in syncUserCreation:", error);
            throw error;
        }
    });

// inngest function to update user data to database
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk',
        name: 'Sync User Update from Clerk'
    },
    { event: 'clerk/user.updated' },
    async ({ event, step }) => {
        try {
            console.log('Processing user update event:', event);
            
            const { id, first_name, last_name, email_addresses, image_url } = event.data;
            
            if (!id) {
                throw new Error('Missing user ID');
            }
            
            const userData = {
                _id: id,
                name: `${first_name || ''} ${last_name || ''}`.trim() || 'Unknown User',
                email: email_addresses?.[0]?.email_address || '',
                imageUrl: image_url || ''
            };
            
            console.log('User data to update:', userData);
            
            await step.run('connect-database', async () => {
                await connectDB();
            });
            
            await step.run('update-user', async () => {
                const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
                if (!updatedUser) {
                    console.log('User not found, creating new user');
                    await User.create(userData);
                }
            });
            
            console.log('User update completed successfully');
            return { success: true, userId: id };
            
        } catch (error) {
            console.error("Error in syncUserUpdation:", error);
            throw error;
        }
    });

// Inngest Function to delete user data from database
export const syncUserDeletion = inngest.createFunction(
    { 
        id: 'delete-user-with-clerk',
        name: 'Sync User Deletion from Clerk'
    },
    { event: 'clerk/user.deleted' },
    async ({ event, step }) => {
        try {
            console.log('Processing user deletion event:', event);
            
            const { id } = event.data;
            
            if (!id) {
                throw new Error('Missing user ID');
            }
            
            console.log('Deleting user with ID:', id);
            
            await step.run('connect-database', async () => {
                await connectDB();
            });
            
            await step.run('delete-user', async () => {
                const deletedUser = await User.findByIdAndDelete(id);
                if (!deletedUser) {
                    console.log('User not found for deletion');
                }
            });
            
            console.log('User deletion completed successfully');
            return { success: true, userId: id };
            
        } catch (error) {
            console.error("Error in syncUserDeletion:", error);
            throw error;
        }
    });

    // inngest function to create order in database
    export const createOrder = inngest.createFunction(
        {
            id: 'create-user-order',
            name: 'Create User Order'
        },
        { event: 'order/created' },
        async ({ event }) => {
            const order = {
                userId: event.data.userId,
                items: event.data.items,
                amount: event.data.amount,
                address: event.data.address,
                date: event.data.date
            };

            await connectDB();
            await Order.create(order);

            return { success: true, message: "Order created successfully" };
        }
    )