import express from 'express';
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getFeaturedListings,
  getUserListings,
  generateAdContentWithAI,
} from '../controllers/listingController.js';

const router = express.Router();

// Listings routes
router.get('/', getListings);
router.get('/featured', getFeaturedListings);
router.get('/user/:userId', getUserListings);
router.get('/:id', getListingById);
router.post('/', createListing);
router.put('/:id', updateListing);
router.delete('/:id', deleteListing);
router.post('/generate-content', generateAdContentWithAI);

export default router; 