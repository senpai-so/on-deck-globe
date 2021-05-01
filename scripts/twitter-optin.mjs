import * as firestore from '@google-cloud/firestore'
import { TwitterClient } from 'twitter-api-client';

const twitterClient = new TwitterClient({
	apiKey: process.env.TWITTER_API_KEY, 
	apiSecret: process.env.TWITTER_API_SECRET, 
	accessToken: process.env.TWITTER_ACCESS_TOKEN, 
	accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

twitterClient.tweets.search({ q: '@ondeckglobe #MakeMePublic', count: 100 }).then(tweets => {
	const db = new firestore.Firestore({
	  projectId: process.env.GCLOUD_PROJECT,
	  credentials: JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString())
	});

	const collection = db.collection(process.env.FIREBASE_COLLECTION_USERS)
	collection.get().then(data => {
		const {docs} = data;
		var userMap = {};
		docs.forEach(doc => {
			var data = doc.data();
			if (data['fellow']['twitterId']) {
				userMap[data['fellow']['twitterId'].toLowerCase()] = doc.id;
			}
		})

		tweets['statuses'].forEach(tweet => {
			if (tweet['text'].includes("#MakeMePublic") 
				&& tweet['retweeted'] == false 
				&& tweet['user']['screen_name'].toLowerCase() in userMap) {
				var doc = collection.doc(userMap[tweet['user']['screen_name'].toLowerCase()]);
				db.runTransaction((transaction) => {
			        transaction.update(doc, {isPublic: true});
				}).then(() => {
				    console.log("Transaction successfully committed!");
				}).catch((error) => {
				    console.log("Transaction failed: ", error);
				});
			}
		})
	})
})
