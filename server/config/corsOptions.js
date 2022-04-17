// P.S.: For production, please remove the !origin condition in line 13


const allowedDomains = [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
]

// The second origin parameter is the origin coming 
// from the domain that made the request
const corsOptions = {
    origin: (origin, callback) => {
        if(!origin || allowedDomains.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Domain not allowed"))
        }
    },
    optionsSuccessStatus: 200
};

module.exports = {
    corsOptions,
}