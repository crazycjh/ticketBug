const express = require('express');
const ticketListController = require('../../controller/ticketListController');

const router = express.Router();

router.get('/', ticketListController.cheapTicketList);

// router
// .route('/interval')
// .post(flightTicketController.intervalDate)

module.exports = router;
