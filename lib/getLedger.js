module.exports = function getLedger(something) {
    switch (something.toString().toLowerCase()) {
        case 'domain':
        case '1':
            return 1;
        case '0':
        case 'pool':
            return 0;
        case '2':
        case 'config':
            return 2;
        default:
            return 1;
    }
}