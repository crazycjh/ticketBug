const express = require('express');
const ticketListController = require('../../controller/ticketListController');

const router = express.Router();

router.post('/', ticketListController.cheapTicketList);

// router
// .route('/interval')
// .post(flightTicketController.intervalDate)

module.exports = router;
