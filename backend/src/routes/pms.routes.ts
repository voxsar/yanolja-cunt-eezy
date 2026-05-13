import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  createBusinessSource,
  createPromotion,
  getOperationalSnapshot,
  listBusinessSources,
  listChannelLogs,
  listChannelMessageSettings,
  listFolios,
  listGuestPortalRequests,
  listPaymentGatewaySettings,
  listPromotions,
  updateBusinessSource,
  updateChannelMessageSetting,
  updatePaymentGatewaySetting
} from '../controllers/pms.controller';

const router = express.Router();

router.use(authenticate);

router.get('/snapshot', getOperationalSnapshot);

router.get('/business-sources', listBusinessSources);
router.post('/business-sources', authorize('admin', 'manager'), createBusinessSource);
router.put('/business-sources/:id', authorize('admin', 'manager'), updateBusinessSource);

router.get('/promotions', listPromotions);
router.post('/promotions', authorize('admin', 'manager'), createPromotion);

router.get('/channel-logs', listChannelLogs);
router.get('/channel-message-settings', listChannelMessageSettings);
router.put('/channel-message-settings/:id', authorize('admin', 'manager'), updateChannelMessageSetting);

router.get('/payment-gateway-settings', listPaymentGatewaySettings);
router.put('/payment-gateway-settings/:id', authorize('admin', 'manager'), updatePaymentGatewaySetting);

router.get('/guest-portal-requests', listGuestPortalRequests);
router.get('/folios', listFolios);

export default router;
