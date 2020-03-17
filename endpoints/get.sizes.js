const getSizes = require('../services/getSizes');

module.exports = function setGetSizesEndpoint(router) {
  router.get('/sizes', async (req, res) => {
    console.debug('Sizes called.');
    let response = await getSizes(req.parsedConfig);
    console.debug(response);
    res.status(200).json(response);
  });
};
