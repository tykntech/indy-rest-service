const getSizes = require('../services/getSizes');

module.exports = function setGetSizesEndpoint(router) {
  router.get('/sizes', async (req, res) => {
    console.debug('Sizes called.');
    const response = await getSizes(req.parsedConfig);
    res.status(200).json(response);
  });
};
