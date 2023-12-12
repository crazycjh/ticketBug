const express = require('express');
const flightTicketController = require('../controller/flightTicketController');

const router = express.Router();

router.post('/interval', flightTicketController.intervalDate);
router.post('/sequence', flightTicketController.sequenceDate);
router.post('/sequenceOpenJawDate', flightTicketController.sequenceOpenJawDate);

// router
// .route('/interval')
// .post(flightTicketController.intervalDate)

module.exports = router;
