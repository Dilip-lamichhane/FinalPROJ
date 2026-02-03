# MongoDB Compass Configuration for KhojHub

## Connection String

The KhojHub application uses the following MongoDB connection string:

```
mongodb://localhost:27017/khojhub
```

## Setting up MongoDB Compass

1. **Download and Install MongoDB Compass**
   - Download from: https://www.mongodb.com/products/compass
   - Install the appropriate version for your operating system

2. **Connect to MongoDB**
   - Open MongoDB Compass
   - Use the connection string: `mongodb://localhost:27017/khojhub`
   - Click "Connect"

3. **Database Structure**
   
   Once connected, you'll see the `khojhub` database with the following collections:
   
   ### Users Collection
   - **Purpose**: Store user authentication and profile data
   - **Key Fields**: `clerkId`, `email`, `username`, `role`, `isActive`
   - **Indexes**: `email` (unique), `clerkId` (unique)

   ### Shops Collection
   - **Purpose**: Store shop information and location data
   - **Key Fields**: `name`, `address`, `location` (GeoJSON), `category`, `owner`
   - **Indexes**: `location` (2dsphere), `category`, `owner`

   ### Products Collection
   - **Purpose**: Store product information for each shop
   - **Key Fields**: `name`, `description`, `price`, `isAvailable`, `shop`
   - **Indexes**: `shop`, `isAvailable`

   ### Reviews Collection
   - **Purpose**: Store customer reviews for shops
   - **Key Fields**: `rating`, `comment`, `shop`, `user`
   - **Indexes**: `shop`, `user`

   ### Categories Collection
   - **Purpose**: Store shop categories
   - **Key Fields**: `name`, `description`, `color`, `parent`
   - **Indexes**: `name` (unique), `parent`

4. **Sample Queries for Testing**

   ### Find all active shops
   ```javascript
   db.shops.find({ isActive: true })
   ```

   ### Find shops within 5km radius
   ```javascript
   db.shops.find({
     location: {
       $geoWithin: {
         $centerSphere: [[longitude, latitude], 5 / 6378.1]
       }
     }
   })
   ```

   ### Find shops by category
   ```javascript
   db.shops.find({ category: categoryId })
   ```

   ### Get shop with average rating
   ```javascript
   db.shops.aggregate([
     { $match: { _id: ObjectId('shopId') } },
     {
       $lookup: {
         from: 'reviews',
         localField: '_id',
         foreignField: 'shop',
         as: 'reviews'
       }
     },
     {
       $addFields: {
         averageRating: { $avg: '$reviews.rating' },
         reviewCount: { $size: '$reviews' }
       }
     }
   ])
   ```

5. **Environment Variables**

   Make sure your `.env` file in the backend folder contains:
   ```
   MONGODB_URI=mongodb://localhost:27017/khojhub
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   ```

6. **Common Issues and Solutions**

   ### Connection Refused
   - Ensure MongoDB is running: `mongod`
   - Check if port 27017 is available
   - Verify firewall settings

   ### Authentication Required
   - If using MongoDB Atlas, use the connection string from Atlas dashboard
   - Update the connection string in your `.env` file

   ### Collection Not Found
   - Collections are created automatically when you insert data
   - Try inserting a test document to create the collection

7. **Development Tips**

   - Use the "Documents" tab to view and edit data
   - Use the "Indexes" tab to manage database indexes
   - Use the "Aggregation Pipeline" for complex queries
   - Export data for backup using the "Export Collection" feature
   - Import test data using the "Import Data" feature

8. **Production Considerations**

   - Enable authentication in production
   - Use MongoDB Atlas for cloud hosting
   - Set up regular backups
   - Monitor database performance
   - Use connection pooling in your application

## Testing the Connection

1. Start your MongoDB server
2. Start the KhojHub backend: `npm run dev` in the backend folder
3. Open MongoDB Compass and connect using the connection string
4. You should see the `khojhub` database with collections being created as you use the application

## Integration with Clerk

The application now uses Clerk for authentication, but user data is still stored in MongoDB. When a user signs up through Clerk:

1. Clerk creates the user in their system
2. The frontend syncs the user data to your MongoDB
3. User profile and role information is stored locally
4. JWT tokens are generated for API access

This hybrid approach provides the benefits of Clerk's authentication while maintaining control over your user data in MongoDB.